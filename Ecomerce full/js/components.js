import { getWishlist, safeText, toggleWishlist, addToCart, money } from "./utils.js";

export function productCard(product) {
  const saved = getWishlist().includes(product.id);
  return `<article class="product-card">
    <a class="product-image" href="product-detail.html?id=${encodeURIComponent(product.id)}"><img src="${product.image}" alt="${safeText(product.name)}" loading="lazy">${product.badge ? `<span class="product-badge">${safeText(product.badge)}</span>` : ""}</a>
    <button class="wishlist-button ${saved ? "is-saved" : ""}" data-wishlist="${product.id}" aria-label="${saved ? "Remove from" : "Add to"} wishlist"><i class="${saved ? "fa-solid" : "fa-regular"} fa-heart"></i></button>
    <div class="product-info"><a href="product-detail.html?id=${encodeURIComponent(product.id)}" class="product-name">${safeText(product.name)}</a><div class="product-rating"><span>★</span> ${product.rating} <small>(${product.reviews})</small></div><div class="product-buy"><span class="product-price">${money(product.price)}${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</span><button class="quick-add" data-add="${product.id}" aria-label="Add ${safeText(product.name)} to bag"><i class="fa-solid fa-plus"></i></button></div></div>
  </article>`;
}

document.addEventListener("click", event => {
  const wishlist = event.target.closest("[data-wishlist]");
  if (wishlist) {
    const saved = toggleWishlist(wishlist.dataset.wishlist);
    wishlist.classList.toggle("is-saved", saved);
    wishlist.innerHTML = `<i class="${saved ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
    wishlist.setAttribute("aria-label", `${saved ? "Remove from" : "Add to"} wishlist`);
  }
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
});
