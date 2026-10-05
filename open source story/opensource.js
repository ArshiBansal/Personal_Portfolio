/* GSSoC 2026 — Open Source Contribution Case Study */

"use strict";

/* DOM HELPERS */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];

/* PAGE INITIALIZATION */

document.addEventListener("DOMContentLoaded", initPage);

function initPage() {
  initPageProgress();
  initSmoothNavigation();
  initRevealSystem();
  initNetworkBackground();
  initCustomCursor();
  initCursorTrail();
  initCounters();
  initContributionFlow();
  initJourneyAnimation();
  initCardStagger();
  initHeroParallax();
  initTilt();
  initScrollState();
  initActiveSections();
  initFooterYear();
}

/* PAGE PROGRESS */

function initPageProgress() {
  const progress = $("#page-progress");

  if (!progress) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  };

  window.addEventListener("scroll", updateProgress, {
    passive: true,
  });

  window.addEventListener("resize", updateProgress);

  updateProgress();
}

/* SMOOTH NAVIGATION */

function initSmoothNavigation() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

/* REVEAL SYSTEM */

function initRevealSystem() {
  const elements = $$(".reveal");

  if (!elements.length) return;

  elements.forEach((element) => {
    element.classList.add("visible");
  });

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  setTimeout(() => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add("visible");
      }
    });
  }, 150);
}

/* NETWORK BACKGROUND */

function initNetworkBackground() {
  const canvas = $("#network-bg");

  if (!canvas) return;

  const context = canvas.getContext("2d");

  if (!context) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = null;

  const settings = {
    count: window.innerWidth < 700 ? 28 : 55,
    distance: window.innerWidth < 700 ? 105 : 145,
    speed: reducedMotion ? 0 : 0.18,
  };

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    createParticles();
  }

  function createParticles() {
    particles = [];

    for (let i = 0; i < settings.count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * settings.speed,
        vy: (Math.random() - 0.5) * settings.speed,
        radius: Math.random() * 1.2 + 0.4,
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      if (!reducedMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fillStyle = "rgba(17,17,17,0.22)";
      context.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < settings.distance) {
          const opacity = (1 - distance / settings.distance) * 0.12;

          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(17,17,17,${opacity})`;
          context.lineWidth = 0.6;
          context.stroke();
        }
      }
    }

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  draw();

  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
}

/* CUSTOM CURSOR */

function initCustomCursor() {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  if (isTouch) return;

  const cursor = document.createElement("div");

  cursor.className = "cursor";
  document.body.appendChild(cursor);

  let mouseX = -100;
  let mouseY = -100;
  let currentX = -100;
  let currentY = -100;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const animateCursor = () => {
    currentX += (mouseX - currentX) * 0.18;
    currentY += (mouseY - currentY) * 0.18;

    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;

    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  $$(
    "a, .work-card, .skill-card, .program-card, .metric-card, .contribution-node",
  ).forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });
}

/* CURSOR TRAIL */

function initCursorTrail() {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (isTouch || reducedMotion) return;

  const trailCount = 5;
  const trails = [];

  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement("span");

    dot.style.position = "fixed";
    dot.style.width = `${3 - i * 0.3}px`;
    dot.style.height = `${3 - i * 0.3}px`;
    dot.style.borderRadius = "50%";
    dot.style.background = "rgba(17,17,17,0.2)";
    dot.style.pointerEvents = "none";
    dot.style.zIndex = "9998";
    dot.style.left = "-20px";
    dot.style.top = "-20px";

    document.body.appendChild(dot);
    trails.push({
      element: dot,
      x: -20,
      y: -20,
    });
  }

  let mouseX = -20;
  let mouseY = -20;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animate() {
    let previousX = mouseX;
    let previousY = mouseY;

    trails.forEach((trail, index) => {
      const factor = 0.16 - index * 0.018;

      trail.x += (previousX - trail.x) * factor;
      trail.y += (previousY - trail.y) * factor;

      trail.element.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;

      previousX = trail.x;
      previousY = trail.y;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* COUNTERS */

function initCounters() {
  const counters = $$("[data-count]");

  if (!counters.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-count"));

    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      counter.textContent = target.toLocaleString();
      return;
    }

    let started = false;

    const startCounter = () => {
      if (started) return;

      started = true;

      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.floor(eased * target);

        counter.textContent = currentValue.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(update);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounter();
              observer.unobserve(counter);
            }
          });
        },
        {
          threshold: 0.4,
        },
      );

      observer.observe(counter);
    } else {
      startCounter();
    }
  });
}

/* CONTRIBUTION FLOW */

function initContributionFlow() {
  const nodes = $$(".contribution-node");

  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${index * 80}ms`;
  });

  nodes.forEach((node) => {
    node.addEventListener("mouseenter", () => {
      node.style.transform = "translateY(-8px)";
    });

    node.addEventListener("mouseleave", () => {
      node.style.transform = "translateY(0)";
    });
  });
}

/* JOURNEY ANIMATION */

function initJourneyAnimation() {
  const items = $$(".journey-item");

  if (!items.length) return;

  items.forEach((item, index) => {
    item.style.transitionDelay = `${index * 100}ms`;
  });
}

/* CARD STAGGER */

function initCardStagger() {
  const groups = [
    ".program-grid",
    ".metrics-grid",
    ".work-grid",
    ".skills-grid",
    ".project-links",
    ".contribution-flow",
  ];

  groups.forEach((selector) => {
    const group = $(selector);

    if (!group) return;

    const cards = $$(":scope > .reveal", group);

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 70}ms`;
    });
  });
}

/* HERO PARALLAX */

function initHeroParallax() {
  const hero = $(".hero-main");
  const visual = $(".hero-visual");

  if (!hero || !visual) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight) {
      const amount = Math.min(scrollY * 0.12, 70);

      visual.style.transform = `translateY(${amount}px)`;
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    {
      passive: true,
    },
  );
}

/* TILT EFFECT */

function initTilt() {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (isTouch || reducedMotion) return;

  const elements = $$(
    ".metric-card, .program-card, .work-card, .skill-card, .certificate-panel, .leaderboard-card, .contribution-node",
  );

  elements.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;

      const y = (event.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 3;

      const rotateY = (x - 0.5) * 3;

      element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
    });
  });
}

/* SCROLL STATE */

function initScrollState() {
  const body = document.body;

  const update = () => {
    if (window.scrollY > 40) {
      body.classList.add("is-scrolling");
    } else {
      body.classList.remove("is-scrolling");
    }
  };

  window.addEventListener("scroll", update, {
    passive: true,
  });

  update();
}

/* ACTIVE SECTION */

function initActiveSections() {
  const sections = $$("main .project-section");

  if (!sections.length) return;

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-active");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-10% 0px -25% 0px",
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

/* FOOTER YEAR */

function initFooterYear() {
  const year = $("#footer-year");

  if (!year) return;

  year.textContent = new Date().getFullYear();
}

/* VISIBILITY SAFETY */

window.addEventListener("load", () => {
  $$(".project-section, .reveal").forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = element.style.transform || "translateY(0)";
  });
});

/* RESIZE SAFETY */

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    $$(".reveal").forEach((element) => {
      element.classList.add("visible");
    });
  }, 150);
});
