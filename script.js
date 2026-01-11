/* Particle background */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width, height;
const MAX_DISTANCE = 120;

const particles = [];
let currentCount = getParticleCount();

function getParticleCount() {
  if (window.innerWidth < 640) return 50;
  if (window.innerWidth < 1024) return 80;
  return 120;
}

function resize() {
  const oldWidth = width || window.innerWidth;
  const oldHeight = height || window.innerHeight;

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  // Re-map positions proportionally
  particles.forEach((p) => {
    p.x = (p.x / oldWidth) * width;
    p.y = (p.y / oldHeight) * height;
  });

  // Recalculate particle count
  const newCount = getParticleCount();
  if (newCount !== currentCount) {
    currentCount = newCount;
    initParticles(currentCount);
  }
}

//  Debounced resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 150);
});

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(random = false) {
    this.x = random ? Math.random() * width : this.x;
    this.y = random ? Math.random() * height : this.y;
    this.r = Math.random() * 3 + 0.8;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.4 + 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x < -20 ||
      this.x > width + 20 ||
      this.y < -20 ||
      this.y > height + 20
    ) {
      this.reset(true);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles(count) {
  particles.length = 0;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

//  Draw connecting lines
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DISTANCE) {
        const opacity = 1 - dist / MAX_DISTANCE;
        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

//  Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  drawLines();
  requestAnimationFrame(animate);
}

resize();
initParticles(currentCount);
animate();


/* Scroll button up & getting current year */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight - 10) {
    backToTopBtn.classList.remove("hidden");
    backToTopBtn.classList.add("flex");
  } else {
    backToTopBtn.classList.remove("flex");
    backToTopBtn.classList.add("hidden");
  }
});

// Smooth scroll to top
function smoothScrollToTop(duration = 600) {
  const start = window.scrollY;
  const startTime = performance.now();

  function scrollStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

backToTopBtn.addEventListener("click", () => {
  smoothScrollToTop();
});

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});



/* Parallax effect for floating images */
document.addEventListener("DOMContentLoaded", () => {
  const parallaxContainer = document.getElementById("profile-parallax");
  if (!parallaxContainer) return;

  const items = parallaxContainer.querySelectorAll(".floating-item");

  function handleMouseMove(e) {
    const rect = parallaxContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    items.forEach((item) => {
      const depth = Number(item.dataset.depth) || 10;

      const moveX = (-dx / rect.width) * depth;
      const moveY = (-dy / rect.height) * depth;

      item.style.setProperty("--px", `${moveX}px`);
      item.style.setProperty("--py", `${moveY}px`);
    });
  }

  window.addEventListener("mousemove", handleMouseMove);

  window.addEventListener("mouseleave", () => {
    items.forEach((item) => {
      item.style.setProperty("--px", "0px");
      item.style.setProperty("--py", "0px");
    });
  });
});


const trailer = document.getElementById("trailer");

const animateTrailer = (e, interacting) => {
  const x = e.clientX - trailer.offsetWidth / 2;
  const y = e.clientY - trailer.offsetHeight / 2;

  trailer.animate(
    {
      transform: `translate(${x}px, ${y}px) scale(${interacting ? 3 : 1})`,
    },
    {
      duration: 800,
      fill: "forwards",
    }
  );
};

const getTrailerClass = (type) => {
  switch (type) {
    case "video":
      return "fa-solid fa-play";
    default:
      return "ri-arrow-right-up-line";
  }
};

window.onmousemove = (e) => {
  const interactable = e.target.closest(".interactable");
  const interacting = interactable !== null;

  const icon = document.getElementById("trailer-icon");

  animateTrailer(e, interacting);

  trailer.dataset.type = interacting ? interactable.dataset.type : "";

  if (interacting) {
    icon.className = getTrailerClass(interactable.dataset.type);
  }
};


/* Card effect */
const cards = document.querySelectorAll(".card");
const cardsContainer = document.getElementById("cards");

cardsContainer.addEventListener("mousemove", (e) => {
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    card.style.setProperty("--inner-glow", 0);
    card.style.setProperty("--border-glow", 0);

    const isInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (isInside) {
      card.style.setProperty("--inner-glow", 1);
      card.style.setProperty("--border-glow", 1);
      return;
    }

    const dx = Math.max(rect.left - e.clientX, e.clientX - rect.right, 0);
    const dy = Math.max(rect.top - e.clientY, e.clientY - rect.bottom, 0);
    const distanceToEdge = Math.hypot(dx, dy);

    const maxEdgeDistance = 80;

    if (distanceToEdge < maxEdgeDistance) {
      const glow = 1 - distanceToEdge / maxEdgeDistance;
      card.style.setProperty("--border-glow", glow.toFixed(2));
    }
  });
});

cardsContainer.addEventListener("mouseleave", () => {
  cards.forEach((card) => {
    card.style.setProperty("--inner-glow", 0);
    card.style.setProperty("--border-glow", 0);
  });
});


