(function () {
  "use strict";

  /* ----------------------------------------------------------
     Footer year
     ---------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     Mobile nav toggle
     ---------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----------------------------------------------------------
     Logo videos (nav + footer): respect prefers-reduced-motion.
     Swap each autoplaying animation for its static logo mark
     when the visitor's OS setting asks for reduced motion.
     ---------------------------------------------------------- */
  var logoWraps = document.querySelectorAll(".logo-video-wrap");
  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function applyMotionPreference(prefersReduced) {
    logoWraps.forEach(function (wrap) {
      var video = wrap.querySelector(".logo-video");
      var still = wrap.querySelector(".logo-still");
      if (!video || !still) return;

      if (prefersReduced) {
        video.pause();
        video.hidden = true;
        still.hidden = false;
      } else {
        video.hidden = false;
        still.hidden = true;
        video.play().catch(function () {
          /* Autoplay can be blocked by the browser; the poster image still shows. */
        });
      }
    });
  }

  applyMotionPreference(reducedMotionQuery.matches);

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", function (event) {
      applyMotionPreference(event.matches);
    });
  }

  /* ----------------------------------------------------------
     Get Involved form: no backend, so we open the visitor's
     email client with a pre-filled mailto: link.

     To swap in a Google Form later, replace the <form id="signupForm">
     block in index.html with something like:

     <iframe src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
             width="100%" height="900" frameborder="0">Loading…</iframe>

     ...and delete this block below.
     ---------------------------------------------------------- */
  var signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = signupForm.name.value.trim();
      var contact = signupForm.contact.value.trim();
      var interest = signupForm.interest.value;
      var message = signupForm.message.value.trim();

      var subject = "RTC Foundation — Get Involved: " + (interest || "General");

      var bodyLines = [
        "Name: " + name,
        "Email/Phone: " + contact,
        "Area of interest: " + interest,
        "",
        "Message:",
        message || "(none)"
      ];

      var mailto =
        "mailto:rtcfoundation23@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }
})();
