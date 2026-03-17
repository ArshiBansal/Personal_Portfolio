/* =========================
DISABLE COPY / RIGHT CLICK
========================= */

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && (e.key === "c" || e.key === "u" || e.key === "s")) {
    e.preventDefault();
  }

  if (
    e.ctrlKey &&
    e.shiftKey &&
    (e.key === "I" || e.key === "J" || e.key === "C")
  ) {
    e.preventDefault();
  }

  if (e.key === "F12") {
    e.preventDefault();
  }
});

/* =========================
SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* =========================
SCROLL REVEAL ANIMATION
========================= */
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
}

revealElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(80px)";
  el.style.transition = "all 0.8s ease";
});

window.addEventListener("scroll", revealOnScroll);

/* =========================
PROJECT CARD TILT EFFECT
========================= */

const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 25;
    const rotateY = (x - centerX) / 25;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});

/* =========================
BACK TO TOP BUTTON
========================= */

const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";
topBtn.id = "topBtn";

document.body.appendChild(topBtn);

topBtn.style.position = "fixed";
topBtn.style.bottom = "40px";
topBtn.style.right = "40px";
topBtn.style.padding = "12px 18px";
topBtn.style.fontSize = "18px";
topBtn.style.borderRadius = "50px";
topBtn.style.border = "none";
topBtn.style.background = "#111";
topBtn.style.color = "#fff";
topBtn.style.cursor = "pointer";
topBtn.style.display = "none";
topBtn.style.zIndex = "999";

window.addEventListener("scroll", function () {
  if (document.documentElement.scrollTop > 300) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});

topBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =========================
PARTICLE NETWORK BACKGROUND
========================= */

const canvas = document.getElementById("network-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const particleCount = 80;

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
    particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;

        const distance = dx * dx + dy * dy;

        if (distance < 12000) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,0,0,0.18)";
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
  });
}

/* =========================
RIGHT NAVBAR ACTIVE STATE TRACKING
========================= */

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 250) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href').slice(1) === current) {
      item.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav(); // Initial call
