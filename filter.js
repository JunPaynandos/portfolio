// filter function
document.addEventListener("DOMContentLoaded", () => {
  const filterItems = document.querySelectorAll("#project-filters li");
  const grid = document.querySelector(".grid");
  const cards = Array.from(document.querySelectorAll(".project-card"));

  if (!filterItems.length || !grid || !cards.length) return;

  const originalOrder = [...cards];
  const FADE_DURATION = 400;

  function showCard(card) {
    card.style.display = "block";
    card.style.pointerEvents = "";
    requestAnimationFrame(() => {
      card.classList.remove("opacity-0", "scale-[0.97]");
      card.classList.add("opacity-100", "scale-100");
    });
  }

  function hideCard(card) {
    card.classList.add("opacity-0", "scale-[0.97]");
    card.classList.remove("opacity-100", "scale-100");
    card.style.pointerEvents = "none";

    setTimeout(() => {
      card.style.display = "none";
    }, FADE_DURATION);
  }

  function applyFilter(filter) {
    const matched = [];
    const unmatched = [];

    originalOrder.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      if (filter === "all" || categories.includes(filter)) {
        matched.push(card);
      } else {
        unmatched.push(card);
      }
    });

    // Reorder DOM: matched cards first
    [...matched, ...unmatched].forEach((card) => grid.appendChild(card));

    // Animate
    matched.forEach(showCard);
    unmatched.forEach(hideCard);
  }

  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      const filter = item.dataset.filter;

      // Update active filter UI
      filterItems.forEach((i) => {
        i.classList.remove("border-b-2", "border-white", "text-white");
        i.classList.add("text-zinc-400");
      });

      item.classList.add("border-b-2", "border-white", "text-white");
      item.classList.remove("text-zinc-400");

      applyFilter(filter);
    });
  });

  // Initial state
  applyFilter("all");
});