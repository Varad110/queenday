// script.js — spawns floating hearts and flowers infinitely (respects reduced motion)
(function () {
  // prefer a global fullscreen animation layer when available
  const area =
    document.getElementById("globalAnimation") ||
    document.getElementById("animationArea");
  if (!area) {
    console.warn("No animation area found — animation disabled");
    return;
  }
  const toggle = document.getElementById("toggleMotion");
  let running = true;

  // SVG templates
  const heartSVG = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#e84f9a" d="M12 21s-7-4.5-9.2-7.1C-0.1 9.9 3 5 7.9 6.2 10.2 6.8 12 9 12 9s1.8-2.2 4.1-2.8C21 5 24.1 9.9 21.2 13.9 19 16.5 12 21 12 21z" />
    </svg>`;
  const flowerSVG = `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <circle cx="32" cy="32" r="6" fill="#ffd07a" />
        <path fill="#f08fb3" d="M32 10c3 0 6 4 7 8 2 6-1 9-7 9s-9-3-7-9c1-4 4-8 7-8z"/>
        <path fill="#f6a5c7" d="M10 32c0-3 4-6 8-7 6-2 9 1 9 7s-3 9-9 7c-4-1-8-4-8-7z"/>
        <path fill="#f08fb3" d="M32 54c-3 0-6-4-7-8-2-6 1-9 7-9s9 3 7 9c-1 4-4 8-7 8z"/>
        <path fill="#f6a5c7" d="M54 32c0 3-4 6-8 7-6 2-9-1-9-7s3-9 9-7c4 1 8 4 8 7z"/>
      </g>
    </svg>`;

  // Respect reduced motion
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) {
    toggle.style.display = "none";
  }

  function spawn(type) {
    if (prefersReduced) return;
    const el = document.createElement("div");
    el.className = type === "heart" ? "heart" : "flower";
    el.innerHTML = type === "heart" ? heartSVG : flowerSVG;
    // random start position inside area
    const w = area.clientWidth;
    const h = area.clientHeight;
    const startX = Math.random() * (w * 0.8) + w * 0.1; // avoid exact edges
    const startY = Math.random() * (h * 0.6) + h * 0.2;
    el.style.left = startX + "px";
    el.style.top = startY + "px";
    // random size and duration
    const scale = 0.7 + Math.random() * 0.9; // .7 - 1.6
    el.style.width = Math.round(20 * scale) + "px";
    el.style.height = Math.round(20 * scale) + "px";
    const duration = 3800 + Math.random() * 1800; // ms
    // random horizontal drift
    const drift = Math.random() * 120 - 60;
    el.style.opacity = "0";
    area.appendChild(el);
    // force reflow then animate via inline style using keyframes
    el.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.2,1), opacity 600ms linear`;
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = `translate(${drift}px, -420px) rotate(${
        (Math.random() * 360) | 0
      }deg) scale(${scale})`;
    });
    // remove after animation
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500);
    }, duration);
  }

  let spawnTimer = null;
  function startSpawning() {
    if (spawnTimer) return;
    spawnTimer = setInterval(() => {
      // spawn hearts and flowers alternately
      spawn(Math.random() < 0.55 ? "heart" : "flower");
      // occasional burst
      if (Math.random() < 0.12) {
        spawn("flower");
        spawn("heart");
      }
    }, 520);
  }
  function stopSpawning() {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }

  // toggle button
  toggle.addEventListener("click", () => {
    running = !running;
    toggle.setAttribute("aria-pressed", String(!running));
    toggle.textContent = running ? "Pause Animation" : "Resume Animation";
    if (running) startSpawning();
    else stopSpawning();
  });

  // start unless reduced motion
  if (!prefersReduced) startSpawning();

  // ensure area resize handling
  window.addEventListener("resize", () => {});
})();
