import { money, readStore, safeText } from "./utils.js";

const user = readStore("luma-current-user", null);
const host = document.querySelector("#orders-content");
if (!user) location.replace("login.html?return=orders.html");
else {
  const orders = readStore("luma-orders", []).filter(order => order.email.toLowerCase() === user.email.toLowerCase());
  host.innerHTML = orders.length ? `<div class="orders-list">${orders.map(order => `<article class="order-card"><div class="order-card-head"><div><span class="eyebrow">ORDER ${safeText(order.id)}</span><p>${new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div><span class="order-status"><i class="fa-solid fa-circle-check"></i> ${safeText(order.status)}</span></div><div class="order-card-items">${order.items.map(item => `<div><img src="${item.image}" alt=""><span>${safeText(item.name)} <small>× ${item.quantity}</small></span><strong>${money(item.price * item.quantity)}</strong></div>`).join("")}</div><div class="order-card-total"><span>Demo order total</span><strong>${money(order.total)}</strong></div><p class="demo-note">Demo order only. No payment was taken and nothing will be shipped.</p></article>`).join("")}</div>` : `<section class="empty-state orders-empty"><i class="fa-solid fa-box-open"></i><h2>No orders just yet.</h2><p>Your next favorite is waiting to be found.</p><a class="button button-dark" href="products.html">Explore the shop <i class="fa-solid fa-arrow-right"></i></a></section>`;
}
