import { cartLines, orderTotals, summaryMarkup } from "./commerce.js";
import { getCart, money, safeText, setCart, toast, updateCartCount, writeStore } from "./utils.js";

const host = document.querySelector("#cart-content");
function render() {
  const totals = orderTotals();
  if (!totals.lines.length) {
    host.innerHTML = `<section class="empty-cart"><div class="empty-bag"><i class="fa-solid fa-bag-shopping"></i></div><h2>Your bag is taking a little breather.</h2><p>It’s a lovely day to find something new.</p><a class="button button-dark" href="products.html">Explore the shop <i class="fa-solid fa-arrow-right"></i></a></section>`;
    return;
  }
  host.innerHTML = `<section class="cart-items"><div class="cart-table-heading"><span>Your finds (${totals.lines.reduce((sum, line) => sum + line.quantity, 0)})</span><a href="products.html" class="text-link">Keep browsing</a></div>${totals.lines.map(line => `<article class="cart-item" data-cart-item="${line.id}"><a href="product-detail.html?id=${encodeURIComponent(line.id)}"><img src="${line.product.image}" alt="${safeText(line.product.name)}"></a><div class="cart-item-copy"><a class="cart-item-name" href="product-detail.html?id=${encodeURIComponent(line.id)}">${safeText(line.product.name)}</a><span>${safeText(line.product.category)}</span><button class="remove-item" data-remove="${line.id}">Remove</button></div><div class="cart-quantity"><button data-quantity="${line.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${line.quantity}</span><button data-quantity="${line.id}" data-change="1" aria-label="Increase quantity">+</button></div><strong class="cart-line-price">${money(line.product.price * line.quantity)}</strong></article>`).join("")}<div class="coupon-box"><label for="coupon-code">Have a little thank-you code?</label><div><input id="coupon-code" value="${totals.coupon}" placeholder="Enter code"><button id="apply-coupon" class="button button-outline">Apply</button></div><small>Try <strong>LUMA10</strong> for 10% off.</small></div></section><aside class="order-summary"><h2>A little summary</h2>${summaryMarkup(totals)}<a class="button button-dark full-button" href="checkout.html">On to checkout <i class="fa-solid fa-arrow-right"></i></a><p class="secure-note"><i class="fa-solid fa-lock"></i> Demo checkout · no payment collected</p></aside>`;
}
host.addEventListener("click", event => {
  const change = event.target.closest("[data-quantity]");
  const remove = event.target.closest("[data-remove]");
  if (change || remove) {
    const id = (change || remove).dataset.quantity || (change || remove).dataset.remove;
    let cart = getCart();
    if (remove) cart = cart.filter(item => item.id !== id);
    else {
      const item = cart.find(entry => entry.id === id);
      if (item) item.quantity = Math.max(1, Math.min(20, item.quantity + Number(change.dataset.change)));
    }
    setCart(cart); updateCartCount(); render();
  }
  if (event.target.closest("#apply-coupon")) {
    const code = host.querySelector("#coupon-code").value.trim().toUpperCase();
    if (code !== "LUMA10") { toast("That code didn’t work. Try LUMA10.", "error"); return; }
    writeStore("luma-coupon", code); toast("Lovely! Your 10% discount is applied."); render();
  }
});
render();
