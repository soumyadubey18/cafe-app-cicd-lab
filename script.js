// Filter the menu cards as the visitor types.
const searchInput = document.querySelector("#menu-search");
const menuCards = [...document.querySelectorAll(".menu-card")];
const emptyState = document.querySelector("#empty-state");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  for (const card of menuCards) {
    const text = `${card.dataset.name} ${card.textContent}`.toLowerCase();
    const matches = text.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount++;
  }

  emptyState.hidden = visibleCount !== 0;
});
