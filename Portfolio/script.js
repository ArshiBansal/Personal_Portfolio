/* =========================
SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================
SCROLL REVEAL
========================= */
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
}

revealElements.forEach((el, index) => {
  el.style.transition = "all 0.8s ease";
  el.style.transitionDelay = `${index * 0.05}s`;
});

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* =========================
SCROLL PROGRESS (FOR BORDER)
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

window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("load", updateScrollProgress);

/* =========================
PARTICLE NETWORK BACKGROUND
========================= */
const canvas = document.getElementById("network-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let particles = [];
  const particleCount = 70;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

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

  createParticles();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  // subtle parallax
  window.addEventListener("scroll", () => {
    canvas.style.transform = `translateY(${window.scrollY * 0.08}px)`;
  });
}

/* =========================
NAVBAR ACTIVE STATE
========================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");

function updateActiveLink() {
  let currentSection = "";

  sections.forEach((section) => {
    const offset = document.querySelector("nav")?.offsetHeight || 0;
    const sectionTop = section.offsetTop - offset;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);

/* =========================
CURSOR SYSTEM 1 (DOT + RING + MAGNETIC)
========================= */
if (window.innerWidth > 768) {
  const cursor = document.createElement("div");
  const ring = document.createElement("div");

  cursor.className = "custom-cursor";
  ring.className = "cursor-ring";

  document.body.append(cursor, ring);

  let mouseX = 0,
    mouseY = 0;
  let dotX = 0,
    dotY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  });

  function animateDot() {
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    cursor.style.left = dotX + "px";
    cursor.style.top = dotY + "px";

    requestAnimationFrame(animateDot);
  }

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";

    requestAnimationFrame(animateRing);
  }

  animateDot();
  animateRing();

  // hover scale
  document.querySelectorAll("a, button, .nav-item").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.6)";
      ring.style.transform = "translate(-50%, -50%) scale(1.25)";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });

  // magnetic effect
  document.querySelectorAll(".btn-main, .nav-item").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0,0)";
    });
  });
}

/* =========================
CURSOR SYSTEM 2 (TRAIL)
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

    requestAnimationFrame(() => {
      dot.classList.add("fade");
    });

    setTimeout(() => {
      dot.remove();
    }, 600);
  });
}

/* =========================
CEO TEXT ROTATION
========================= */
const ceoText = document.querySelector(".ceo-text");

if (ceoText) {
  const lines = [
    "DATA IS USELESS — UNLESS IT DRIVES DECISIONS",
    "I BUILD AI THAT TURNS COMPLEXITY INTO CLARITY",
    "INSIGHT IS POWER — I ENGINEER BOTH",
    "PREDICTING WHAT MATTERS BEFORE IT HAPPENS",
    "FROM DATA TO DECISION — WITHOUT GUESSWORK",
  ];

  let index = 0;

  function changeText() {
    ceoText.style.opacity = 0;

    setTimeout(() => {
      const text = lines[index];
      ceoText.textContent = text;
      ceoText.setAttribute("data-text", text);
      ceoText.style.opacity = 1;

      index = (index + 1) % lines.length;
    }, 200);
  }

  setInterval(changeText, 2600);
  changeText();
}

/* =========================
LIVE TIME
========================= */
function updateLiveTime() {
  const el = document.getElementById("liveTime");
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
EYES FOLLOW (FIXED)
========================= */
const pupils = document.querySelectorAll(".pupil");

document.addEventListener("mousemove", (e) => {
  pupils.forEach((pupil) => {
    const eye = pupil.parentElement;
    const rect = eye.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const max = 3;

    if (dist > 0) {
      dx = (dx / dist) * max;
      dy = (dy / dist) * max;
    }

    pupil.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  });
});

/* =========================
BLINK (NATURAL)
========================= */
const eyes = document.querySelectorAll(".eye");

function blink() {
  eyes.forEach((eye) => eye.classList.add("blink"));

  setTimeout(() => {
    eyes.forEach((eye) => eye.classList.remove("blink"));
  }, 120);
}

/* random blinking */
setInterval(
  () => {
    blink();
  },
  2200 + Math.random() * 2000,
);

// set year
document.getElementById("year").textContent = new Date().getFullYear();

// reveal on load
window.addEventListener("load", () => {
  const footer = document.querySelector(".footer-interesting");
  if (footer) {
    footer.classList.add("visible");
  }
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (prefersReducedMotion.matches) {
  document.querySelectorAll("*").forEach((el) => {
    el.style.transition = "none";
    el.style.animation = "none";
  });
}

document.title = "Arshi Bansal | Portfolio";

window.addEventListener("blur", () => {
  document.title = "Come back 👀";
});

window.addEventListener("focus", () => {
  document.title = "Arshi Bansal | Portfolio";
});
