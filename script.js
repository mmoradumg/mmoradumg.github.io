document.addEventListener("DOMContentLoaded", () => {

  const html = document.documentElement;
  const languageToggle = document.getElementById("languageToggle");

  let language = localStorage.getItem("umg-language") || "en";


  function applyLanguage() {

    const elements = document.querySelectorAll("[data-en][data-ar]");

    elements.forEach(element => {

      const value =
        language === "ar"
          ? element.getAttribute("data-ar")
          : element.getAttribute("data-en");

      if (value.includes("<br>")) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }

    });


    if (language === "ar") {

      html.setAttribute("lang", "ar");
      html.setAttribute("dir", "rtl");

      languageToggle.textContent = "English";

    } else {

      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");

      languageToggle.textContent = "العربية";

    }

    localStorage.setItem("umg-language", language);
  }


  languageToggle.addEventListener("click", () => {

    language = language === "en" ? "ar" : "en";

    applyLanguage();

  });


  applyLanguage();


  /* Scroll Reveal */

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );


  document
    .querySelectorAll(".section, .leadership-section")
    .forEach(section => {

      observer.observe(section);

    });


  /* Header background while scrolling */

  const header = document.querySelector(".site-header");

  window.addEventListener(
    "scroll",
    () => {

      if (window.scrollY > 40) {

        header.style.background =
          "rgba(5,7,11,.90)";

      } else {

        header.style.background =
          "rgba(7,9,13,.58)";

      }

    },
    { passive: true }
  );


  /* Close automatic hash jump behavior smoothly */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (
        targetId &&
        targetId !== "#"
      ) {

        const target =
          document.querySelector(targetId);

        if (target) {

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }

    });

  });

});