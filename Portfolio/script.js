/* UTILS */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.body.classList.add("js");

/* ACCESSIBILITY */
const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function applyMotionPreference() {
  document.body.classList.toggle("reduce-motion", reducedMotionQuery.matches);
}

applyMotionPreference();

if (reducedMotionQuery.addEventListener) {
  reducedMotionQuery.addEventListener("change", applyMotionPreference);
}

/* Discourage casual copying of portfolio content. */
["copy", "cut", "paste", "contextmenu", "dragstart"].forEach((eventName) => {
  document.addEventListener(eventName, (event) => event.preventDefault());
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const modifier = event.ctrlKey || event.metaKey;

  if ((modifier && ["a", "c", "x", "v"].includes(key)) ||
      ((event.ctrlKey || event.shiftKey) && key === "insert")) {
    event.preventDefault();
  }
});

/* LIVE TIME */
function updateLiveTime() {
  const el = $("#liveTime");
  if (!el) return;

  const now = new Date();

  el.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

updateLiveTime();
setInterval(updateLiveTime, 60000);

/* SMOOTH SCROLL */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (!href || href === "#") return;

    const target = $(href);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      block: "start",
    });
  });
});

/* SCROLL REVEAL */
const revealElements = $$(".reveal");
const revealStyles = [
  "reveal--rise",
  "reveal--left",
  "reveal--scale",
  "reveal--right",
];

revealElements.forEach((el, index) => {
  el.classList.add(revealStyles[index % revealStyles.length]);
  el.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
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

/* SCROLL PROGRESS */
function updateScrollProgress() {
  const scrollTop = window.scrollY;

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${progress}%`,
  );
}

/* NAV ACTIVE LINK */
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
    link.removeAttribute("aria-current");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
      link.setAttribute("aria-current", "location");
    }
  });
}

/* PARTICLE BACKGROUND */
const canvas = $("#network-bg");

if (canvas && !document.body.classList.contains("reduce-motion")) {
  const ctx = canvas.getContext("2d");

  let particles = [];

  const particleCount = 70;
  const connectionDistance = 10000;
  let animationFrameId;

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

      if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -1;
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -1;
      }
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

        const distance = dx * dx + dy * dy;

        if (distance < connectionDistance) {
          ctx.beginPath();

          ctx.strokeStyle = "rgba(120,120,120,0.12)";

          ctx.moveTo(particles[a].x, particles[a].y);

          ctx.lineTo(particles[b].x, particles[b].y);

          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    if (reducedMotionQuery.matches) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    connectParticles();

    animationFrameId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  createParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener("scroll", () => {
    canvas.style.transform = `translateY(${window.scrollY * 0.08}px)`;
  });

  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", () => {
      if (reducedMotionQuery.matches) {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        animateParticles();
      }
    });
  }
}

/* YEAR */
const yearEl = $("#year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* RESUME DOWNLOAD */
const downloadBtn = $(".download-btn");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const text = downloadBtn.querySelector(".text");

    if (!text) return;

    const originalText = text.textContent;

    text.textContent = "Downloading...";

    setTimeout(() => {
      text.textContent = "Saved";
    }, 1200);

    setTimeout(() => {
      text.textContent = originalText;
    }, 2600);
  });
}

/* SCROLL MASTER */
function handleScroll() {
  revealOnScroll();
  updateScrollProgress();
  updateActiveNav();
}

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

/* LOAD EVENTS */
window.addEventListener("load", () => {
  revealOnScroll();
  updateScrollProgress();
  updateActiveNav();

  const footer = $(".footer-interesting");

  if (footer) {
    footer.classList.add("visible");
  }
});

/* HERO TYPING ROLES */
const roles = [
  "Models that earn trust",
  "Patterns hiding in data",
  "Questions behind the numbers",
  "Ideas made useful",
];

const typingEl = $(".typing-text");

if (typingEl && !document.body.classList.contains("reduce-motion")) {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;

      typingEl.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;

      typingEl.textContent = currentRole.substring(0, charIndex);
    }

    /* Finished typing */
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;

      setTimeout(typeEffect, 1800);

      return;
    }

    /* Finished deleting */
    if (isDeleting && charIndex === 0) {
      isDeleting = false;

      roleIndex = (roleIndex + 1) % roles.length;
    }

    const speed = isDeleting ? 40 : 90;

    setTimeout(typeEffect, speed);
  }

  setTimeout(typeEffect, 600);
}
