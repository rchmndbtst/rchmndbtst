/*
  script.js — UI interactions

  Responsibilities:
  - Load `html2canvas` lazily to capture the `.panel` and download a PNG.
  - Provide a theme toggle that persists the user's choice.

  Key hooks:
  - `#save-png` — button that triggers capture
  - `#theme-toggle` — button to toggle theme
*/
(function () {
  "use strict";

  // Load html2canvas from CDN when needed. Returns the h2c function.
  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      s.onload = () => resolve(window.html2canvas);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Capture the provided element and return a canvas.
  async function capturePanel(panel) {
    await loadHtml2Canvas();
    const bg = getComputedStyle(panel).backgroundColor || null;
    const rect = panel.getBoundingClientRect();
    const canvas = await window.html2canvas(panel, {
      backgroundColor: bg,
      useCORS: true,
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
      scale: Math.min(2, window.devicePixelRatio || 1),
    });
    return canvas;
  }

  // Wire the save button to capture and download the panel as PNG.
  function setupSaveButton() {
    const btn = document.getElementById("save-png");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      try {
        const panel = document.querySelector(".panel");
        if (!panel) return alert("Panel not found");
        const canvas = await capturePanel(panel);
        canvas.toBlob((blob) => {
          if (!blob) return alert("Failed to create image");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "panel.png";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      } catch (e) {
        console.error("Capture failed", e);
        alert("Failed to save image (see console).");
      }
    });
  }

  // Applying theme is intentionally simple.
  function setupThemeToggle() {
    const key = "theme";
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function applyTheme(theme) {
      const html = document.documentElement;
      if (theme === "dark") {
        html.setAttribute("data-theme", "dark");
        btn.setAttribute("aria-pressed", "true");
        btn.textContent = "Switch to Light";
      } else {
        html.removeAttribute("data-theme");
        btn.setAttribute("aria-pressed", "false");
        btn.textContent = "Switch Theme";
      }
    }

    btn.addEventListener("click", () => {
      const html = document.documentElement;
      const cur = html.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      applyTheme(next === "dark" ? "dark" : "light");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupSaveButton();
    setupThemeToggle();
  });
})();
