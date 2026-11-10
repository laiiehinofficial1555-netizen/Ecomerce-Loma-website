export const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
};

export const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    toast("Could not save your changes. Please check your browser storage settings.", "error");
  }
};

export const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function toast(message, type = "success") {
  let host = document.querySelector(".toast-host");
  if (!host) {
    host = document.createElement("div");
    host.className = "toast-host";
    host.setAttribute("aria-live", "polite");
    document.body.append(host);
  }
  const notice = document.createElement("div");
  notice.className = `toast toast-${type}`;
  notice.textContent = message;
  host.append(notice);
  window.setTimeout(() => notice.remove(), 3400);
}

export const getCart = () => readStore("luma-cart", []);
export const setCart = cart => writeStore("luma-cart", cart);
export const getWishlist = () => readStore("luma-wishlist", []);
export const getCurrentUser = () => readStore("luma-current-user", null);

export function safeText(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

export function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(node => {
    node.textContent = count;
    node.classList.toggle("is-empty", count === 0);
  });
}

export function addToCart(id, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id, quantity });
  setCart(cart);
  updateCartCount();
  toast("Added to your bag.");
}

export function toggleWishlist(id) {
  const list = getWishlist();
  const index = list.indexOf(id);
  if (index >= 0) {
    list.splice(index, 1);
    toast("Removed from your wishlist.");
  } else {
    list.push(id);
    toast("Saved to your wishlist.");
  }
  writeStore("luma-wishlist", list);
  return list.includes(id);
}
