import { getCurrentUser, updateCartCount, toast, writeStore } from "./utils.js";

const page = location.pathname.split("/").pop() || "index.html";
const loggedIn = Boolean(getCurrentUser());

if (["profile.html", "orders.html"].includes(page) && !loggedIn) {
  location.replace(`login.html?return=${encodeURIComponent(page)}`);
} else {
  renderShell();
  updateCartCount();
  document.addEventListener("click", event => {
    const toggle = event.target.closest("[data-menu-toggle]");
    if (toggle) {
      const nav = document.querySelector(".nav-links");
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    }
    const logout = event.target.closest("[data-logout]");
    if (logout) {
      writeStore("luma-current-user", null);
      toast("You have been signed out.");
      window.setTimeout(() => location.href = "index.html", 500);
    }
    const newsletter = event.target.closest("[data-newsletter]");
    if (newsletter) {
      event.preventDefault();
      const email = newsletter.querySelector('input[type="email"]');
      if (!email.reportValidity()) return;
      toast("Thanks for subscribing. Look out for a little something in your inbox!");
      newsletter.reset();
    }
  });
  const modules = {
    "index.html": "./home.js",
    "products.html": "./products.js",
    "product-detail.html": "./detail.js",
    "cart.html": "./cart.js",
    "checkout.html": "./checkout.js",
    "login.html": "./auth.js",
    "register.html": "./auth.js",
    "profile.html": "./profile.js",
    "orders.html": "./orders.js"
  };
  if (modules[page]) import(modules[page]).catch(error => {
    console.error(`Unable to load page module for ${page}.`, error);
    toast("This page could not be loaded. Please refresh and try again.", "error");
  });
}

function renderShell() {
  const active = page === "products.html" || page === "product-detail.html" ? "products.html" : page;
  const header = document.querySelector("#site-header");
  const footer = document.querySelector("#site-footer");
  if (header) header.innerHTML = `
    <div class="announcement">A little more joy in every delivery <span>— free shipping on orders over $100</span></div>
    <div class="nav-wrap"><a class="brand" href="index.html" aria-label="Luma home"><span class="brand-mark">l</span> luma<span class="brand-period">.</span></a>
      <button class="menu-toggle" data-menu-toggle aria-label="Open navigation" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      <nav class="nav-links" aria-label="Main navigation">
        <a class="${active === "index.html" ? "active" : ""}" href="index.html">Home</a><a class="${active === "products.html" ? "active" : ""}" href="products.html">Shop</a><a href="about.html">Our story</a><a href="contact.html">Contact</a>
      </nav><div class="nav-actions"><a class="icon-link search-link" href="products.html" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></a><a class="icon-link" href="${getCurrentUser() ? "profile.html" : "login.html"}" aria-label="Account"><i class="fa-regular fa-user"></i></a><a class="icon-link bag-link" href="cart.html" aria-label="Shopping bag"><i class="fa-solid fa-bag-shopping"></i><span data-cart-count class="cart-count is-empty">0</span></a></div>
    </div>`;
  if (footer) footer.innerHTML = `
    <div class="footer-main"><div class="footer-brand"><a class="brand brand-light" href="index.html"><span class="brand-mark">l</span> luma<span class="brand-period">.</span></a><p>Good things, thoughtfully found.<br>For you, and the everyday.</p><div class="social-links"><a href="https://instagram.com" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><a href="https://pinterest.com" aria-label="Pinterest"><i class="fa-brands fa-pinterest-p"></i></a><a href="https://facebook.com" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a></div></div>
    <div><h3>Explore</h3><a href="products.html">Shop all</a><a href="products.html?category=Home">Home & living</a><a href="products.html?category=Accessories">Accessories</a><a href="about.html">Our story</a></div><div><h3>Here to help</h3><a href="contact.html">Contact us</a><a href="orders.html">Track an order</a><a href="profile.html">My account</a><a href="about.html#faq">FAQs</a></div>
    <div class="footer-news"><h3>A good note, now and then.</h3><p>New finds, thoughtful stories, and 10% off your first order.</p><form data-newsletter><label class="sr-only" for="footer-email">Email address</label><input id="footer-email" type="email" placeholder="Your email address" required><button aria-label="Subscribe"><i class="fa-solid fa-arrow-right"></i></button></form></div></div>
    <div class="footer-bottom"><span>© 2026 Luma Goods. Made for everyday living.</span><span>Secure checkout &nbsp;·&nbsp; Thoughtful by design</span></div>`;
}
