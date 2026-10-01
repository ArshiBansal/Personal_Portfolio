/*  CORE HELPERS */

const $ = (selector, parent = document) => parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

/*  PAGE PROGRESS */

function updateScrollProgress() {
  const scrollTop = window.scrollY;

  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${Math.min(progress, 100)}%`,
  );

  const progressBar = $(".page-progress-bar");

  if (progressBar) {
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

/*  SMOOTH ANCHOR NAVIGATION */

$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

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

/*  REVEAL SYSTEM */

const revealElements = $$(".reveal");
const projectSections = $$(".project-section");

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 0.035, 0.35)}s`;
});

function revealElementsOnScroll() {
  const triggerPoint = window.innerHeight * 0.88;

  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < triggerPoint) {
      element.classList.add("visible");
    }
  });

  projectSections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.84) {
      section.classList.add("visible");
    }
  });
}

/*  ACTIVE RIGHT NAVBAR */

const navItems = $$(".nav-item");

function updateActiveNav() {
  if (!navItems.length || !projectSections.length) return;

  const marker = window.innerHeight * 0.38;

  let currentSection = "";

  projectSections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= marker) {
      currentSection = section.id;
    }
  });

  if (!currentSection) {
    currentSection = projectSections[0]?.id || "";
  }

  navItems.forEach((item) => {
    const target = item.getAttribute("href");

    item.classList.toggle("active", target === `#${currentSection}`);
  });
}

/*  NETWORK BACKGROUND */

const canvas = $("#network-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let particles = [];

  const particleCount = window.innerWidth < 768 ? 35 : 70;

  let canvasWidth = 0;
  let canvasHeight = 0;

  function resizeCanvas() {
    const ratio =
      window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) : 1;

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;

      this.vx = (Math.random() - 0.5) * (Math.random() < 0.5 ? 0.22 : 0.35);

      this.vy = (Math.random() - 0.5) * (Math.random() < 0.5 ? 0.22 : 0.35);

      this.radius = Math.random() * 1.4 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -10 || this.x > canvasWidth + 10) {
        this.vx *= -1;
      }

      if (this.y < -10 || this.y > canvasHeight + 10) {
        this.vy *= -1;
      }
    }

    draw() {
      ctx.beginPath();

      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      ctx.fillStyle = "rgba(70,70,70,0.45)";

      ctx.fill();
    }
  }

  function createParticles() {
    particles = Array.from({ length: particleCount }, () => new Particle());
  }

  function connectParticles() {
    const maxDistance = 100;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.16;

          ctx.beginPath();

          ctx.strokeStyle = `rgba(90,90,90,${opacity})`;

          ctx.lineWidth = 0.6;

          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.stroke();
        }
      }
    }
  }

  function animateNetwork() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    connectParticles();

    requestAnimationFrame(animateNetwork);
  }

  resizeCanvas();
  createParticles();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animateNetwork();
  } else {
    particles.forEach((particle) => {
      particle.draw();
    });

    connectParticles();
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener(
    "scroll",
    () => {
      const offset = Math.min(window.scrollY * 0.035, 80);

      canvas.style.transform = `translateY(${offset}px)`;
    },
    { passive: true },
  );
}

/*  CURSOR */
let cursorDot = null;
let cursorRing = null;

const canUseCustomCursor =
  window.innerWidth > 768 &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUseCustomCursor) {
  cursorDot = document.createElement("div");
  cursorRing = document.createElement("div");

  cursorDot.className = "cursor-dot";
  cursorRing.className = "cursor-ring";

  document.body.append(cursorDot, cursorRing);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let dotX = mouseX;
  let dotY = mouseY;

  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    },
    { passive: true },
  );

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.38;

    dotY += (mouseY - dotY) * 0.38;

    ringX += (mouseX - ringX) * 0.15;

    ringY += (mouseY - ringY) * 0.15;

    cursorDot.style.left = `${dotX}px`;

    cursorDot.style.top = `${dotY}px`;

    cursorRing.style.left = `${ringX}px`;

    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  function attachCursorInteractions() {
    $$(
      "a, button, .nav-item, .data-card, .model-card, .project-link, .architecture-node, .engineering-card, .application-stage",
    ).forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorDot.classList.add("hover");
        cursorRing.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursorDot.classList.remove("hover");
        cursorRing.classList.remove("hover");

        element.style.transform = "";
      });
    });
  }

  attachCursorInteractions();

  /* Magnetic movement for selected interactive elements */

  $$(".nav-item, .project-link").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;

      const y = event.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });
}

/*  CURSOR TRAIL */

if (canUseCustomCursor) {
  const trailContainer = document.createElement("div");

  trailContainer.className = "cursor-trail";

  document.body.appendChild(trailContainer);

  let lastTrailTime = 0;

  document.addEventListener(
    "mousemove",
    (event) => {
      const now = performance.now();

      if (now - lastTrailTime < 35) {
        return;
      }

      lastTrailTime = now;

      const dot = document.createElement("div");

      dot.className = "trail-dot";

      dot.style.left = `${event.clientX}px`;

      dot.style.top = `${event.clientY}px`;

      trailContainer.appendChild(dot);

      requestAnimationFrame(() => {
        dot.classList.add("fade");
      });

      setTimeout(() => {
        dot.remove();
      }, 650);
    },
    { passive: true },
  );
}

/*  METRIC COUNTERS */

const metricValues = $$(".data-value[data-count], [data-count]");

const countedMetrics = new WeakSet();

function animateMetric(element) {
  if (countedMetrics.has(element)) return;

  countedMetrics.add(element);

  const target = Number(element.dataset.count);

  if (Number.isNaN(target)) return;

  const prefix = element.dataset.prefix || "";

  const suffix = element.dataset.suffix || "";

  const duration = Number(element.dataset.duration) || 1200;

  const start = performance.now();

  function updateCounter(now) {
    const elapsed = now - start;

    const progress = Math.min(elapsed / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    const current = Math.floor(target * eased);

    element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    }
  }

  requestAnimationFrame(updateCounter);
}

function checkMetricCounters() {
  metricValues.forEach((metric) => {
    const rect = metric.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.86) {
      animateMetric(metric);
    }
  });
}

/*  PIPELINE ANIMATION */

let pipelineAnimated = new WeakSet();

function revealPipelines() {
  $$(".pipeline").forEach((pipeline) => {
    if (pipelineAnimated.has(pipeline)) {
      return;
    }

    const rect = pipeline.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.84) {
      pipelineAnimated.add(pipeline);

      const steps = $$(".pipeline-step", pipeline);

      steps.forEach((step, index) => {
        step.style.transition =
          "opacity 0.65s ease, transform 0.65s cubic-bezier(0.2,0.8,0.2,1)";

        step.style.transitionDelay = `${index * 0.12}s`;

        requestAnimationFrame(() => {
          step.style.opacity = "1";
          step.style.transform = "translateY(0)";
        });
      });
    }
  });
}

/*  EXPERIMENT TIMELINE */

let experimentAnimated = new WeakSet();

function revealExperiments() {
  $$(".experiment-track").forEach((track) => {
    if (experimentAnimated.has(track)) {
      return;
    }

    const rect = track.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.82) {
      experimentAnimated.add(track);

      $$(".experiment", track).forEach((experiment, index) => {
        experiment.style.transition =
          "opacity 0.7s ease, transform 0.7s cubic-bezier(0.2,0.8,0.2,1)";

        experiment.style.transitionDelay = `${index * 0.13}s`;

        requestAnimationFrame(() => {
          experiment.style.opacity = "1";
          experiment.style.transform = "translateX(0)";
        });
      });
    }
  });
}

/*  CARD STAGGER */

function prepareCardStagger() {
  const containers = [
    ".data-grid",
    ".model-grid",
    ".error-grid",
    ".engineering-grid",
    ".takeaway-grid",
    ".limitations-grid",
  ];

  containers.forEach((selector) => {
    $$(selector).forEach((container) => {
      Array.from(container.children).forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.06}s`;
      });
    });
  });
}

prepareCardStagger();

/*  PARALLAX DETAILS */

function updateParallax() {
  const scrollY = window.scrollY;

  const orbit = $(".signal-orbit");

  if (orbit) {
    const heroParallax = Math.min(scrollY * 0.08, 45);

    orbit.style.transform = `translateY(${heroParallax}px)`;
  }

  const highlights = $$(".story-highlight");

  highlights.forEach((highlight) => {
    const rect = highlight.getBoundingClientRect();

    const center = window.innerHeight / 2;

    const distance = rect.top - center;

    const shift = Math.max(-8, Math.min(8, -distance * 0.015));

    highlight.style.setProperty("--visual-shift", `${shift}px`);
  });
}

/*  HOVER TILT */

function enableTiltCards() {
  const cards = $$(".data-card, .model-card, .architecture-node");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 768) {
        return;
      }

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      const rotateX = ((y - rect.height / 2) / rect.height) * -3;

      const rotateY = ((x - rect.width / 2) / rect.width) * 3;

      card.style.transform = `perspective(800px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-7px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

enableTiltCards();

/*  SECTION STATE */

function updateSectionState() {
  updateActiveNav();
  revealElementsOnScroll();
  checkMetricCounters();
  revealPipelines();
  revealExperiments();
  updateParallax();
}

/*  SCROLL HANDLER */

let ticking = false;

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateSectionState();

      ticking = false;
    });

    ticking = true;
  }
}

window.addEventListener("scroll", handleScroll, { passive: true });

/* RESIZE */

window.addEventListener(
  "resize",
  () => {
    updateScrollProgress();
    updateActiveNav();
  },
  { passive: true },
);

/* FOOTER YEAR */

const yearElement = $("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* INITIALIZATION*/

function initializePage() {
  updateScrollProgress();
  updateSectionState();

  document.body.classList.add("page-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}

/*  REDUCED MOTION */

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("reduce-motion");

  revealElements.forEach((element) => {
    element.classList.add("visible");
  });

  projectSections.forEach((section) => {
    section.classList.add("visible");
  });

  $$(".pipeline-step").forEach((step) => {
    step.style.opacity = "1";
    step.style.transform = "none";
  });

  $$(".experiment").forEach((experiment) => {
    experiment.style.opacity = "1";
    experiment.style.transform = "none";
  });
}
