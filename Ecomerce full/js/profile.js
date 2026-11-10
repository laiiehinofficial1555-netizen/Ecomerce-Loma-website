import { products } from "./data.js";
import { productCard } from "./components.js";
import { getCurrentUser, getWishlist, readStore, safeText, toast, writeStore } from "./utils.js";

const user = getCurrentUser();
const host = document.querySelector("#profile-content");
if (!user) location.replace("login.html?return=profile.html");
else {
  document.querySelector("#profile-greeting").textContent = `${user.name.split(/\s+/)[0]}.`;
  host.innerHTML = `<div class="account-layout"><aside class="account-nav"><div class="account-avatar">${safeText(user.name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase())}</div><strong>${safeText(user.name)}</strong><span>${safeText(user.email)}</span><a class="selected" href="profile.html"><i class="fa-regular fa-user"></i> Account details</a><a href="orders.html"><i class="fa-solid fa-box"></i> Order history</a><a href="#wishlist"><i class="fa-regular fa-heart"></i> Wishlist</a><button data-logout><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign out</button></aside><div class="account-panels"><section class="account-panel"><div class="panel-heading"><div><span class="eyebrow">THE BASICS</span><h2>Your details</h2></div></div><form id="profile-form" class="profile-form"><label>Full name<input name="name" value="${safeText(user.name)}" required minlength="2"></label><label>Email address<input name="email" type="email" value="${safeText(user.email)}" required></label><button class="button button-dark">Save changes</button></form></section><section class="account-panel"><div class="panel-heading"><div><span class="eyebrow">JUST BETWEEN US</span><h2>Change password</h2></div></div><form id="password-form" class="profile-form"><label>Current password<input name="current" type="password" required></label><label>New password<input name="next" type="password" minlength="8" required></label><button class="button button-outline">Update password</button><p class="demo-note">Demo only: passwords are stored in browser localStorage and are not secure.</p></form></section><section class="account-panel wishlist-panel" id="wishlist"><div class="panel-heading"><div><span class="eyebrow">SAVED FOR A SUNNY DAY</span><h2>Your wishlist</h2></div></div><div id="wishlist-products" class="product-grid"></div></section></div></div>`;
  document.querySelector("#profile-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const updated = { ...user, name: form.elements.name.value.trim(), email: form.elements.email.value.trim().toLowerCase() };
    const users = readStore("luma-users", []);
    if (users.some(account => account.email.toLowerCase() === updated.email && account.email.toLowerCase() !== user.email.toLowerCase())) {
      toast("That email is already connected to another account.", "error"); return;
    }
    writeStore("luma-users", users.map(account => account.email.toLowerCase() === user.email.toLowerCase() ? updated : account));
    writeStore("luma-current-user", updated);
    toast("Your details are up to date.");
    location.reload();
  });
  document.querySelector("#password-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (form.elements.current.value !== user.password) { toast("That current password doesn’t match.", "error"); return; }
    const updated = { ...user, password: form.elements.next.value };
    const users = readStore("luma-users", []);
    writeStore("luma-users", users.map(account => account.email.toLowerCase() === user.email.toLowerCase() ? updated : account));
    writeStore("luma-current-user", updated);
    form.reset(); toast("Your demo password has been updated.");
  });
  const savedProducts = products.filter(product => getWishlist().includes(product.id));
  document.querySelector("#wishlist-products").innerHTML = savedProducts.map(productCard).join("") || `<div class="empty-state"><p>No saved finds yet. Tap the heart on anything you love.</p><a class="text-link" href="products.html">Explore the shop <i class="fa-solid fa-arrow-right"></i></a></div>`;
}
