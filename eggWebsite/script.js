/* =====================================================================
   Sunnyside Coop - behavior
   1 Settings (edit me)  2 Helpers  3 Page setup  4 Hero eggs
   5 Scroll reveal  6 Shop + cart  7 Packing  8 Farm tour
   ===================================================================== */

/* ---------- 1. SETTINGS: change prices and tour text here ---------- */
const SETTINGS = {
  prices: {                       // price in rupees for each carton size
    brown: { 6: 90, 10: 150, 12: 175 },
    white: { 6: 80, 10: 130, 12: 155 },
  },
  sizes: [6, 10, 12],
  tour: [                         // the farm tour popup, one object per stop
    { title: "6:00 am. Morning round", text: "Fresh feed and clean water go out first, before the hens leave the coop for the day." },
    { title: "9:00 am. Out in the runs", text: "The hens spend the day in shaded open runs, with room to scratch, dust-bathe and stretch their wings." },
    { title: "11:00 am. Egg collection", text: "Eggs are collected by hand, checked for cracks and packed the same day." },
  ],
};

/* ---------- 2. HELPERS ---------- */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rupee = (n) => "₹" + n.toLocaleString("en-IN");

const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2600);
}

/* ---------- 3. PAGE SETUP ---------- */

// Draw the torn paper edges (a zig-zag line with small random heights)
$$(".tear").forEach((svg, i) => {
  let seed = (i + 2) * 9973;
  const random = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let path = `M0 40 L0 ${14 + random() * 14}`;
  for (let x = 24; x <= 1200; x += 24) path += ` L${x} ${8 + random() * 24}`;
  svg.setAttribute("viewBox", "0 0 1200 40");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.innerHTML = `<path d="${path} L1200 40 Z"/>`;
});

// Navigation: shadow after scrolling, and the phone menu button
const nav = $("#nav");
const menuBtn = $("#menu-btn");
const navLinks = $("#nav-links");
addEventListener("scroll", () => nav.classList.toggle("is-stuck", scrollY > 12), { passive: true });

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
}
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.addEventListener("click", () => setMenu(false));

$("#year").textContent = new Date().getFullYear();

/* ---------- 4. HERO EGGS: tap to crack, the chick hops out ---------- */
$$(".hero-egg").forEach((egg) => {
  egg.addEventListener("click", () => {
    egg.classList.toggle("is-cracked");
    $(".hero").classList.add("tapped");
  });
});

/* ---------- 5. SCROLL REVEAL: items slide in when you reach them ---------- */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    revealer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach((el) => revealer.observe(el));

/* ---------- 6. SHOP + CART ---------- */
const state = {
  tone: "brown",                  // "brown" or "white"
  cart: new Map(),                // "brown-12" -> quantity
};

// Remember the cart if the page is refreshed
try {
  const saved = JSON.parse(localStorage.getItem("coop-cart") || "[]");
  saved.forEach(([key, qty]) => state.cart.set(key, qty));
} catch (error) { /* storage blocked: the cart just won't be remembered */ }

function saveCart() {
  try { localStorage.setItem("coop-cart", JSON.stringify([...state.cart])); } catch (error) {}
}

// A drawing of an egg carton with `count` eggs
function cartonSVG(tone, count) {
  const cols = count / 2;
  const width = cols * 52 + 24;
  const gradient = tone === "brown" ? "gBrown" : "gWhite";
  let svg = `<svg viewBox="0 0 ${width} 128" role="img" aria-label="Carton of ${count} ${tone} eggs">`;
  svg += `<rect x="2" y="2" width="${width - 4}" height="124" rx="16" fill="#D6AE78" stroke="#8A6236" stroke-opacity=".5" stroke-width="2"/>`;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 38 + col * 52, y = 38 + row * 52;
      svg += `<ellipse cx="${x}" cy="${y}" rx="24" ry="24" class="cup"/>`;
      svg += `<ellipse cx="${x}" cy="${y}" rx="17" ry="21" fill="url(#${gradient})"/>`;
      svg += `<ellipse cx="${x - 6}" cy="${y - 8}" rx="3.5" ry="7" fill="#fff" opacity="${tone === "brown" ? .3 : .8}" transform="rotate(18 ${x - 6} ${y - 8})"/>`;
    }
  }
  return svg + "</svg>";
}

// Draw the three carton cards
const packGrid = $("#pack-grid");
function renderPacks(animate) {
  const prices = SETTINGS.prices[state.tone];
  const cheapest = SETTINGS.sizes.reduce((a, b) => (prices[a] / a < prices[b] / b ? a : b));
  packGrid.innerHTML = SETTINGS.sizes.map((size) => `
    <article class="pack">
      ${size === cheapest ? '<span class="pack-tag">Lowest price per egg</span>' : ""}
      <div class="pack-art">${cartonSVG(state.tone, size)}</div>
      <h3>${size} ${state.tone} eggs</h3>
      <p class="per">₹${Math.round(prices[size] / size * 10) / 10} per egg</p>
      <p class="price">${rupee(prices[size])}</p>
      <button class="btn" type="button" data-add="${state.tone}-${size}">Add to cart</button>
    </article>`).join("");
  if (animate && !reduceMotion) {
    packGrid.classList.remove("is-swapping");
    void packGrid.offsetWidth;                 // restart the animation
    packGrid.classList.add("is-swapping");
  }
}

function setTone(tone, animate = true) {
  state.tone = tone;
  document.body.dataset.tone = tone;           // CSS uses this to swap packing eggs
  $(`input[name="tone"][value="${tone}"]`).checked = true;
  renderPacks(animate);
}
$$('input[name="tone"]').forEach((radio) => radio.addEventListener("change", () => setTone(radio.value)));
$$("[data-pick]").forEach((link) => link.addEventListener("click", () => setTone(link.dataset.pick)));

// Cart drawer
const cart = $("#cart");
const scrim = $("#scrim");
const cartBtn = $("#cart-open");
const cartCount = $("#cart-count");
let focusBeforeCart = null;

function renderCart() {
  let count = 0, total = 0;
  $("#cart-list").innerHTML = "";
  state.cart.forEach((qty, key) => {
    const [tone, size] = key.split("-");
    const line = SETTINGS.prices[tone][size] * qty;
    count += qty;
    total += line;
    const item = document.createElement("li");
    item.className = "cart-item";
    item.innerHTML = `
      <strong>${size} ${tone} eggs</strong><span>${rupee(line)}</span>
      <div class="qty">
        <button type="button" data-less="${key}" aria-label="Remove one carton of ${size} ${tone} eggs">&minus;</button>
        <span>${qty}</span>
        <button type="button" data-more="${key}" aria-label="Add one carton of ${size} ${tone} eggs">+</button>
      </div>`;
    $("#cart-list").appendChild(item);
  });
  cartCount.textContent = count;
  $("#cart-total").textContent = rupee(total);
  $("#cart-empty").hidden = count > 0;
  $("#checkout").disabled = count === 0;
  saveCart();
}

function openCart() {
  focusBeforeCart = document.activeElement;
  cart.classList.add("is-open");
  cart.removeAttribute("inert");
  cart.setAttribute("aria-hidden", "false");
  scrim.hidden = false;
  $("#cart-close").focus();
}
function closeCart() {
  cart.classList.remove("is-open");
  cart.setAttribute("inert", "");
  cart.setAttribute("aria-hidden", "true");
  scrim.hidden = true;
  if (focusBeforeCart) focusBeforeCart.focus();
}

// A little egg flies from the button into the cart icon
function flyEggToCart(fromButton, tone) {
  if (reduceMotion) return;
  const from = fromButton.getBoundingClientRect();
  const to = cartBtn.getBoundingClientRect();
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - from.top;
  const egg = document.createElement("div");
  egg.className = "fly-egg";
  egg.style.background = tone === "brown" ? "#B5703A" : "#F4EEDF";
  egg.style.left = from.left + from.width / 2 - 12 + "px";
  egg.style.top = from.top + "px";
  document.body.appendChild(egg);
  egg.animate([
    { transform: "translate(0,0) scale(1)" },
    { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 110}px) scale(1.2) rotate(120deg)`, offset: 0.45 },
    { transform: `translate(${dx}px, ${dy}px) scale(.3) rotate(300deg)`, opacity: 0.5 },
  ], { duration: 850, easing: "cubic-bezier(.4,0,.6,1)" }).onfinish = () => egg.remove();
}

packGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const key = button.dataset.add;
  const [tone, size] = key.split("-");
  state.cart.set(key, (state.cart.get(key) || 0) + 1);
  flyEggToCart(button, tone);
  setTimeout(() => {                           // bounce the cart count when the egg lands
    renderCart();
    cartCount.classList.remove("pop");
    void cartCount.offsetWidth;
    cartCount.classList.add("pop");
  }, reduceMotion ? 0 : 700);
  showToast(`Added: ${size} ${tone} eggs`);
});

$("#cart-list").addEventListener("click", (event) => {
  const more = event.target.closest("[data-more]");
  const less = event.target.closest("[data-less]");
  if (more) state.cart.set(more.dataset.more, state.cart.get(more.dataset.more) + 1);
  if (less) {
    const qty = state.cart.get(less.dataset.less) - 1;
    if (qty > 0) state.cart.set(less.dataset.less, qty);
    else state.cart.delete(less.dataset.less);
  }
  if (more || less) renderCart();
});

cartBtn.addEventListener("click", openCart);
$("#cart-close").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
addEventListener("keydown", (e) => { if (e.key === "Escape" && cart.classList.contains("is-open")) closeCart(); });
$("#checkout").addEventListener("click", () => showToast("Demo only. Connect a payment provider to take real orders."));

/* ---------- 7. PACKING: the tray fills as you scroll the steps ---------- */
// Build 10 cups and 10 eggs (brown and white sets) inside the tray drawing
let cups = "", brownEggs = "", whiteEggs = "";
for (let i = 0; i < 10; i++) {
  const x = 62 + (i % 5) * 84, y = 100 + Math.floor(i / 5) * 100;
  const firstShownAt = i < 2 ? 1 : 2;          // 2 eggs at step 1, all 10 at step 2
  const egg = (gradient, shine) => `
    <g class="e" data-from="${firstShownAt}" style="--i:${i}">
      <ellipse cx="${x}" cy="${y}" rx="27" ry="34" fill="url(#${gradient})"/>
      <ellipse cx="${x - 9}" cy="${y - 12}" rx="5" ry="10" fill="#fff" opacity="${shine}" transform="rotate(18 ${x - 9} ${y - 12})"/>
    </g>`;
  cups += `<ellipse cx="${x}" cy="${y}" rx="37" ry="41" class="cup"/>`;
  brownEggs += egg("gBrown", .3);
  whiteEggs += egg("gWhite", .8);
}
$("#tray-cups").innerHTML = cups;
$("#eggs-brown").innerHTML = brownEggs;
$("#eggs-white").innerHTML = whiteEggs;

const packFigure = $("#pack-fig");
const steps = $$(".step");
const stepWatcher = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    packFigure.dataset.step = entry.target.dataset.step;   // CSS shows the right stage
    steps.forEach((step) => step.classList.toggle("is-active", step === entry.target));
  });
}, { rootMargin: "-40% 0px -40% 0px" });
steps.forEach((step) => stepWatcher.observe(step));

$("#sticker-date").textContent = "Packed " + new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/* ---------- 8. FARM TOUR POPUP ---------- */
const tour = $("#tour");
let stop = 0;
function showStop() {
  const last = SETTINGS.tour.length - 1;
  $("#tour-step").textContent = `Stop ${stop + 1} of ${SETTINGS.tour.length}`;
  $("#tour-title").textContent = SETTINGS.tour[stop].title;
  $("#tour-text").textContent = SETTINGS.tour[stop].text;
  $("#tour-prev").style.visibility = stop === 0 ? "hidden" : "visible";
  $("#tour-next").textContent = stop === last ? "Finish" : "Next stop";
}
$("#tour-open").addEventListener("click", () => { stop = 0; showStop(); tour.showModal(); });
$("#tour-next").addEventListener("click", () => {
  if (stop === SETTINGS.tour.length - 1) return tour.close();
  stop++; showStop();
});
$("#tour-prev").addEventListener("click", () => { stop--; showStop(); });
$("#tour-close").addEventListener("click", () => tour.close());
tour.addEventListener("click", (e) => { if (e.target === tour) tour.close(); });

/* ---------- START ---------- */
setTone("brown", false);
renderCart();
