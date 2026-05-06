/* =========================
UTILS
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* =========================
LIVE TIME (SINGLE CLEAN VERSION)
========================= */
function updateLiveTime() {
  const el = $("#liveTime");
  if (!el) return;

  const now = new Date();
  el.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
setInterval(updateLiveTime, 1000);
updateLiveTime();

/* =========================
SMOOTH SCROLL
========================= */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================
BUTTON HOVER (SINGLE INSTANCE)
========================= */
$$(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "translateY(-4px)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translateY(0)";
  });
});

/* =========================
SCROLL REVEAL
========================= */
const revealElements = $$(".reveal");

revealElements.forEach((el, index) => {
  el.style.transition = "all 0.8s ease";
  el.style.transitionDelay = `${index * 0.05}s`;
});

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
}

/* =========================
SCROLL PROGRESS
========================= */
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;
  document.documentElement.style.setProperty(
    "--scroll-progress",
    progress + "%",
  );
}

/* =========================
NAV ACTIVE LINK
========================= */
const sections = $$("section");
const navItems = $$(".nav-item");

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

/* =========================
PARTICLE BACKGROUND
========================= */
const canvas = $("#network-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 70;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(80,80,80,0.6)";
      ctx.fill();
    }
  }

  function createParticles() {
    particles = Array.from({ length: particleCount }, () => new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = dx * dx + dy * dy;

        if (dist < 10000) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(120,120,120,0.12)";
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  createParticles();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener("scroll", () => {
    canvas.style.transform = `translateY(${window.scrollY * 0.08}px)`;
  });
}

/* =========================
CURSOR SYSTEM 1 (DOT + RING + MAGNETIC)
========================= */
let cursorEl = null;
let ringEl = null;

if (window.innerWidth > 768) {
  cursorEl = document.createElement("div");
  ringEl = document.createElement("div");

  cursorEl.className = "custom-cursor";
  ringEl.className = "cursor-ring";

  document.body.append(cursorEl, ringEl);

  let mouseX = 0,
    mouseY = 0;
  let dotX = 0,
    dotY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateDot() {
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    cursorEl.style.left = dotX + "px";
    cursorEl.style.top = dotY + "px";

    requestAnimationFrame(animateDot);
  }

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ringEl.style.left = ringX + "px";
    ringEl.style.top = ringY + "px";

    requestAnimationFrame(animateRing);
  }

  animateDot();
  animateRing();

  // hover scale + magnetic
  $$("a, button, .nav-item, .btn-main").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorEl.classList.add("hover");
      ringEl.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      cursorEl.classList.remove("hover");
      ringEl.classList.remove("hover");
      el.style.transform = "translate(0,0)";
    });

    el.addEventListener("mousemove", (e) => {
      if (
        !el.classList.contains("btn-main") &&
        !el.classList.contains("nav-item")
      )
        return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
  });
}

/* =========================
CURSOR TRAIL
========================= */
if (window.innerWidth > 768) {
  const trailContainer = document.createElement("div");
  trailContainer.className = "cursor-trail";
  document.body.append(trailContainer);

  document.addEventListener("mousemove", (e) => {
    const dot = document.createElement("div");
    dot.className = "trail-dot";

    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";

    trailContainer.appendChild(dot);

    requestAnimationFrame(() => dot.classList.add("fade"));

    setTimeout(() => dot.remove(), 600);
  });
}

/* =========================
EYES FOLLOW + BLINK
========================= */
const pupils = $$(".pupil");
const eyes = $$(".eye");

document.addEventListener("mousemove", (e) => {
  pupils.forEach((pupil) => {
    const rect = pupil.parentElement.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const max = 3;

    const x = dist ? (dx / dist) * max : 0;
    const y = dist ? (dy / dist) * max : 0;

    pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
});

function blink() {
  eyes.forEach((eye) => eye.classList.add("blink"));
  setTimeout(() => eyes.forEach((eye) => eye.classList.remove("blink")), 120);
}
setInterval(blink, 2200 + Math.random() * 2000);

/* =========================
SAFE ELEMENTS
========================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const btn = $(".download-btn");
if (btn) {
  btn.addEventListener("click", () => {
    const text = btn.querySelector(".text");
    if (!text) return;

    text.textContent = "Downloading...";
    setTimeout(() => (text.textContent = "Saved"), 1200);
  });
}

const favicon = $("link[rel='icon']");
if (favicon) {
  window.addEventListener("blur", () => {
    favicon.href = "assets/favicon-alert.png";
  });
  window.addEventListener("focus", () => {
    favicon.href = "assets/favicon-normal.png";
  });
}

/* =========================
SCROLL MASTER (OPTIMIZED)
========================= */
window.addEventListener("scroll", () => {
  revealOnScroll();
  updateScrollProgress();
  updateActiveNav();
});

/* =========================
LOAD EVENTS
========================= */
window.addEventListener("load", () => {
  revealOnScroll();
  updateScrollProgress();

  const footer = $(".footer-interesting");
  if (footer) footer.classList.add("visible");
});

/* =========================
PROGRESS BAR
========================= */
function updateProgressBar() {
  const progress = $(".navbar-progress");
  if (!progress) return;

  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const percent = (scrollTop / docHeight) * 100 || 0;
  progress.style.backgroundSize = `${percent}% 100%`;
}
window.addEventListener("scroll", updateProgressBar);

/* =========================
ACCESSIBILITY
========================= */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("reduce-motion");
}

/* =========================
TITLE + LOG
========================= */
document.title = "Arshi Bansal | Portfolio";

window.addEventListener("blur", () => {
  document.title = "Come back 👀";
});

window.addEventListener("focus", () => {
  document.title = "Arshi Bansal | Portfolio";
});

console.log("%cPortfolio Loaded", "color:#0d6efd;font-weight:bold");
