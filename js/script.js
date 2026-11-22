/* ============================================================
   3M DISTRIBUTION — Interactions
   JavaScript Vanilla, sans dépendance externe.
============================================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     Configuration du site
     Modifier uniquement les valeurs ci-dessous pour mettre à jour
     les coordonnées affichées sur l’ensemble du site.
  ------------------------------------------------------------ */
  const SITE_CONFIG = {
    phone: "+00\u00A000\u00A000\u00A000\u00A000",
    phoneHref: "tel:+000000000000",
    email: "contact@3mdistribution.com",
    address: "Votre adresse — Ville, Pays",
    hours: "Lun – Sam · 8h – 18h",

    // Numéro WhatsApp au format international, sans « + » ni espaces.
    // Exemple : "2250700000000". Laisser vide pour masquer le bouton.
    whatsappNumber: "",
    whatsappMessage:
      "Bonjour 3M DISTRIBUTION, je souhaite obtenir des informations sur vos produits."
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const $ = (selector, context) => (context || document).querySelector(selector);
  const $$ = (selector, context) =>
    Array.prototype.slice.call((context || document).querySelectorAll(selector));

  /* ------------------------------------------------------------
     Coordonnées & WhatsApp
  ------------------------------------------------------------ */
  function applySiteConfig() {
    $$("[data-contact]").forEach(function (element) {
      const key = element.getAttribute("data-contact");
      if (SITE_CONFIG[key]) {
        element.textContent = SITE_CONFIG[key];
      }
    });

    $$("[data-contact-link]").forEach(function (link) {
      const key = link.getAttribute("data-contact-link");
      if (key === "phone") {
        link.setAttribute("href", SITE_CONFIG.phoneHref);
      }
      if (key === "email") {
        link.setAttribute("href", "mailto:" + SITE_CONFIG.email);
      }
    });

    const whatsappDigits = String(SITE_CONFIG.whatsappNumber || "").replace(/\D/g, "");
    $$("[data-whatsapp]").forEach(function (link) {
      if (whatsappDigits.length >= 8) {
        link.hidden = false;
        link.setAttribute(
          "href",
          "https://wa.me/" +
            whatsappDigits +
            "?text=" +
            encodeURIComponent(SITE_CONFIG.whatsappMessage)
        );
      } else {
        link.hidden = true;
      }
    });
  }

  /* ------------------------------------------------------------
     Header au scroll + bouton retour en haut
  ------------------------------------------------------------ */
  function initScrollUI() {
    const header = $("#site-header");
    const backToTop = $(".back-to-top");
    let ticking = false;

    function update() {
      const y = window.scrollY || window.pageYOffset;
      if (header) {
        header.classList.toggle("is-scrolled", y > 24);
      }
      if (backToTop) {
        backToTop.classList.toggle("is-visible", y > 640);
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });
      });
    }

    update();
  }

  /* ------------------------------------------------------------
     Menu mobile accessible
  ------------------------------------------------------------ */
  function initMobileMenu() {
    const toggle = $(".menu-toggle");
    const menu = $("#mobile-menu");
    if (!toggle || !menu) return;

    let lastFocused = null;
    const isOpen = () => menu.classList.contains("is-open");

    function getFocusable() {
      return $$("a[href], button:not([disabled])", menu).filter(function (el) {
        return el.getClientRects().length > 0;
      });
    }

    function openMenu() {
      lastFocused = document.activeElement;
      menu.inert = false;
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
      document.body.classList.add("menu-open");

      const focusable = getFocusable();
      if (focusable.length) {
        window.setTimeout(function () {
          focusable[0].focus();
        }, 120);
      }
    }

    function closeMenu(returnFocus) {
      menu.classList.remove("is-open");
      menu.inert = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      document.body.classList.remove("menu-open");

      if (returnFocus !== false) {
        const target = lastFocused || toggle;
        window.setTimeout(function () {
          target.focus();
        }, 60);
      }
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    $$("a", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [toggle].concat(getFocusable());
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1160 && isOpen()) {
        closeMenu(false);
      }
    });
  }

  /* ------------------------------------------------------------
     Navigation active selon la section visible
  ------------------------------------------------------------ */
  function initScrollSpy() {
    const links = $$("[data-nav]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const sections = links
      .map(function (link) {
        return document.getElementById(link.getAttribute("data-nav"));
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            if (link.getAttribute("data-nav") === entry.target.id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ------------------------------------------------------------
     Apparition progressive des sections au scroll
  ------------------------------------------------------------ */
  function initReveal() {
    const elements = $$("[data-reveal]");
    if (!elements.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const delay = parseInt(entry.target.getAttribute("data-delay") || "0", 10);
          entry.target.style.setProperty(
            "--reveal-delay",
            String(delay * 80) + "ms"
          );
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ------------------------------------------------------------
     Filtres du catalogue produits
  ------------------------------------------------------------ */
  function initProductFilters() {
    const buttons = $$("[data-filter]");
    const cards = $$(".product-card");
    const filterStatus = $("#filter-status");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.getAttribute("data-filter");
        let visibleCount = 0;

        buttons.forEach(function (item) {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });

        cards.forEach(function (card) {
          const show =
            filter === "all" || card.getAttribute("data-group") === filter;

          card.classList.toggle("is-hidden", !show);

          if (show) {
            visibleCount += 1;
            card.classList.remove("is-entering");
            void card.offsetWidth;
            card.classList.add("is-entering");
          }
        });

        if (filterStatus) {
          filterStatus.textContent =
            filter === "all"
              ? "Toutes les catégories sont affichées."
              : visibleCount +
                " " +
                (visibleCount === 1 ? "catégorie affichée" : "catégories affichées") +
                " pour « " +
                button.textContent.trim() +
                " ».";
        }
      });
    });
  }

  /* ------------------------------------------------------------
     Formulaire de contact
     La validation est locale. Le point d’intégration backend est
     indiqué dans le gestionnaire de soumission ci-dessous.
  ------------------------------------------------------------ */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const status = $("#form-status");
    const submitButton = $(".contact-form__submit", form);
    const submitLabel = $(".contact-form__submit-label", form);

    const validators = {
      name: function (value) {
        return value.trim().length >= 2
          ? ""
          : "Merci d’indiquer votre nom et prénom.";
      },
      phone: function (value) {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15
          ? ""
          : "Merci d’indiquer un numéro de téléphone valide.";
      },
      email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
          ? ""
          : "Merci d’indiquer une adresse e-mail valide.";
      },
      subject: function (value) {
        return value ? "" : "Merci de sélectionner un sujet.";
      },
      message: function (value) {
        return value.trim().length >= 10
          ? ""
          : "Merci de détailler votre demande (10 caractères minimum).";
      }
    };

    function setError(field, message) {
      if (!field) return;
      const wrapper = field.closest(".field");
      const error = document.getElementById(field.id + "-error");

      if (wrapper) {
        wrapper.classList.toggle("has-error", Boolean(message));
      }
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) {
        error.textContent = message;
      }
    }

    function clearStatus() {
      if (!status) return;
      status.textContent = "";
      status.classList.remove("is-error");
    }

    $$("input, select, textarea", form).forEach(function (field) {
      const eventName =
        field.tagName === "SELECT" || field.type === "checkbox"
          ? "change"
          : "input";

      field.addEventListener(eventName, function () {
        if (field.getAttribute("aria-invalid") === "true") {
          setError(field, "");
        }
        clearStatus();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (submitButton && submitButton.disabled) return;

      let firstInvalid = null;

      Object.keys(validators).forEach(function (name) {
        const field = form.elements[name];
        if (!field) return;
        const message = validators[name](field.value);
        setError(field, message);
        if (message && !firstInvalid) {
          firstInvalid = field;
        }
      });

      const consent = form.elements.consent;
      const consentMessage = consent && consent.checked
        ? ""
        : "Merci d’accepter l’utilisation de vos informations.";
      setError(consent, consentMessage);
      if (consentMessage && !firstInvalid) {
        firstInvalid = consent;
      }

      if (firstInvalid) {
        if (status) {
          status.textContent = "Merci de vérifier les champs indiqués.";
          status.classList.add("is-error");
        }
        firstInvalid.focus();
        return;
      }

      // Champ anti-spam : si rempli, on simule une réussite sans envoi.
      if (form.elements.website && form.elements.website.value) {
        form.reset();
        clearStatus();
        return;
      }

      clearStatus();

      if (submitButton) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Envoi en cours…";

      /*
        Intégration backend ultérieure :
        Remplacer la temporisation ci-dessous par un appel réseau, par exemple :

        fetch("/api/contact", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Erreur serveur");
            return response.json();
          })
          .then(function () {
            form.reset();
            status.textContent = "Merci ! Votre demande a bien été envoyée.";
          })
          .catch(function () {
            status.textContent = "Une erreur est survenue. Merci de réessayer.";
            status.classList.add("is-error");
          })
          .finally(function () {
            submitButton.disabled = false;
            submitLabel.textContent = "Envoyer la demande";
          });
      */

      window.setTimeout(function () {
        form.reset();

        $$("input, select, textarea", form).forEach(function (field) {
          field.setAttribute("aria-invalid", "false");
          const wrapper = field.closest(".field");
          if (wrapper) wrapper.classList.remove("has-error");
        });
        $$(".field__error", form).forEach(function (error) {
          error.textContent = "";
        });

        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = "Envoyer la demande";
        if (status) {
          status.textContent =
            "Merci ! Votre demande a bien été prise en compte. Nous vous répondrons dans les meilleurs délais.";
          status.classList.remove("is-error");
        }
      }, 900);
    });
  }

  /* ------------------------------------------------------------
     Initialisation
  ------------------------------------------------------------ */
  function init() {
    applySiteConfig();
    initScrollUI();
    initMobileMenu();
    initScrollSpy();
    initReveal();
    initProductFilters();
    initContactForm();

    const year = $("#year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
