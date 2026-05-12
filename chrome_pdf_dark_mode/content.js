(function() {
  const ID = "pdf-dark-mode-overlay";
  let existingOverlay = document.getElementById(ID);

  if (existingOverlay) {
    existingOverlay.remove();
  } else {
    const overlay = document.createElement("div");
    overlay.id = ID;
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: white;
      mix-blend-mode: difference;
      pointer-events: none;
      z-index: 2147483647;
    `;
    document.body.appendChild(overlay);
  }
})();
