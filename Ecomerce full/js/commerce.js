import { products } from "./data.js";
import { getCart, readStore } from "./utils.js";

export function cartLines() {
  const all = products;
  return getCart().map(item => ({ ...item, product: all.find(product => product.id === item.id) })).filter(item => item.product);
}

export function orderTotals() {
  const lines = cartLines();
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const coupon = readStore("luma-coupon", "");
  const discount = coupon === "LUMA10" ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8.95;
  return { lines, subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping), coupon };
}

export function summaryMarkup(totals, compact = false) {
  return `<div class="summary-row"><span>Subtotal</span><strong>${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totals.subtotal)}</strong></div>
    ${totals.discount ? `<div class="summary-row discount-row"><span>Discount (${totals.coupon})</span><strong>−${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totals.discount)}</strong></div>` : ""}
    <div class="summary-row"><span>Shipping</span><strong>${totals.shipping ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totals.shipping) : "On us"}</strong></div>
    <div class="summary-row summary-total"><span>Total${compact ? " today" : ""}</span><strong>${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totals.total)}</strong></div>
    ${totals.subtotal > 0 && totals.subtotal < 100 ? `<p class="shipping-hint">You’re ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(100 - totals.subtotal)} away from complimentary shipping.</p>` : ""}`;
}
