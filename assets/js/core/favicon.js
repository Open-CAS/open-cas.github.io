// Overrides the theme's core/favicon.js.
//
// Hextra's version follows the OS colour scheme only, so the favicon stayed
// light after a manual switch to the dark theme. The site's effective theme is
// the "light" / "dark" class that js/head/theme.js puts on <html> — it tracks
// both the toggle and, while the theme is "system", OS changes — so watching
// that class covers every way the theme can change.
(function () {
  const faviconEl = document.getElementById("favicon-svg");
  if (!faviconEl) return;

  const lightFavicon = '{{ "favicon.svg" | relURL }}';
  const darkFavicon = '{{ "favicon-dark.svg" | relURL }}';

  function updateFavicon() {
    const href = document.documentElement.classList.contains("dark") ? darkFavicon : lightFavicon;
    if (faviconEl.getAttribute("href") !== href) {
      faviconEl.setAttribute("href", href);
    }
  }

  updateFavicon();

  new MutationObserver(updateFavicon).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
