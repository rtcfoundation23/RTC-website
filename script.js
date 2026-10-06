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
        /* Lazy videos (the footer one) wait until scrolled into view. */
        if (!video.hasAttribute("data-lazy") || video.dataset.inView === "true") {
          video.play().catch(function () {
            /* Autoplay can be blocked by the browser; the poster image still shows. */
          });
        }
      }
    });
  }

  applyMotionPreference(reducedMotionQuery.matches);

  /* Footer logo: don't download or decode the animation until the
     visitor actually scrolls near it, and pause it when it leaves
     view. Keeps the first load light and saves battery on phones. */
  var lazyVideos = document.querySelectorAll(".logo-video[data-lazy]");

  if (lazyVideos.length) {
    if ("IntersectionObserver" in window) {
      var lazyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var video = entry.target;
            video.dataset.inView = entry.isIntersecting ? "true" : "false";
            if (reducedMotionQuery.matches) return;
            if (entry.isIntersecting) {
              video.play().catch(function () {});
            } else {
              video.pause();
            }
          });
        },
        { rootMargin: "200px" }
      );
      lazyVideos.forEach(function (video) {
        lazyObserver.observe(video);
      });
    } else {
      /* Very old browsers: just play it. */
      lazyVideos.forEach(function (video) {
        video.dataset.inView = "true";
        if (!reducedMotionQuery.matches) video.play().catch(function () {});
      });
    }
  }

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", function (event) {
      applyMotionPreference(event.matches);
    });
  }

  /* ----------------------------------------------------------
     Donate section: "Copy" buttons. Each copies the .donate-number
     shown in its own card, so the number lives in one place only.
     Falls back to a hidden textarea where the async Clipboard API
     isn't available (older browsers, non-HTTPS preview).
     ---------------------------------------------------------- */
  var copyStatus = document.getElementById("copyStatus");

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) {
        resolve();
      } else {
        reject(new Error("copy failed"));
      }
    });
  }

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    var originalLabel = button.textContent;
    var resetTimer;

    button.addEventListener("click", function () {
      var card = button.closest(".donate-card");
      var numberEl = card && card.querySelector(".donate-number");
      if (!numberEl) return;

      var what = button.getAttribute("data-copy-label") || "Number";

      copyText(numberEl.textContent.trim()).then(
        function () {
          button.textContent = "Copied";
          button.classList.add("is-copied");
          if (copyStatus) copyStatus.textContent = what + " copied to clipboard.";
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            button.textContent = originalLabel;
            button.classList.remove("is-copied");
          }, 2000);
        },
        function () {
          if (copyStatus) {
            copyStatus.textContent =
              "Couldn't copy automatically. Please select the number and copy it manually.";
          }
        }
      );
    });
  });

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
