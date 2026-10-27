# UMG Music — Hosting Decision (ADR-001)
Date: 2026-10-27
Status: Selected for technical validation, **not deployed or billed**
Owner: UMG; human approval needed before paid resources

## Decision

**GPU and pre-trained model**
- First real inference validation: RunPod **Secure Cloud Pod**, NVIDIA RTX 4090 with **24 GiB VRAM** (published benchmark rate **$0.89/hour**).
- Pre-trained models: ACE-Step 1.5 **XL-SFT** + **5Hz LM 4B**, without training or fine tuning.
- After verifying lyrics-to-vocals, reproducibility and cost, move the GPU inference service to **RunPod Serverless flex workers** with **RTX 4090 24 GB** and **zero minimum active workers** to avoid idle GPU billing (published **$1.10/hour of metered worker execution**).
- If cold-start latency or checkpoints download time makes Serverless unsuitable, use an on-demand Secure Pod as a reversible fallback, not an always-on default.
- Oracle OCI A10 VM not selected now: published **$2.62/hour**, with no automatic song-quality advantage at identical model settings.

## Financial gate

Pricing checked against published provider pages on Oct 27, 2026:
- https://www.runpod.io/pricing
- https://www.oracle.com/cloud/iaas-paas/

Pricing, GPU availability and storage/network charges can change. Work out the real cost of a 3- to 4-minute song from **measured billed worker time, cold start, model load, queueing, storage and egress**; do not derive this from generated audio duration.

Example arithmetic only: 5 minutes of metered serverless GPU worker execution at $1.10/hour = approx $0.0917 GPU time. **Not an observed song cost.** A 10-hour Secure Pod trial at $0.89/hour = $8.90 GPU compute, plus storage and other charges. Do not provision this automatically.

## Architecture

Website / iPhone / desktop are thin clients of the same authenticated UMG HTTPS API:
Client -> FastAPI API (auth, consent, ownership, quotas) -> PostgreSQL + queue -> private GPU worker -> temporary audio store -> authorized playback, download or per-user cloud save.

- Preserve independent deployment of music generation from GitHub Pages.
- Never expose a RunPod token, model control port, direct worker endpoint, database connection, or generated audio belonging to other users to public clients.
- Site upload and frontend remain on GitHub Pages. User-owned Google Drive/iCloud can be optional export targets; public user files must not go into the owner’s personal drive.
- Store reference files and generated results only with appropriate permissions and retention.
- Cap cost and job concurrency, implement usage monitoring and disable paid resources at budget threshold before production launch.

## Acceptance tests before launching publicly

1. Run an actual XL-SFT + LM4B inference on RTX 4090 and record GPU memory, runtime, fees, model commit IDs and saved audio artifact.
2. Produce three varied prompts: Egyptian Shaabi/Mahraganat Arabic vocals, general Arabic pop, and English instrumental. Review intelligibility, musical coherence, output integrity, and style adherence.
3. Test cold start and horizontal queue scaling on Serverless flex; report effective total cost for 10, 100 and 1,000 songs using observed statistics.
4. Complete secure backend endpoints, job ownership and browser session, authorization, quotas, safe media upload, rate limiting and abuse prevention.
5. Run API integration and real device browser checks (iPhone Safari and desktop), then optional signed Flutter iOS app.
6. Obtain explicit human signoff for charges and release. No main merge or production deployment until then.

## Sources
- RunPod: https://www.runpod.io/pricing
- RunPod Serverless: https://www.runpod.io/product/serverless
- ACE-Step recommended GPU/models: https://github.com/ace-step/ACE-Step-1.5/blob/main/docs/en/INSTALL.md
- ACE-Step model checkpoint: https://huggingface.co/ACE-Step/acestep-v15-xl-sft
- Oracle GPU shape pricing: https://www.oracle.com/cloud/iaas-paas/
