/* =========================
DISABLE COPY / RIGHT CLICK
========================= */

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (e.ctrlKey && ["c", "u", "s"].includes(key)) e.preventDefault();
  if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key))
    e.preventDefault();
  if (key === "f12") e.preventDefault();
});

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

    if (elementTop < windowHeight - 120) {
      if (!el.classList.contains("visible")) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.classList.add("visible");
      }
    }
  });
}

revealElements.forEach((el, index) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(80px)";
  el.style.transition = "all 0.8s ease";
  el.style.transitionDelay = `${index * 0.05}s`;
});

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* =========================
PROJECT CARD TILT
========================= */

const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 25;
    const rotateY = (x - rect.width / 2) / 25;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

/* =========================
BACK TO TOP BUTTON
========================= */

const topBtn = document.createElement("button");
topBtn.id = "topBtn";

topBtn.innerHTML = `
  <div class="arrow-wrapper">
    <span class="top-line"></span>
    <i class="fa-solid fa-arrow-up"></i>
  </div>
`;

document.body.appendChild(topBtn);

let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (document.documentElement.scrollTop > 300) {
        topBtn.classList.add("show");
      } else {
        topBtn.classList.remove("show");
      }
      ticking = false;
    });
    ticking = true;
  }
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================
PARTICLE NETWORK BACKGROUND
========================= */

const canvas = document.getElementById("network-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let particles = [];
  const particleCount = 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
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
      ctx.fillStyle = "#444";
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
          ctx.strokeStyle = "rgba(100,100,100,0.2)";
          ctx.lineWidth = 1;
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
}

/* =========================
NAVBAR ACTIVE STATE
========================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");

function updateActiveLink() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
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
🔥 CUSTOM CURSOR SYSTEM
========================= */

// disable on mobile
if (window.innerWidth > 768) {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");

  const ring = document.createElement("div");
  ring.classList.add("cursor-ring");

  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  let mouseX = 0;
  let mouseY = 0;

  let dotX = 0;
  let dotY = 0;

  let ringX = 0;
  let ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // smooth dot
  function animateDot() {
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    cursor.style.left = dotX + "px";
    cursor.style.top = dotY + "px";

    requestAnimationFrame(animateDot);
  }

  // smooth ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";

    requestAnimationFrame(animateRing);
  }

  animateDot();
  animateRing();

  /* hover expand */
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

  /* click feedback */
  document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    ring.style.transform = "translate(-50%, -50%) scale(1.1)";
  });

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    ring.style.transform = "translate(-50%, -50%) scale(1)";
  });

  /* magnetic effect (safe only) */
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