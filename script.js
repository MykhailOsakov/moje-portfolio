const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const yearLabel = document.querySelector("[data-current-year]");

if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("[data-profile-image]").forEach((image) => {
  const portrait = image.closest("[data-portrait]");

  if (!portrait) return;

  const showPhoto = () => {
    if (image.naturalWidth === 0) return;

    portrait.classList.add("has-photo");
    portrait.setAttribute("aria-label", "Portrét Osakovskyi Mykhail");
  };

  const showPlaceholder = () => {
    portrait.classList.remove("has-photo");
    portrait.setAttribute("aria-label", "Miesto na portrétnu fotografiu");
  };

  image.addEventListener("load", showPhoto);
  image.addEventListener("error", showPlaceholder);

  if (image.complete) {
    if (image.naturalWidth > 0) {
      showPhoto();
    } else {
      showPlaceholder();
    }
  }
});

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuToggle || !navLinks) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Otvoriť navigáciu");
  navLinks.classList.remove("is-open");

  if (restoreFocus) menuToggle.focus();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Otvoriť navigáciu" : "Zavrieť navigáciu",
    );
    navLinks.classList.toggle("is-open", !isExpanded);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu({ restoreFocus: true });
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("is-open") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

const revealElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const trackedSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && navItems.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navItems.forEach((item) => {
          const isActive = item.getAttribute("href") === `#${entry.target.id}`;
          item.classList.toggle("is-active", isActive);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );

  trackedSections.forEach((section) => sectionObserver.observe(section));
}
