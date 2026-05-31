/* ============================================================
   main.js — interactions
   ============================================================ */
(function () {
  "use strict";
  const { I18N, LANG_ORDER, applyLang } = window.HF_I18N;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- build language menu ---- */
  const menu = document.getElementById("langMenu");
  if (menu) {
    LANG_ORDER.forEach((code) => {
      const o = I18N[code];
      const b = document.createElement("button");
      b.className = "lang-opt";
      b.dataset.lang = code;
      b.setAttribute("role", "menuitem");
      b.innerHTML =
        '<span class="glyph">' + o.glyph + "</span>" +
        "<span>" + o.label + "</span>" +
        '<svg class="ico tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:15px;height:15px"><use href="#i-check"/></svg>';
      menu.appendChild(b);
    });
  }

  /* ---- language dropdown open/close ---- */
  const lang = document.getElementById("lang");
  const langBtn = document.getElementById("langBtn");
  function closeLang() { lang.classList.remove("open"); langBtn.setAttribute("aria-expanded", "false"); }
  function toggleLang() {
    const open = lang.classList.toggle("open");
    langBtn.setAttribute("aria-expanded", String(open));
  }
  if (langBtn) langBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleLang(); });
  document.addEventListener("click", (e) => { if (!lang.contains(e.target)) closeLang(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLang(); });
  if (menu) menu.addEventListener("click", (e) => {
    const opt = e.target.closest(".lang-opt");
    if (!opt) return;
    applyLang(opt.dataset.lang);
    closeLang();
  });

  // mobile: the language icon button opens the same menu (positioned via CSS)
  const navToggle = document.getElementById("navToggle");
  if (navToggle) navToggle.addEventListener("click", (e) => { e.stopPropagation(); toggleLang(); });

  /* ---- initial language: saved → browser → en ---- */
  let initial = "en";
  try {
    const saved = localStorage.getItem("hf-lang");
    if (saved && I18N[saved]) initial = saved;
    else {
      const nav = (navigator.language || "en").toLowerCase();
      if (nav.startsWith("zh")) initial = "zh";
      else if (nav.startsWith("es")) initial = "es";
      else if (nav.startsWith("fr")) initial = "fr";
      else if (nav.startsWith("de")) initial = "de";
    }
  } catch (e) {}
  applyLang(initial);

  /* ---- nav background on scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => { nav.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- copy terminal ---- */
  const copyBtn = document.getElementById("termCopy");
  if (copyBtn) {
    const lines = [
      "git clone https://github.com/r10d1nsec/hephaestus-forge",
      "cd hephaestus-forge && ./run.sh",
    ].join("\n");
    const label = copyBtn.querySelector("span");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(lines);
        const dict = I18N[localStorage.getItem("hf-lang") || "en"] || I18N.en;
        const prev = label.textContent;
        label.textContent = dict.term_copied || "Copied";
        copyBtn.querySelector("use").setAttribute("href", "#i-check");
        setTimeout(() => {
          label.textContent = prev;
          copyBtn.querySelector("use").setAttribute("href", "#i-copy");
        }, 1600);
      } catch (e) {}
    });
  }

  /* ---- reveal on scroll ---- */
  const reveals = document.querySelectorAll(".reveal");
  function showNow(el) {
    const sibs = Array.prototype.slice.call(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    const idx = sibs.indexOf(el);
    if (!reduce) el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
    el.classList.add("in");
  }
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showNow(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach((el) => io.observe(el));

    // Reveal anything already in the viewport on first frame (don't wait for IO's
    // second frame — matters for above-the-fold hero and single-frame renders).
    const vh = window.innerHeight || document.documentElement.clientHeight;
    requestAnimationFrame(() => {
      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) { showNow(el); io.unobserve(el); }
      });
    });

    // Hard safety net: never leave content permanently hidden.
    setTimeout(() => reveals.forEach((el) => el.classList.add("in")), 2200);
  }

})();
