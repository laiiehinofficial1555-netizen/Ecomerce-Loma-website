import { getCurrentUser, readStore, toast, writeStore } from "./utils.js";

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
document.querySelectorAll(".password-toggle").forEach(button => button.addEventListener("click", () => {
  const input = button.parentElement.querySelector("input");
  input.type = input.type === "password" ? "text" : "password";
  button.innerHTML = `<i class="fa-regular ${input.type === "text" ? "fa-eye-slash" : "fa-eye"}"></i>`;
  button.setAttribute("aria-label", input.type === "text" ? "Hide password" : "Show password");
}));

if (registerForm) registerForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!registerForm.reportValidity()) return;
  const form = new FormData(registerForm);
  const email = String(form.get("email")).trim().toLowerCase();
  const users = readStore("luma-users", []);
  if (users.some(user => user.email.toLowerCase() === email)) { toast("An account with that email already exists. Try signing in.", "error"); return; }
  const user = { name: String(form.get("name")).trim(), email, password: String(form.get("password")) };
  users.push(user);
  writeStore("luma-users", users);
  writeStore("luma-current-user", user);
  toast("You’re all set. Welcome to Luma!");
  window.setTimeout(() => location.href = "profile.html", 350);
});

if (loginForm) loginForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const form = new FormData(loginForm);
  const email = String(form.get("email")).trim().toLowerCase();
  const user = readStore("luma-users", []).find(account => account.email.toLowerCase() === email && account.password === form.get("password"));
  if (!user) { toast("Those details don’t match an account. Please try again.", "error"); return; }
  writeStore("luma-current-user", user);
  const returnTo = new URLSearchParams(location.search).get("return");
  const destination = ["profile.html", "orders.html"].includes(returnTo) ? returnTo : "profile.html";
  toast("Welcome back.");
  window.setTimeout(() => location.href = destination, 350);
});
