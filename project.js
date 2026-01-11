const page = document.getElementById("page");
const transition = document.getElementById("page-transition");

const mainImageEl = document.getElementById("image-main");
const sideImage1El = document.getElementById("image-side-1");
const sideImage2El = document.getElementById("image-side-2");

const briefEl = document.getElementById("brief");
const infoEl = document.getElementById("info");
const prevEl = document.getElementById("prev");
const nextEl = document.getElementById("next");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Guard: missing ID
if (!id) {
  show404();
  throw new Error("Missing project ID in URL");
}

fetch("data/projects.json")
  .then((res) => res.json())
  .then((projects) => {
    const index = projects.findIndex((p) => p.id === id);

    // 404 fallback
    if (index === -1) {
      show404();
      return;
    }

    const project = projects[index];

    document.title = `${project.info["Project Name"]} | Jun`;

    /* ---------- Images (60 / 40 layout) ---------- */
    if (project.images && project.images.length >= 3) {
      mainImageEl.src = project.images[0];
      sideImage1El.src = project.images[1];
      sideImage2El.src = project.images[2];

      mainImageEl.alt = project.info["Project Name"];
      sideImage1El.alt = project.info["Project Name"];
      sideImage2El.alt = project.info["Project Name"];
    }

    /* ---------- Project Brief ---------- */
    briefEl.innerHTML = project.brief.map((p) => `<p>${p}</p>`).join("");

    /* ---------- Project Info ---------- */
    infoEl.innerHTML = Object.entries(project.info)
      .filter(([key, value]) => value && value.trim() !== "")
      .map(([key, value]) => {
        const lowerKey = key.toLowerCase();

        if (lowerKey === "website") {
          return `
        <div class="flex justify-between gap-6 border-b border-zinc-800 pb-2">
          <dt class="text-zinc-400 font-semibold">${key}</dt>
          <dd class="text-right">
            <a href="https://${value}" target="_blank" class="underline hover:text-zinc-300">
              ${value}
            </a>
          </dd>
        </div>
      `;
        }

        if (lowerKey === "github") {
          return `
        <div class="flex justify-between gap-6 border-b border-zinc-800 pb-2">
          <dt class="text-zinc-400 font-semibold">${key}</dt>
          <dd class="text-right">
            <a href="${value}" target="_blank" class="underline hover:text-zinc-300">
              View Repository
            </a>
          </dd>
        </div>
      `;
        }

        return `
      <div class="flex justify-between gap-6 border-b border-zinc-800 pb-2">
        <dt class="text-zinc-400 font-semibold">${key}</dt>
        <dd class="text-white text-right">${value}</dd>
      </div>
    `;
      })
      .join("");

    /* ---------- Previous / Next navigation ---------- */
    const prev = projects[index - 1];
    const next = projects[index + 1];

    if (prev) {
      prevEl.href = `project.html?id=${prev.id}`;
      prevEl.innerHTML = `<i class="fa-solid fa-angle-left"></i> ${prev.info["Project Name"]}`;
      addPageTransition(prevEl);
    }

    if (next) {
      nextEl.href = `project.html?id=${next.id}`;
      nextEl.innerHTML = `${next.info["Project Name"]} <i class="fa-solid fa-angle-right"></i>`;
      addPageTransition(nextEl);
    }

    /* ---------- Preload animation ---------- */
    requestAnimationFrame(() => {
      page.classList.remove("opacity-0", "translate-y-6");
    });
  })
  .catch(show404);

/* ---------- Page transition ---------- */
function addPageTransition(link) {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    transition?.classList.remove("translate-x-full");

    setTimeout(() => {
      window.location = link.href;
    }, 600);
  });
}

/* ---------- 404 ---------- */
function show404() {
  document.body.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-black text-white">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <p class="text-zinc-400 mb-6">Project not found</p>
        <a href="project_list.html" class="underline">Back to projects</a>
      </div>
    </div>
  `;
}

/* ---------- image zoom function ---------- */
const images = document.querySelectorAll(
  "#image-main, #image-side-1, #image-side-2"
);

const overlay = document.getElementById("image-overlay");
const overlayImg = document.getElementById("overlay-img");

images.forEach((img) => {
  img.classList.add("cursor-zoom-in");

  img.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    overlayImg.src = img.src;

    requestAnimationFrame(() => {
      overlayImg.classList.remove("scale-75", "opacity-0");
      overlayImg.classList.add("scale-100", "opacity-100");
    });
  });
});

overlay.addEventListener("click", () => {
  overlayImg.classList.remove("scale-100", "opacity-100");
  overlayImg.classList.add("scale-75", "opacity-0");

  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
    overlay.click();
  }
});
