export function createFunBannerController(funBannerEl) {
  let timer = null;

  function hideFunBanner() {
    if (!funBannerEl) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    funBannerEl.textContent = "";
    funBannerEl.classList.remove("is-visible");
    funBannerEl.setAttribute("hidden", "");
  }

  function showFunBanner(message, durationMs = 2600) {
    if (!funBannerEl || !message) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    funBannerEl.textContent = message;
    funBannerEl.removeAttribute("hidden");
    funBannerEl.classList.add("is-visible");

    timer = setTimeout(() => {
      hideFunBanner();
    }, durationMs);
  }

  return {
    showFunBanner,
    hideFunBanner,
  };
}
