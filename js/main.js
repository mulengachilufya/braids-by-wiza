/* ==========================================================================
   Braids by Wiza — interactions
   Plain JS, no dependencies. Each feature checks for its own markup, so the
   same file runs on index.html and work.html.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const SITE = window.SITE || {};
  const LOOKS = window.LOOKS || [];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  const whatsappReady = () => /^\d{9,15}$/.test(SITE.whatsapp || "") && !/^2600+$/.test(SITE.whatsapp);

  /* ------------------------------------------------------------------------
     Haptics
     Android/Chrome: Vibration API. iOS Safari has no Vibration API, but since
     iOS 18 toggling an <input type="checkbox" switch> plays the system haptic,
     so we click a hidden one (only works inside a user gesture).
     ------------------------------------------------------------------------ */
  const Haptics = (() => {
    const canVibrate = typeof navigator.vibrate === "function";
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const patterns = { tick: 4, light: 9, medium: 16, heavy: 28, success: [12, 70, 22], error: [30, 50, 30] };
    let enabled = store.get("haptics") !== "off";
    let iosLabel = null;
    let last = 0;

    function iosTap() {
      if (!iosLabel) {
        const id = "hx-switch";
        const input = Object.assign(document.createElement("input"), { type: "checkbox", id });
        input.setAttribute("switch", "");
        iosLabel = Object.assign(document.createElement("label"), { htmlFor: id });
        const hide = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
        input.style.cssText = hide; iosLabel.style.cssText = hide;
        input.setAttribute("aria-hidden", "true"); input.tabIndex = -1;
        document.body.append(input, iosLabel);
      }
      iosLabel.click();
    }

    function fire(type = "light") {
      if (!enabled || navigator.userActivation?.hasBeenActive === false) return;
      const now = performance.now();
      if (type === "tick" && now - last < 35) return;
      last = now;
      const p = patterns[type] ?? patterns.light;
      if (canVibrate) { try { navigator.vibrate(p); } catch { /* blocked before user activation */ } }
      else if (isIOS) iosTap();
    }

    function setEnabled(v) {
      enabled = v; store.set("haptics", v ? "on" : "off");
      $$("[data-haptic-toggle]").forEach(b => b.setAttribute("aria-pressed", String(v)));
    }
    return { fire, setEnabled, get enabled() { return enabled; }, supported: canVibrate || isIOS };
  })();
  window.Haptics = Haptics;

  $$("[data-haptic-toggle]").forEach(b => {
    b.setAttribute("aria-pressed", String(Haptics.enabled));
    b.addEventListener("click", () => { Haptics.setEnabled(!Haptics.enabled); Haptics.fire("medium"); });
  });
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-haptic]");
    if (el) Haptics.fire(el.dataset.haptic || "light");
  });

  /* ------------------------------------------------------------------------
     Device motion (gyro tilt). iOS needs a permission prompt from a gesture.
     ------------------------------------------------------------------------ */
  const Gyro = { x: 0, y: 0, active: false };
  function startGyro() {
    if (Gyro.active || !("DeviceOrientationEvent" in window)) return;
    const listen = () => {
      Gyro.active = true;
      let base = null;
      addEventListener("deviceorientation", e => {
        if (e.beta == null) return;
        base ??= { b: e.beta, g: e.gamma };
        Gyro.x = clamp((e.gamma - base.g) / 25, -1, 1);
        Gyro.y = clamp((e.beta - base.b) / 25, -1, 1);
      });
    };
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then(s => s === "granted" && listen()).catch(() => {});
    } else listen();
  }
  if (isTouch && !reduceMotion) addEventListener("touchend", startGyro, { once: true });

  /* ------------------------------------------------------------------------
     Loader, nav, drawer
     ------------------------------------------------------------------------ */
  const t0 = performance.now();
  const reveal = () => setTimeout(() => {
    document.body.classList.remove("is-loading");
    $$("[data-split]").forEach(el => el.classList.add("is-in"));
  }, Math.max(0, 1100 - (performance.now() - t0)));
  if (document.readyState === "complete") reveal(); else addEventListener("load", reveal);
  setTimeout(() => document.body.classList.remove("is-loading"), 3500);

  $$("[data-split]").forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) => `<span class="ch" style="transition-delay:${0.25 + i * 0.08}s">${c}</span>`).join("");
  });

  const nav = $("[data-nav]");
  const drawer = $("[data-drawer]");
  const burger = $("[data-burger]");
  const alwaysSolid = nav?.classList.contains("is-solid");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (nav) {
      nav.classList.toggle("is-solid", alwaysSolid || y > 40);
      nav.classList.toggle("is-hidden", y > 500 && y > lastY && !drawer?.classList.contains("is-open"));
    }
    $("[data-wa-float]")?.classList.toggle("is-shown", y > innerHeight * 0.6);
    lastY = y;
  }, { passive: true });

  function setDrawer(open) {
    drawer?.classList.toggle("is-open", open);
    burger?.setAttribute("aria-expanded", String(open));
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  burger?.addEventListener("click", () => { setDrawer(!drawer.classList.contains("is-open")); Haptics.fire("medium"); });
  $$("a", drawer || document.createElement("div")).forEach(a => a.addEventListener("click", () => setDrawer(false)));

  /* ------------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------------ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  const observeReveals = (root = document) => $$(".reveal:not(.is-in)", root).forEach(el => io.observe(el));
  observeReveals();

  /* ------------------------------------------------------------------------
     Cursor + glitter trail (follows the mouse on desktop, the finger on mobile)
     ------------------------------------------------------------------------ */
  const cursor = $(".cursor");
  if (cursor && finePointer) {
    const dot = $(".cursor__dot", cursor), ring = $(".cursor__ring", cursor);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`; });
    addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.addEventListener("pointerover", e => cursor.classList.toggle("is-hover", !!e.target.closest("a, button, summary, select, input, textarea, .look-card, .map-pin")));
    (function loop() { rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18); ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  }

  const sparkleCanvas = $(".sparkle-layer");
  const Sparkles = (() => {
    if (!sparkleCanvas || reduceMotion) return { burst() {} };
    const ctx = sparkleCanvas.getContext("2d");
    const parts = [];
    const colors = ["#f4a7c3", "#e8457f", "#f0dcb5", "#ffffff"];
    let dpr = 1, running = false;
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); sparkleCanvas.width = innerWidth * dpr; sparkleCanvas.height = innerHeight * dpr; };
    size(); addEventListener("resize", size);
    function add(x, y, n = 1, spread = 1) {
      for (let i = 0; i < n && parts.length < 160; i++) {
        const a = Math.random() * Math.PI * 2, s = (Math.random() * 1.6 + 0.3) * spread;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.4, life: 1, r: Math.random() * 2.2 + 0.8, c: colors[(Math.random() * colors.length) | 0], star: Math.random() < 0.35 });
      }
      if (!running) { running = true; requestAnimationFrame(tick); }
    }
    function star(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; ctx.lineTo(x + Math.cos(a) * r * 2.4, y + Math.sin(a) * r * 2.4); ctx.lineTo(x + Math.cos(a + Math.PI / 4) * r * 0.6, y + Math.sin(a + Math.PI / 4) * r * 0.6); }
      ctx.closePath(); ctx.fill();
    }
    function tick() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.98; p.life -= 0.022;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = p.c;
        if (p.star) star(p.x, p.y, p.r * p.life); else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, 7); ctx.fill(); }
      }
      if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    let lx = 0, ly = 0;
    const trail = (x, y) => { const d = Math.hypot(x - lx, y - ly); if (d > 14) { add(x, y, d > 40 ? 2 : 1, 0.6); lx = x; ly = y; } };
    if (finePointer) addEventListener("pointermove", e => trail(e.clientX, e.clientY), { passive: true });
    addEventListener("touchmove", e => { const t = e.touches[0]; if (t) trail(t.clientX, t.clientY); }, { passive: true });
    document.addEventListener("click", e => { if (e.target.closest(".btn, .finder__opt, .map-pin, .chip, .menu__tab")) add(e.clientX, e.clientY, 18, 2.2); });
    return { burst: (x, y, n = 18) => add(x, y, n, 2.2) };
  })();

  /* ------------------------------------------------------------------------
     Magnetic buttons + 3D tilt
     ------------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    $$(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  function bindTilt(el, max = 10) {
    if (reduceMotion) return;
    let hovering = false;
    el.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg)`;
      el.style.setProperty("--mx", `${px * 100}%`); el.style.setProperty("--my", `${py * 100}%`);
      el.classList.add("is-tilting");
    });
    el.addEventListener("pointerleave", () => { hovering = false; el.style.transform = ""; el.classList.remove("is-tilting"); });
    tiltTargets.push({ el, max, get hovering() { return hovering; } });
  }
  const tiltTargets = [];
  // On phones, tilt visible cards with the gyroscope.
  if (isTouch && !reduceMotion) {
    (function gyroLoop() {
      if (Gyro.active) {
        for (const t of tiltTargets) {
          const r = t.el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) continue;
          t.el.style.transform = `perspective(900px) rotateY(${Gyro.x * t.max}deg) rotateX(${-Gyro.y * t.max}deg)`;
          t.el.style.setProperty("--mx", `${50 + Gyro.x * 40}%`); t.el.style.setProperty("--my", `${40 + Gyro.y * 40}%`);
          t.el.classList.add("is-tilting");
        }
      }
      requestAnimationFrame(gyroLoop);
    })();
  }
  $$("[data-tilt]").forEach(el => bindTilt(el, 8));

  /* ------------------------------------------------------------------------
     Hero "silk field": strands of light that part around your finger/cursor.
     Crossing a strand plucks it with a tiny haptic tick, like a harp string.
     ------------------------------------------------------------------------ */
  const field = $(".hero__field");
  if (field) {
    const hero = field.parentElement;
    const ctx = field.getContext("2d");
    let W = 0, H = 0, dpr = 1, strands = [], gap = 26;
    const P = { x: -999, y: -999, tx: -999, ty: -999, active: false, lastX: null };
    const waves = [];

    function build() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      field.width = W * dpr; field.height = H * dpr;
      gap = W < 600 ? 22 : 28;
      const count = Math.ceil(W / gap) + 2, step = W < 600 ? 22 : 24;
      strands = [];
      for (let i = 0; i < count; i++) {
        const pts = [];
        for (let y = -step; y <= H + step; y += step) pts.push({ y, ox: 0, oy: 0, vx: 0, vy: 0 });
        strands.push({ bx: (i - 1) * gap, phase: i * 0.37, amp: 10 + (i % 5) * 3, pts, pluck: 0 });
      }
    }
    build();
    addEventListener("resize", () => { if (Math.abs(hero.clientWidth - W) > 40 || Math.abs(hero.clientHeight - H) > 120) build(); });

    const local = (cx, cy) => { const r = field.getBoundingClientRect(); return [cx - r.left, cy - r.top]; };
    function move(cx, cy) {
      const [x, y] = local(cx, cy);
      if (P.lastX !== null && y > 0 && y < H) {
        // harp-pluck: haptic + glow when the pointer crosses a strand
        const a = Math.min(P.lastX, x), b = Math.max(P.lastX, x);
        for (const s of strands) if (s.bx > a && s.bx <= b) { s.pluck = 1; Haptics.fire("tick"); }
      }
      P.lastX = x; P.tx = x; P.ty = y; P.active = true;
      if (P.x < -500) { P.x = x; P.y = y; }
    }
    function leave() { P.active = false; P.lastX = null; }
    function shock(cx, cy) { const [x, y] = local(cx, cy); waves.push({ x, y, r: 0 }); Haptics.fire("medium"); }

    hero.addEventListener("pointermove", e => { if (e.pointerType === "mouse") move(e.clientX, e.clientY); });
    hero.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") leave(); });
    hero.addEventListener("pointerdown", e => { if (e.pointerType === "mouse" && !e.target.closest("a,button")) shock(e.clientX, e.clientY); });
    hero.addEventListener("touchstart", e => { const t = e.touches[0]; P.lastX = null; move(t.clientX, t.clientY); if (!e.target.closest("a,button")) shock(t.clientX, t.clientY); }, { passive: true });
    hero.addEventListener("touchmove", e => { const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
    hero.addEventListener("touchend", leave, { passive: true });

    const grad = () => {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "rgba(244,167,195,.55)"); g.addColorStop(0.5, "rgba(215,180,124,.45)"); g.addColorStop(1, "rgba(232,69,127,.55)");
      return g;
    };
    let strokeGrad = grad(), gw = W;
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

    let t = 0, idle = 0;
    (function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      t += reduceMotion ? 0.002 : 0.012;
      if (gw !== W) { strokeGrad = grad(); gw = W; }

      // idle: a ghost pointer drifts through so the field is alive before anyone touches it
      if (!P.active) {
        idle += 0.006;
        P.tx = W * (0.5 + 0.38 * Math.sin(idle * 1.3)); P.ty = H * (0.5 + 0.3 * Math.sin(idle * 2.1));
      }
      P.x = lerp(P.x, P.tx, 0.2); P.y = lerp(P.y, P.ty, 0.2);
      const R = W < 600 ? 120 : 170, force = P.active ? 2.4 : 0.9;
      for (const w of waves) w.r += 14;
      while (waves.length && waves[0].r > Math.max(W, H) * 1.2) waves.shift();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // force-field glow
      const glow = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, R * 1.3);
      glow.addColorStop(0, P.active ? "rgba(232,69,127,.30)" : "rgba(232,69,127,.12)");
      glow.addColorStop(1, "rgba(232,69,127,0)");
      ctx.fillStyle = glow; ctx.fillRect(P.x - R * 1.4, P.y - R * 1.4, R * 2.8, R * 2.8);
      if (P.active) {
        ctx.strokeStyle = "rgba(240,220,181,.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(P.x, P.y, R * (0.55 + Math.sin(t * 6) * 0.04), 0, 7); ctx.stroke();
      }

      ctx.lineCap = "round";
      for (const s of strands) {
        s.pluck *= 0.94;
        ctx.beginPath();
        const pts = s.pts;
        for (let k = 0; k < pts.length; k++) {
          const p = pts[k];
          const hx = s.bx + Math.sin(p.y * 0.008 + t + s.phase) * s.amp + Math.sin(p.y * 0.02 - t * 1.6) * s.pluck * 14;
          const cx = hx + p.ox, cy = p.y + p.oy;
          let fx = 0, fy = 0;
          const dx = cx - P.x, dy = cy - P.y, d = Math.hypot(dx, dy);
          if (d < R && d > 0.1) { const f = (1 - d / R) ** 2 * force; fx += dx / d * f * 6; fy += dy / d * f * 2; }
          for (const w of waves) {
            const wx = cx - w.x, wy = cy - w.y, wd = Math.hypot(wx, wy), band = Math.abs(wd - w.r);
            if (band < 50 && wd > 0.1) { const f = (1 - band / 50) * 3 * Math.max(0, 1 - w.r / 900); fx += wx / wd * f; fy += wy / wd * f; }
          }
          p.vx = (p.vx + fx - p.ox * 0.06) * 0.86;
          p.vy = (p.vy + fy - p.oy * 0.06) * 0.86;
          p.ox += p.vx; p.oy += p.vy;
          const X = hx + p.ox, Y = p.y + p.oy;
          if (k === 0) ctx.moveTo(X, Y);
          else { const prev = pts[k - 1]; const pX = prev._x, pY = prev._y; ctx.quadraticCurveTo(pX, pY, (pX + X) / 2, (pY + Y) / 2); }
          p._x = X; p._y = Y;
        }
        ctx.strokeStyle = strokeGrad;
        ctx.globalAlpha = 0.35 + s.pluck * 0.65;
        ctx.lineWidth = 1 + s.pluck * 1.6;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    })();
  }

  /* ------------------------------------------------------------------------
     Look cards (homepage rail + lookbook grid) and lightbox
     ------------------------------------------------------------------------ */
  const arrow = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;
  function lookCard(look, i, { tags = false } = {}) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "look-card"; b.dataset.look = look.id;
    b.innerHTML = `
      <div class="look-card__media"><img src="${look.img}" alt="${look.title}, braided by Wiza" loading="lazy"><span class="look-card__shine"></span></div>
      <div class="look-card__body">
        <div><span class="look-card__num">N° ${String(i + 1).padStart(2, "0")}</span><h3 class="look-card__title">${look.title}</h3>
        ${tags ? `<div class="look-card__tags">${look.tags.filter(t => t !== "colour").map(t => `<span>${t}</span>`).join("")}</div>` : ""}</div>
        <span class="look-card__go">${arrow}</span>
      </div>`;
    bindTilt(b, 7);
    return b;
  }

  const Lightbox = (() => {
    const box = $("[data-lightbox]");
    if (!box) return { open() {} };
    const img = $("[data-lb-img]", box), title = $("[data-lb-title]", box), note = $("[data-lb-note]", box), book = $("[data-lb-book]", box);
    let list = [], idx = 0, lastFocus = null;
    const onIndex = !!$("[data-book-form]");
    function show(dir = 0) {
      const l = list[idx];
      img.style.opacity = "0"; img.style.transform = `translateX(${dir * 40}px)`;
      requestAnimationFrame(() => {
        img.src = l.img; img.alt = `${l.title}, braided by Wiza`;
        title.textContent = l.title; note.textContent = l.note;
        book.href = onIndex ? "#book" : `index.html?look=${encodeURIComponent(l.id)}#book`;
        book.dataset.look = l.id;
        setTimeout(() => { img.style.opacity = "1"; img.style.transform = ""; }, 60);
      });
    }
    function open(items, i) {
      list = items; idx = i; lastFocus = document.activeElement;
      box.hidden = false; document.documentElement.style.overflow = "hidden";
      show(); $("[data-lb-close]", box).focus();
    }
    function close() { box.hidden = true; document.documentElement.style.overflow = ""; lastFocus?.focus?.(); }
    function step(d) { idx = (idx + d + list.length) % list.length; show(d); Haptics.fire("light"); }
    $("[data-lb-close]", box).addEventListener("click", close);
    $("[data-lb-prev]", box).addEventListener("click", () => step(-1));
    $("[data-lb-next]", box).addEventListener("click", () => step(1));
    box.addEventListener("click", e => { if (e.target === box) close(); });
    book.addEventListener("click", () => { if (onIndex) { Booking?.choose(book.dataset.look); close(); } });
    addEventListener("keydown", e => {
      if (box.hidden) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
    });
    let sx = 0, sy = 0;
    box.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    box.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
    }, { passive: true });
    return { open };
  })();

  // Homepage rail
  const rail = $("[data-rail]");
  if (rail) {
    LOOKS.forEach((l, i) => {
      const c = lookCard(l, i);
      c.addEventListener("click", () => { Lightbox.open(LOOKS, i); Haptics.fire("light"); });
      rail.append(c);
    });
    const bar = $("[data-rail-progress]");
    let snapped = 0;
    rail.addEventListener("scroll", () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      if (bar) bar.style.transform = `scaleX(${0.1 + p * 0.9})`;
      const card = rail.children[0]?.getBoundingClientRect().width || 1;
      const i = Math.round(rail.scrollLeft / card);
      if (i !== snapped) { snapped = i; Haptics.fire("tick"); }
    }, { passive: true });
    rail.dispatchEvent(new Event("scroll"));
    // Desktop: drag to scroll
    if (finePointer) {
      let down = false, startX = 0, startL = 0, moved = false;
      rail.addEventListener("pointerdown", e => { down = true; moved = false; startX = e.clientX; startL = rail.scrollLeft; rail.style.scrollSnapType = "none"; });
      addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 5) moved = true; rail.scrollLeft = startL - dx; });
      addEventListener("pointerup", () => { if (!down) return; down = false; rail.style.scrollSnapType = ""; });
      rail.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    }
  }

  // Lookbook page grid + filters
  const grid = $("[data-grid]");
  if (grid) {
    const filters = $("[data-filters]");
    let current = "all";
    function render() {
      const items = current === "all" ? LOOKS : LOOKS.filter(l => l.tags.includes(current));
      grid.innerHTML = "";
      items.forEach((l, i) => {
        const c = lookCard(l, LOOKS.indexOf(l), { tags: true });
        c.style.animationDelay = `${i * 0.06}s`;
        c.addEventListener("click", () => { Lightbox.open(items, i); Haptics.fire("light"); });
        grid.append(c);
      });
    }
    (window.LOOK_FILTERS || []).forEach(f => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = f.label; b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(f.id === current));
      b.addEventListener("click", () => {
        current = f.id; Haptics.fire("light");
        $$(".chip", filters).forEach(c => c.setAttribute("aria-selected", String(c === b)));
        render();
      });
      filters.append(b);
    });
    render();
  }

  /* ------------------------------------------------------------------------
     The Menu (catalogue tabs)
     ------------------------------------------------------------------------ */
  const tabs = $("[data-menu-tabs]"), panel = $("[data-menu-panel]");
  if (tabs && panel && window.MENU) {
    const cur = SITE.currency || "K";
    function showCat(cat) {
      $$(".menu__tab", tabs).forEach(t => t.setAttribute("aria-selected", String(t.dataset.cat === cat.id)));
      panel.innerHTML = cat.items.map((it, i) => `
        <article class="menu-item" style="animation-delay:${i * 0.07}s">
          <h3>${it.name}</h3>
          <div class="menu-item__price"><small>from</small>${cur}${it.from}</div>
          <p>${it.desc}</p>
          <div class="menu-item__meta"><span>⏱ ${it.time}</span><button type="button" class="menu-item__add" data-pick="${it.name}">Book this</button></div>
        </article>`).join("");
      $$(".menu-item", panel).forEach(el => el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }));
    }
    window.MENU.forEach((cat, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "menu__tab"; b.textContent = cat.label; b.dataset.cat = cat.id; b.setAttribute("role", "tab");
      b.addEventListener("click", () => { showCat(cat); Haptics.fire("light"); b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); });
      tabs.append(b);
      if (i === 0) showCat(cat);
    });
    panel.addEventListener("click", e => {
      const b = e.target.closest("[data-pick]");
      if (!b) return;
      Haptics.fire("medium");
      Booking?.pickService(b.dataset.pick);
    });
  }

  /* ------------------------------------------------------------------------
     Style Finder
     ------------------------------------------------------------------------ */
  const finder = $("[data-finder]");
  if (finder) {
    const Q = [
      { q: "How much length do you love?", opts: [["short", "Short & chic", "Close to the head"], ["shoulder", "Mid-length", "Around the shoulders"], ["long", "Long & dramatic", "Mid-back and beyond"]] },
      { q: "What's the mood?", opts: [["classic", "Sleek & classic", "Clean lines"], ["romantic", "Soft & romantic", "Curls & movement"], ["bold", "Bold & artistic", "Patterns that turn heads"]] },
      { q: "Time in the chair?", opts: [["quick", "Quick visit", "Under 3 hours"], ["half", "Half a day", "3 – 5 hours"], ["long", "Make it a day", "Worth every minute"]] },
    ];
    let answers = [];
    function renderQ() {
      const step = answers.length;
      if (step === Q.length) return renderResult();
      const { q, opts } = Q[step];
      finder.innerHTML = `
        <p class="finder__q">${q}</p>
        <div class="finder__opts">${opts.map(([v, t, s]) => `<button type="button" class="finder__opt" data-v="${v}"><b>${t}</b>${s}</button>`).join("")}</div>
        <div class="finder__dots">${Q.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>`;
      $$(".finder__opt", finder).forEach(b => b.addEventListener("click", () => { answers.push(b.dataset.v); Haptics.fire("light"); setTimeout(renderQ, 180); }));
    }
    function renderResult() {
      const score = l => (l.fit || []).reduce((s, v, i) => s + (v === answers[i] ? [2, 3, 1][i] : 0), 0);
      const best = [...LOOKS].sort((a, b) => score(b) - score(a))[0];
      Haptics.fire("success");
      finder.innerHTML = `
        <div class="finder__result">
          <p class="eyebrow">Your match</p>
          <img src="${best.img}" alt="${best.title}">
          <h3>${best.title}</h3>
          <p>${best.note}</p>
          <div class="finder__actions">
            <a class="btn btn--pink btn--sm" href="#book" data-finder-book>Book this look</a>
            <button type="button" class="btn btn--sm chip finder__again" data-finder-again>Start again</button>
          </div>
        </div>`;
      $("[data-finder-book]", finder).addEventListener("click", () => Booking?.choose(best.id));
      $("[data-finder-again]", finder).addEventListener("click", () => { answers = []; renderQ(); Haptics.fire("light"); });
      const r = finder.getBoundingClientRect(); Sparkles.burst(r.left + r.width / 2, r.top + 120, 40);
    }
    renderQ();
  }

  /* ------------------------------------------------------------------------
     3D Zambia map
     ------------------------------------------------------------------------ */
  const mapStage = $("[data-map-stage]");
  if (mapStage && window.ZAMBIA && window.CITIES) {
    const Z = window.ZAMBIA, plane = $("[data-map-plane]"), svg = $("[data-map-svg]");
    const studio = window.CITIES.find(c => c.name === SITE.studioCity) || window.CITIES[0];
    const KM_PER_UNIT = 1.262; // map is 1000 units ≈ 1,262 km wide
    svg.setAttribute("viewBox", `0 0 ${Z.w} ${Z.h}`);
    const gridLines = [];
    for (let x = 0; x <= Z.w; x += 100) gridLines.push(`<line x1="${x}" y1="-60" x2="${x}" y2="${Z.h + 60}"/>`);
    for (let y = 0; y <= Z.h; y += 100) gridLines.push(`<line x1="-60" y1="${y}" x2="${Z.w + 60}" y2="${y}"/>`);
    svg.innerHTML = `
      <defs>
        <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2a1520"/><stop offset=".55" stop-color="#4a1830"/><stop offset="1" stop-color="#7a2549"/>
        </linearGradient>
      </defs>
      <g class="map__grid">${gridLines.join("")}</g>
      <path class="map__land" d="${Z.d}"/>
      <path class="map__route" data-route d=""/>`;
    // extruded depth: stacked copies behind the top face
    for (let i = 1; i <= 7; i++) {
      const layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      layer.setAttribute("viewBox", `0 0 ${Z.w} ${Z.h}`); layer.setAttribute("class", "map__layer"); layer.setAttribute("aria-hidden", "true");
      layer.style.transform = `translateZ(${-i * 4}px)`;
      layer.innerHTML = `<path d="${Z.d}" fill="${i === 7 ? "#e8457f" : "#2a0f1c"}" opacity="${i === 7 ? 0.35 : 1}"/>`;
      plane.prepend(layer);
    }
    const pinsWrap = document.createElement("div");
    pinsWrap.className = "map__pins";
    plane.append(pinsWrap);
    const route = $("[data-route]", svg);
    const card = { city: $("[data-map-city]"), region: $("[data-map-region]"), copy: $("[data-map-copy]"), book: $("[data-map-book]") };

    window.CITIES.forEach(c => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "map-pin" + (c === studio ? " is-studio" : "");
      b.style.left = `${(c.x / Z.w) * 100}%`; b.style.top = `${(c.y / Z.h) * 100}%`;
      b.setAttribute("aria-label", c.name);
      b.innerHTML = `<span class="map-pin__base"></span><span class="map-pin__stand"><span class="map-pin__label">${c === studio ? "★ " : ""}${c.name}</span><span class="map-pin__stick"></span></span>`;
      // Copperbelt towns sit close together, so a tap picks whichever pin is nearest the finger
      b.addEventListener("click", e => {
        if (!e.detail) return select(c, b); // keyboard
        let best = c, bd = Infinity;
        for (const o of window.CITIES) {
          const r = $(".map-pin__base", o._el).getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
          if (d < bd) { bd = d; best = o; }
        }
        select(best, best._el);
      });
      pinsWrap.append(b);
      c._el = b;
    });

    function select(c, el) {
      $$(".map-pin", pinsWrap).forEach(p => p.classList.toggle("is-active", p === el));
      Haptics.fire("medium");
      card.city.textContent = c.name;
      card.region.textContent = c.region;
      if (c === studio) {
        card.copy.textContent = `Wiza's studio is in ${c.name}. Come in for your appointment, or ask about a home visit nearby.`;
        route.setAttribute("d", "");
      } else {
        const km = Math.round(Math.hypot(c.x - studio.x, c.y - studio.y) * KM_PER_UNIT / 10) * 10;
        card.copy.textContent = `About ${km} km from the studio in ${studio.name}. Clients from ${c.name} book ahead and travel in, and travel bookings for bridal parties and groups can be arranged.`;
        const mx = (c.x + studio.x) / 2, my = (c.y + studio.y) / 2 - Math.hypot(c.x - studio.x, c.y - studio.y) * 0.3;
        route.setAttribute("d", `M${studio.x},${studio.y} Q${mx},${my} ${c.x},${c.y}`);
      }
      card.book.dataset.town = c.name;
      // nudge the camera towards the selected town
      target.rz = -8 + ((c.x / Z.w) - 0.5) * -14;
      target.rx = 34 + ((c.y / Z.h) - 0.5) * 10;
    }
    card.book.addEventListener("click", () => Booking?.setTown(card.book.dataset.town || studio.name));

    // camera: drag to rotate, gyro adds a gentle tilt; children counter-rotate to stand upright
    const target = { rx: 38, rz: -8 }, cam = { rx: 38, rz: -8 };
    let dragging = false, sx = 0, sy = 0, srx = 0, srz = 0, lastTick = 0;
    mapStage.addEventListener("pointerdown", e => {
      if (e.target.closest(".map-pin")) return;
      dragging = true; sx = e.clientX; sy = e.clientY; srx = target.rx; srz = target.rz;
      mapStage.setPointerCapture(e.pointerId);
    });
    mapStage.addEventListener("pointermove", e => {
      if (!dragging) return;
      target.rz = srz + (e.clientX - sx) * 0.25;
      target.rx = clamp(srx - (e.clientY - sy) * 0.2, 8, 62);
      if (performance.now() - lastTick > 90) { Haptics.fire("tick"); lastTick = performance.now(); }
    });
    const end = () => { dragging = false; };
    mapStage.addEventListener("pointerup", end); mapStage.addEventListener("pointercancel", end);

    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(mapStage);
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      const gx = Gyro.active ? Gyro.x * 10 : 0, gy = Gyro.active ? Gyro.y * 8 : 0;
      cam.rx = lerp(cam.rx, clamp(target.rx - gy, 8, 64), 0.08);
      cam.rz = lerp(cam.rz, target.rz + gx, 0.08);
      plane.style.setProperty("--rx", `${cam.rx}deg`);
      plane.style.setProperty("--rz", `${cam.rz}deg`);
    })();

    select(studio, studio._el);
  }

  /* ------------------------------------------------------------------------
     Booking → WhatsApp
     ------------------------------------------------------------------------ */
  var Booking = null;
  const form = $("[data-book-form]");
  if (form) {
    const styleSel = $("[data-style-select]", form), townSel = $("[data-town-select]", form);
    const chosen = $("[data-chosen]"), msg = $("[data-form-msg]", form);
    let chosenLook = null;

    styleSel.innerHTML = `<option value="">Choose a style…</option>` +
      `<optgroup label="From the lookbook" data-look-group></optgroup>` +
      (window.MENU || []).map(c => `<optgroup label="${c.label}">${c.items.map(i => `<option>${i.name}</option>`).join("")}</optgroup>`).join("") +
      `<option>Not sure yet: help me choose</option>`;
    $("[data-look-group]", styleSel).innerHTML = LOOKS.map(l => `<option value="look:${l.id}">${l.title}</option>`).join("");
    townSel.innerHTML = (window.CITIES || []).map(c => `<option${c.name === SITE.studioCity ? " selected" : ""}>${c.name}</option>`).join("") + `<option>Elsewhere in Zambia</option>`;
    const dateIn = form.elements.date;
    dateIn.min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

    function showChosen() {
      chosen.hidden = !chosenLook;
      if (!chosenLook) return;
      $("[data-chosen-img]", chosen).src = chosenLook.img;
      $("[data-chosen-title]", chosen).textContent = chosenLook.title;
      requestAnimationFrame(() => chosen.classList.add("is-in"));
    }
    function choose(id) {
      chosenLook = LOOKS.find(l => l.id === id) || null;
      if (chosenLook) styleSel.value = `look:${chosenLook.id}`;
      showChosen();
    }
    styleSel.addEventListener("change", () => {
      const v = styleSel.value;
      chosenLook = v.startsWith("look:") ? LOOKS.find(l => `look:${l.id}` === v) : null;
      showChosen();
    });
    $("[data-chosen-clear]")?.addEventListener("click", () => { chosenLook = null; styleSel.value = ""; showChosen(); });

    Booking = {
      choose,
      pickService(name) { styleSel.value = name; chosenLook = null; showChosen(); $("#book").scrollIntoView({ behavior: "smooth" }); },
      setTown(name) { townSel.value = name; },
    };

    const q = new URLSearchParams(location.search).get("look");
    if (q) choose(q);

    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = form.elements;
      let bad = null;
      for (const el of [f.name, f.style, f.date]) {
        const wrap = el.closest(".field");
        const empty = !el.value.trim();
        wrap.classList.toggle("is-error", empty);
        if (empty && !bad) bad = el;
      }
      if (bad) { msg.textContent = "Please add your name, style and date."; Haptics.fire("error"); bad.focus(); return; }
      const style = chosenLook ? `${chosenLook.title} (from the lookbook)` : f.style.value;
      const date = new Date(f.date.value + "T12:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
      const text = [
        `Hello Wiza! ✨ I'd love to book an appointment.`,
        ``,
        `• Name: ${f.name.value.trim()}`,
        `• Style: ${style}`,
        `• Date: ${date}, ${f.time.value}`,
        `• Town: ${f.town.value}`,
        f.notes.value.trim() ? `• Notes: ${f.notes.value.trim()}` : "",
      ].filter(Boolean).join("\n");
      if (!whatsappReady()) {
        msg.textContent = "Online booking opens soon. The WhatsApp number hasn't been added yet.";
        console.info("[Braids by Wiza] Set SITE.whatsapp in js/data.js. Message would be:\n" + text);
        return;
      }
      msg.textContent = "Opening WhatsApp…";
      const r = form.querySelector("[type=submit]").getBoundingClientRect();
      Sparkles.burst(r.left + r.width / 2, r.top + r.height / 2, 50);
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
    form.addEventListener("input", e => e.target.closest(".field")?.classList.remove("is-error"));
  }

  /* ------------------------------------------------------------------------
     Footer bits
     ------------------------------------------------------------------------ */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  $$("[data-socials]").forEach(el => {
    const links = [];
    if (whatsappReady()) links.push(`<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`);
    if (SITE.instagram) links.push(`<a href="https://instagram.com/${SITE.instagram}" target="_blank" rel="noopener">Instagram</a>`);
    if (SITE.tiktok) links.push(`<a href="https://tiktok.com/@${SITE.tiktok}" target="_blank" rel="noopener">TikTok</a>`);
    if (SITE.email) links.push(`<a href="mailto:${SITE.email}">Email</a>`);
    if (!links.length) links.push(`<a href="index.html#book">Book</a>`, `<a href="work.html">Lookbook</a>`);
    el.innerHTML = links.join("");
  });
  const waFloat = $("[data-wa-float]");
  if (waFloat && whatsappReady()) {
    waFloat.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello Wiza! ✨")}`;
    waFloat.target = "_blank"; waFloat.rel = "noopener";
  }
})();
