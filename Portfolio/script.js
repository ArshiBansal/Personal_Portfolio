/* UTILS */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

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
setInterval(updateLiveTime, 1000);

/* SMOOTH SCROLL */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (!href || href === "#") return;

    const target = $(href);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* BUTTON HOVER */
$$(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    if (!document.body.classList.contains("reduce-motion")) {
      btn.style.transform = "translateY(-4px)";
    }
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translateY(0)";
  });
});

/* SCROLL REVEAL */
const revealElements = $$(".reveal");

revealElements.forEach((el, index) => {
  if (!document.body.classList.contains("reduce-motion")) {
    el.style.transition = "all 0.8s ease";
    el.style.transitionDelay = `${index * 0.05}s`;
  }
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

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    connectParticles();

    requestAnimationFrame(animateParticles);
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
}

/* CURSOR SYSTEM
   DOT + RING + MAGNETIC */
let cursorEl = null;
let ringEl = null;

if (
  window.innerWidth > 768 &&
  !document.body.classList.contains("reduce-motion")
) {
  cursorEl = document.createElement("div");
  ringEl = document.createElement("div");

  cursorEl.className = "cursor-dot";
  ringEl.className = "cursor-ring";

  document.body.append(cursorEl, ringEl);

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

  function animateDot() {
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    cursorEl.style.left = `${dotX}px`;
    cursorEl.style.top = `${dotY}px`;

    requestAnimationFrame(animateDot);
  }

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ringEl.style.left = `${ringX}px`;
    ringEl.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }

  animateDot();
  animateRing();

  /* CURSOR INTERACTIONS */
  $$("a, button, .nav-item, .btn-main, .project-page-btn").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorEl.classList.add("hover");
      ringEl.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      cursorEl.classList.remove("hover");
      ringEl.classList.remove("hover");

      /*
       * Only reset magnetic elements.
       * This prevents overriding normal project/card styling.
       */
      if (
        el.classList.contains("btn-main") ||
        el.classList.contains("nav-item")
      ) {
        el.style.transform = "translate(0,0)";
      }
    });

    el.addEventListener("mousemove", (e) => {
      if (
        !el.classList.contains("btn-main") &&
        !el.classList.contains("nav-item")
      ) {
        return;
      }

      const rect = el.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;

      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
  });
}

/* CURSOR TRAIL */
if (
  window.innerWidth > 768 &&
  !document.body.classList.contains("reduce-motion")
) {
  const trailContainer = document.createElement("div");

  trailContainer.className = "cursor-trail";

  document.body.append(trailContainer);

  document.addEventListener("mousemove", (e) => {
    const dot = document.createElement("div");

    dot.className = "trail-dot";

    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    trailContainer.appendChild(dot);

    requestAnimationFrame(() => {
      dot.classList.add("fade");
    });

    setTimeout(() => {
      dot.remove();
    }, 600);
  });
}

/* EYES FOLLOW CURSOR */
const pupils = $$(".pupil");
const eyes = $$(".eye");

if (pupils.length > 0 && !document.body.classList.contains("reduce-motion")) {
  document.addEventListener("mousemove", (e) => {
    pupils.forEach((pupil) => {
      const parent = pupil.parentElement;

      if (!parent) return;

      const rect = parent.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;

      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxMovement = 3;

      const x = distance ? (dx / distance) * maxMovement : 0;

      const y = distance ? (dy / distance) * maxMovement : 0;

      pupil.style.transform = `translate(
          calc(-50% + ${x}px),
          calc(-50% + ${y}px)
        )`;
    });
  });
}

/* EYE BLINK */
function blink() {
  if (document.body.classList.contains("reduce-motion") || eyes.length === 0) {
    return;
  }

  eyes.forEach((eye) => {
    eye.classList.add("blink");
  });

  setTimeout(() => {
    eyes.forEach((eye) => {
      eye.classList.remove("blink");
    });
  }, 120);
}

setInterval(blink, 2200 + Math.random() * 2000);

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

/* FAVICON TAB STATE */
const favicon = $("link[rel='icon']");

if (favicon) {
  const normalFavicon = "assets/favicon-normal.png";
  const alertFavicon = "assets/favicon-alert.png";

  window.addEventListener("blur", () => {
    favicon.href = alertFavicon;
  });

  window.addEventListener("focus", () => {
    favicon.href = normalFavicon;
  });
}

/* SCROLL MASTER */
function handleScroll() {
  revealOnScroll();
  updateScrollProgress();
  updateActiveNav();
  updateProgressBar();
}

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

/* LOAD EVENTS */
window.addEventListener("load", () => {
  revealOnScroll();
  updateScrollProgress();
  updateActiveNav();
  updateProgressBar();

  const footer = $(".footer-interesting");

  if (footer) {
    footer.classList.add("visible");
  }
});

/* NAVBAR PROGRESS BAR */
function updateProgressBar() {
  const progress = $(".navbar-progress");

  if (!progress) return;

  const scrollTop = window.scrollY;

  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progress.style.backgroundSize = `${percent}% 100%`;
}

/* ACCESSIBILITY */
const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function applyMotionPreference() {
  if (reducedMotionQuery.matches) {
    document.body.classList.add("reduce-motion");
  } else {
    document.body.classList.remove("reduce-motion");
  }
}

applyMotionPreference();

if (reducedMotionQuery.addEventListener) {
  reducedMotionQuery.addEventListener("change", applyMotionPreference);
}

/* PAGE TITLE */
const defaultTitle = "Arshi Bansal | Portfolio";

document.title = defaultTitle;

window.addEventListener("blur", () => {
  document.title = "Come back 👀";
});

window.addEventListener("focus", () => {
  document.title = defaultTitle;
});

/* CONSOLE MESSAGE */
console.log("%cPortfolio Loaded", "color:#0d6efd;font-weight:bold");

/* HERO TYPING ROLES */
const roles = [
  "Business Analyst",
  "AI/ML Engineer",
  "Data Analyst",
  "Data Engineer",
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

/* CERTIFICATE PAGINATION 2 ROWS × 3 COLUMNS */
document.addEventListener("DOMContentLoaded", () => {
  const indicatorDots = $$(".indicator-dot");

  const progressBar = $(".pagination-progress");

  const certificatesGrid = $(".certificates-grid");

  const allCards = $$(".certificate-card");

  if (!certificatesGrid || allCards.length === 0) {
    return;
  }

  let currentGroup = 0;

  const cardsPerGroup = 6;

  const totalGroups = Math.ceil(allCards.length / cardsPerGroup);

  /* CARD ANIMATIONS */
  function resetCardAnimations() {
    allCards.forEach((card) => {
      card.style.animation = "none";
      card.style.opacity = "0";
      card.style.transform = "translateY(40px)";
    });
  }

  /* SHOW CERTIFICATE GROUP */
  function showGroup(groupIndex) {
    const startIndex = groupIndex * cardsPerGroup;

    const endIndex = startIndex + cardsPerGroup;

    allCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = "flex";
        card.style.pointerEvents = "auto";

        if (document.body.classList.contains("reduce-motion")) {
          card.style.animation = "none";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          return;
        }

        const position = index - startIndex;

        const animationTypes = [
          "cardEnterStagger1",
          "cardEnterStagger2",
          "cardEnterStagger3",
          "cardEnterStagger1",
          "cardEnterStagger2",
          "cardEnterStagger3",
        ];

        const animationType = animationTypes[position];

        const delay = position * 0.1;

        /* Force reflow */
        card.style.animation = "none";
        void card.offsetWidth;

        card.style.animation =
          `${animationType} 0.7s ` +
          `cubic-bezier(0.34, 1.56, 0.64, 1) ` +
          `${delay}s forwards`;
      } else {
        card.style.display = "none";
        card.style.pointerEvents = "none";
      }
    });
  }

  /* PAGINATION PROGRESS */
  function updateCertificateProgress(groupIndex) {
    const progress = ((groupIndex + 1) / totalGroups) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  /* DOT CONTROLS */
  indicatorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const groupIndex = parseInt(dot.dataset.group, 10);

      if (Number.isNaN(groupIndex) || groupIndex >= totalGroups) {
        return;
      }

      indicatorDots.forEach((item) => {
        item.classList.remove("active");
      });

      dot.classList.add("active");

      currentGroup = groupIndex;

      showGroup(currentGroup);

      updateCertificateProgress(currentGroup);

      const certSection = $(".certificates-section");

      if (certSection && !document.body.classList.contains("reduce-motion")) {
        setTimeout(() => {
          certSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  });

  /* INITIALIZE */
  if (indicatorDots.length > 0) {
    indicatorDots[0].classList.add("active");
  }

  resetCardAnimations();

  showGroup(0);

  updateCertificateProgress(0);
});

/* =========================================================
   OPEN SOURCE TIMELINE
   ========================================================= */

const openSourceSection = document.querySelector("#opensource");

if (openSourceSection) {
  const timeline = openSourceSection.querySelector(".opensource-timeline");

  if (timeline) {
    const openSourceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add("active");
            openSourceObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    openSourceObserver.observe(openSourceSection);
  }
}
