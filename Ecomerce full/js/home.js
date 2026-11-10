import { categories, products } from "./data.js";
import { productCard } from "./components.js";
import { safeText } from "./utils.js";

const categoryHost = document.querySelector("#home-categories");
categoryHost.innerHTML = categories.map(category => `<a class="category-card" href="products.html?category=${encodeURIComponent(category.name)}"><img src="${category.image}" alt="" loading="lazy"><span class="category-icon"><i class="fa-solid ${category.icon}"></i></span><strong>${safeText(category.name)}</strong><span class="category-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></span></a>`).join("");
document.querySelector("#home-products").innerHTML = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4).map(productCard).join("");
