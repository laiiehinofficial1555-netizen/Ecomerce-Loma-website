import { products } from "./data.js";
import { productCard } from "./components.js";
import { addToCart, getWishlist, money, safeText, toast, toggleWishlist } from "./utils.js";

const product = products.find(item => item.id === new URLSearchParams(location.search).get("id")) || products[0];
document.title = `${product.name} — Luma`;
document.querySelector("#detail-crumb").textContent = product.name;
const saved = getWishlist().includes(product.id);
document.querySelector("#product-detail").innerHTML = `<div class="detail-grid"><div class="detail-image"><img src="${product.image}" alt="${safeText(product.name)}">${product.badge ? `<span class="product-badge">${safeText(product.badge)}</span>` : ""}</div><div class="detail-copy"><span class="eyebrow">${safeText(product.category)}</span><h1>${safeText(product.name)}</h1><div class="detail-rating"><span>★★★★★</span> ${product.rating} <a href="#reviews">(${product.reviews} reviews)</a></div><div class="detail-price">${money(product.price)} ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div><p class="detail-description">${safeText(product.description)}</p><ul class="detail-points"><li><i class="fa-solid fa-check"></i> Thoughtfully selected, made to last</li><li><i class="fa-solid fa-check"></i> Complimentary shipping over $100</li><li><i class="fa-solid fa-check"></i> 30-day returns, no fuss</li></ul><div class="detail-actions"><label class="quantity-control">Qty <input id="detail-quantity" type="number" min="1" max="20" value="1"></label><button id="detail-add" class="button button-dark">Add to bag <i class="fa-solid fa-arrow-right"></i></button><button id="detail-wishlist" class="button button-icon ${saved ? "is-saved" : ""}" aria-label="Toggle wishlist"><i class="${saved ? "fa-solid" : "fa-regular"} fa-heart"></i></button></div><div class="detail-note"><i class="fa-solid fa-box-open"></i><span>Wrapped with care, and on its way to you in 2–5 business days.</span></div></div></div>`;
document.querySelector("#detail-add").addEventListener("click", () => {
  const quantity = Number(document.querySelector("#detail-quantity").value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) { toast("Choose a quantity between 1 and 20.", "error"); return; }
  addToCart(product.id, quantity);
});
document.querySelector("#detail-wishlist").addEventListener("click", event => {
  const isSaved = toggleWishlist(product.id);
  event.currentTarget.classList.toggle("is-saved", isSaved);
  event.currentTarget.innerHTML = `<i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
});
document.querySelector("#related-products").innerHTML = products.filter(item => item.id !== product.id && item.category === product.category).slice(0, 4).map(productCard).join("") || products.filter(item => item.id !== product.id).slice(0, 4).map(productCard).join("");
