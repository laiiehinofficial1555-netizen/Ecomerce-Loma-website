import { orderTotals, summaryMarkup } from "./commerce.js";
import { getCurrentUser, money, readStore, safeText, setCart, toast, updateCartCount, writeStore } from "./utils.js";

const host = document.querySelector("#checkout-content");
const totals = orderTotals();
if (!totals.lines.length) {
  host.innerHTML = `<section class="empty-cart"><h2>Your bag is empty.</h2><p>Let's find something lovely first.</p><a class="button button-dark" href="products.html">Explore the shop</a></section>`;
} else {
  const user = getCurrentUser();
  host.innerHTML = `<div class="checkout-layout"><form id="checkout-form" class="checkout-form"><section class="checkout-section"><div class="checkout-title"><span>01</span><div><h2>Where should we send it?</h2><p>Just the essentials to get your parcel to you.</p></div></div><div class="form-grid"><label class="wide-field">Full name<input name="name" autocomplete="name" value="${safeText(user?.name || "")}" required minlength="2"></label><label>Email address<input name="email" type="email" autocomplete="email" value="${safeText(user?.email || "")}" required></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required pattern="[0-9+() .-]{7,20}" title="Enter a valid phone number"></label><label class="wide-field">Street address<input name="address" autocomplete="street-address" required></label><label>City<input name="city" autocomplete="address-level2" required></label><label>Country<select name="country" autocomplete="country-name" required><option value="">Choose country</option><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>Other</option></select></label></div></section><section class="checkout-section"><div class="checkout-title"><span>02</span><div><h2>Payment, the demo way.</h2><p>This storefront simulates checkout. No real payment details are needed or collected.</p></div></div><label class="payment-choice"><input type="radio" name="payment" value="demo" checked><span><i class="fa-regular fa-credit-card"></i> Simulated payment</span><small>Demo only · nothing will be charged</small></label></section><p class="demo-note"><i class="fa-solid fa-shield-halved"></i> This is a front-end demonstration. No payment is processed and no card details should be entered.</p><button class="button button-dark full-button place-order">Place demo order <i class="fa-solid fa-arrow-right"></i></button></form><aside class="order-summary checkout-summary"><h2>Your little bundle</h2><div class="checkout-items">${totals.lines.map(line => `<div class="checkout-item"><img src="${line.product.image}" alt=""><span>${safeText(line.product.name)} <small>× ${line.quantity}</small></span><strong>${money(line.product.price * line.quantity)}</strong></div>`).join("")}</div>${summaryMarkup(totals, true)}</aside></div>`;
  document.querySelector("#checkout-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const orders = readStore("luma-orders", []);
    const order = {
      id: `LM-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      email: formData.get("email"),
      items: totals.lines.map(line => ({ id: line.id, name: line.product.name, image: line.product.image, price: line.product.price, quantity: line.quantity })),
      subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total,
      address: `${formData.get("address")}, ${formData.get("city")}, ${formData.get("country")}`,
      status: "Demo order placed"
    };
    orders.unshift(order);
    writeStore("luma-orders", orders);
    if (user && user.email.toLowerCase() === String(formData.get("email")).toLowerCase()) {
      user.name = formData.get("name");
      writeStore("luma-current-user", user);
    }
    setCart([]);
    writeStore("luma-coupon", "");
    updateCartCount();
    host.innerHTML = `<section class="order-success"><div class="success-icon"><i class="fa-solid fa-check"></i></div><span class="eyebrow">ALL WRAPPED UP</span><h2>Your demo order is in.</h2><p>Order <strong>${safeText(order.id)}</strong> has been saved in this browser. No payment was taken.</p><div class="success-total">Order total <strong>${money(order.total)}</strong></div><div class="success-actions"><a class="button button-dark" href="${getCurrentUser() ? "orders.html" : "products.html"}">${getCurrentUser() ? "See your orders" : "Back to the shop"} <i class="fa-solid fa-arrow-right"></i></a><a class="text-link" href="index.html">Back home</a></div></section>`;
  });
}
