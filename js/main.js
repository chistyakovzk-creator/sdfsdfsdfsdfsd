(function () {
  const header = document.getElementById("header");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("nav-menu");
  const NOTIFY_KEY = "prime-motors-notify-seen";
  const NOTIFY_DELAY = 6000;
  const OFFER_START_KEY = "prime-motors-offer-start";
  const OFFER_VERSION_KEY = "prime-motors-offer-version";
  const OFFER_VERSION = "2";
  const OFFER_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
  const MS_DAY = 86400000;
  const MS_HOUR = 3600000;
  const MS_MINUTE = 60000;

  function formatPhone(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7") && digits.length) digits = "7" + digits;

    let formatted = "+7";
    if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ") " + digits.slice(4, 7);
    if (digits.length >= 7) formatted += "-" + digits.slice(7, 9);
    if (digits.length >= 9) formatted += "-" + digits.slice(9, 11);
    return formatted;
  }

  function bindPhoneMask(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  }

  function setMenuOpen(open) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      setMenuOpen(!navMenu.classList.contains("is-open"));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__list a[href^='#']");

  if (sections.length && navLinks.length) {
    const linkMap = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) linkMap.set(id, link);
    });

    const onScroll = () => {
      const offset = (header?.offsetHeight || 76) + 80;
      let current = sections[0]?.id;

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      });

      navLinks.forEach((l) => l.classList.remove("is-active"));
      const active = linkMap.get(current);
      if (active) active.classList.add("is-active");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("header--scrolled", window.scrollY > 48);
  });

  const revealEls = document.querySelectorAll(".reveal, .reveal-child");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  function getOfferRemainingMs() {
    try {
      if (localStorage.getItem(OFFER_VERSION_KEY) !== OFFER_VERSION) {
        localStorage.setItem(OFFER_VERSION_KEY, OFFER_VERSION);
        localStorage.setItem(OFFER_START_KEY, String(Date.now()));
        localStorage.removeItem("prime-motors-offer-end");
      }

      let start = Number(localStorage.getItem(OFFER_START_KEY));
      if (!Number.isFinite(start)) {
        start = Date.now();
        localStorage.setItem(OFFER_START_KEY, String(start));
      }

      const end = start + OFFER_DURATION_MS;
      return Math.max(0, end - Date.now());
    } catch (_) {
      return OFFER_DURATION_MS;
    }
  }

  function padCountdown(value) {
    return String(Math.max(0, value)).padStart(2, "0");
  }

  let offerCountdownTick = null;

  function renderOfferCountdown(parts) {
    const diff = getOfferRemainingMs();
    const days = Math.floor(diff / MS_DAY);
    const hours = Math.floor((diff % MS_DAY) / MS_HOUR);
    const minutes = Math.floor((diff % MS_HOUR) / MS_MINUTE);
    const seconds = Math.floor((diff % MS_MINUTE) / 1000);

    if (parts.days) parts.days.textContent = padCountdown(days);
    if (parts.hours) parts.hours.textContent = padCountdown(hours);
    if (parts.minutes) parts.minutes.textContent = padCountdown(minutes);
    if (parts.seconds) parts.seconds.textContent = padCountdown(seconds);
  }

  function initOfferCountdown() {
    const countdown = document.getElementById("notify-countdown");
    if (!countdown) return;

    const parts = {
      days: countdown.querySelector('[data-countdown="days"]'),
      hours: countdown.querySelector('[data-countdown="hours"]'),
      minutes: countdown.querySelector('[data-countdown="minutes"]'),
      seconds: countdown.querySelector('[data-countdown="seconds"]'),
    };

    const tick = () => renderOfferCountdown(parts);

    tick();
    if (offerCountdownTick) window.clearInterval(offerCountdownTick);
    offerCountdownTick = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tick();
    });

    return tick;
  }

  const refreshOfferCountdown = initOfferCountdown();

  /* Contact notification */
  const notify = document.getElementById("notify");
  const notifyFabWrap = document.getElementById("notify-fab-wrap");
  const notifyFab = document.getElementById("notify-fab");
  const notifyFabHint = document.getElementById("notify-fab-hint");
  const notifyMain = document.getElementById("notify-main");
  const notifyCallback = document.getElementById("notify-callback");
  const notifyCallbackForm = document.getElementById("notify-callback-form");
  const notifyFormMsg = document.getElementById("notify-form-msg");

  function showNotifyPanel(panel) {
    if (!notifyMain || !notifyCallback) return;
    const isCallback = panel === "callback";
    notifyMain.hidden = isCallback;
    notifyCallback.hidden = !isCallback;
  }

  function openNotify() {
    if (!notify) return;
    notify.removeAttribute("hidden");
    notify.classList.add("is-open");
    document.body.classList.add("notify-open");
    showNotifyPanel("main");
    refreshOfferCountdown?.();
    notifyFabWrap?.classList.add("is-hidden");
    const firstFocus = notify.querySelector(
      notifyCallback.hidden ? ".notify-option__btn" : "input"
    );
    firstFocus?.focus();
  }

  function closeNotify(remember) {
    if (!notify) return;
    notify.classList.remove("is-open");
    notify.setAttribute("hidden", "");
    document.body.classList.remove("notify-open");
    notifyFabWrap?.classList.remove("is-hidden");
    showNotifyPanel("main");
    if (remember) {
      try {
        sessionStorage.setItem(NOTIFY_KEY, "1");
      } catch (_) {}
    }
  }

  if (notify) {
    document.querySelectorAll("[data-open-notify]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openNotify();
      });
    });

    notifyFab?.addEventListener("click", openNotify);
    notifyFabHint?.addEventListener("click", openNotify);

    notify.querySelectorAll("[data-close-notify]").forEach((el) => {
      el.addEventListener("click", () => closeNotify(true));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && notify.classList.contains("is-open")) {
        closeNotify(true);
      }
    });

    notify.querySelector("[data-show-callback]")?.addEventListener("click", () => {
      showNotifyPanel("callback");
      notifyCallbackForm?.querySelector('input[name="name"]')?.focus();
    });

    notify.querySelector("[data-show-main]")?.addEventListener("click", () => {
      showNotifyPanel("main");
    });

    bindPhoneMask(notifyCallbackForm?.querySelector('input[name="phone"]'));

    notifyCallbackForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!notifyCallbackForm.checkValidity()) {
        notifyCallbackForm.reportValidity();
        return;
      }
      if (notifyFormMsg) {
        notifyFormMsg.hidden = false;
        notifyFormMsg.textContent = "Спасибо! Мы перезвоним вам в ближайшее время.";
      }
      notifyCallbackForm.reset();
      setTimeout(() => closeNotify(true), 2200);
    });

    let showTimer;
    try {
      if (!sessionStorage.getItem(NOTIFY_KEY)) {
        showTimer = setTimeout(openNotify, NOTIFY_DELAY);
      }
    } catch (_) {
      showTimer = setTimeout(openNotify, NOTIFY_DELAY);
    }

    window.addEventListener("beforeunload", () => clearTimeout(showTimer));
  }
})();
