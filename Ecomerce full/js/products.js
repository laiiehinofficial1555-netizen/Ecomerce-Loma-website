import { products, categories } from "./data.js";
import { productCard } from "./components.js";
import { safeText } from "./utils.js";

const search = document.querySelector("#product-search");
const category = document.querySelector("#filter-category");
const sort = document.querySelector("#sort-products");
const min = document.querySelector("#min-price");
const max = document.querySelector("#max-price");
const list = document.querySelector("#product-list");
const perPage = 8;
let currentPage = 1;
categories.forEach(item => category.insertAdjacentHTML("beforeend", `<option value="${safeText(item.name)}">${safeText(item.name)}</option>`));
const initialCategory = new URLSearchParams(location.search).get("category");
if (initialCategory && categories.some(item => item.name === initialCategory)) category.value = initialCategory;

function render() {
  const term = search.value.trim().toLowerCase();
  let visible = products.filter(product =>
    (!term || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)) &&
    (!category.value || product.category === category.value) &&
    (!min.value || product.price >= Number(min.value)) &&
    (!max.value || product.price <= Number(max.value))
  );
  const comparator = {
    popular: (a, b) => b.popularity - a.popularity,
    newest: (a, b) => b.date.localeCompare(a.date),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price
  }[sort.value];
  visible.sort(comparator);
  const pages = Math.max(1, Math.ceil(visible.length / perPage));
  currentPage = Math.min(currentPage, pages);
  const offset = (currentPage - 1) * perPage;
  document.querySelector("#results-count").textContent = `${visible.length} thoughtfully found ${visible.length === 1 ? "piece" : "pieces"}`;
  list.innerHTML = visible.slice(offset, offset + perPage).map(productCard).join("") || `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h2>No lovely finds just yet</h2><p>Try a different search or clear the filters.</p></div>`;
  document.querySelector("#pagination").innerHTML = pages > 1 ? Array.from({ length: pages }, (_, index) => `<button class="${currentPage === index + 1 ? "current" : ""}" data-page="${index + 1}" aria-label="Page ${index + 1}">${index + 1}</button>`).join("") : "";
}

[search, category, sort, min, max].forEach(control => control.addEventListener("input", () => { currentPage = 1; render(); }));
document.querySelector("#clear-filters").addEventListener("click", () => {
  search.value = ""; category.value = ""; sort.value = "popular"; min.value = ""; max.value = ""; currentPage = 1; render();
});
document.querySelector("#pagination").addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (button) { currentPage = Number(button.dataset.page); render(); window.scrollTo({ top: document.querySelector(".shop-toolbar").offsetTop - 20, behavior: "smooth" }); }
});
render();
