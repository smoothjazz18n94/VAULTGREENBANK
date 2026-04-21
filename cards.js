/* ═══════════════════════════════════════
   VAULTGREEN — cards.js (FRONTEND CLEAN)
   Stable Production Version
══════════════════════════════════════ */

const BASE = "https://ttb-x042.onrender.com";
const token = localStorage.getItem("token");

/* ─────────────────────────────
   STATE
───────────────────────────── */
let cards = [];
let virtualAccounts = [];
let balanceVisible = {};

/* ─────────────────────────────
   AUTH GUARD
───────────────────────────── */
if (!token) {
  window.location.href = "login.html";
}

/* ─────────────────────────────
   INIT
───────────────────────────── */
document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    await loadCards();
    await loadVirtualAccounts();
    setAvatar();
  } catch (err) {
    console.error("INIT ERROR:", err);
    showToast("Failed to load dashboard data");
  }
}

/* ─────────────────────────────
   TAB SWITCH
───────────────────────────── */
function switchTab(name, btn) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  const panel = document.getElementById(`panel-${name}`);
  if (panel) panel.classList.remove("hidden");

  if (btn) btn.classList.add("active");
}

window.switchTab = switchTab;

/* ─────────────────────────────
   CARDS
───────────────────────────── */
async function loadCards() {
  try {
    const res = await fetch(`${BASE}/api/cards`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load cards");

    const data = await res.json();
    cards = data.cards || [];

    renderCards();

  } catch (err) {
    console.error("CARDS ERROR:", err);
    showToast("Could not load cards");
  }
}

function renderCards() {
  const stage = document.getElementById("cardStage");
  const empty = document.getElementById("cardEmpty");

  if (!stage) return;

  stage.querySelectorAll(".bank-card").forEach(el => el.remove());

  if (!cards.length) {
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "bank-card";

    const last4 = card.cardNumber?.slice(-4) || "0000";
    const visible = balanceVisible[i] || false;

    el.innerHTML = `
      <div class="card-top">
        <h3>**** **** **** ${last4}</h3>
      </div>

      <div class="card-balance">
        ${visible ? `₵ ${card.balance.toFixed(2)}` : "₵ ••••••"}
        <button onclick="toggleBalance(${i})">
          ${visible ? "🙈" : "👁"}
        </button>
      </div>

      <div class="card-status">
        ${card.isActive ? "Active" : "Frozen"}
      </div>
    `;

    stage.appendChild(el);
  });
}

function toggleBalance(i) {
  balanceVisible[i] = !balanceVisible[i];
  renderCards();
}

window.toggleBalance = toggleBalance;

/* ─────────────────────────────
   CREATE CARD
───────────────────────────── */
async function createCard() {
  try {
    const res = await fetch(`${BASE}/api/cards/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Card creation failed");

    const data = await res.json();

    showToast("Card created successfully");
    await loadCards();

  } catch (err) {
    console.error(err);
    showToast("Failed to create card");
  }
}

window.createCard = createCard;

/* ─────────────────────────────
   TOGGLE CARD STATUS
───────────────────────────── */
async function toggleCard(cardId) {
  try {
    const res = await fetch(`${BASE}/api/cards/${cardId}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Toggle failed");

    await loadCards();
    showToast("Card updated");

  } catch (err) {
    console.error(err);
    showToast("Failed to update card");
  }
}

window.toggleCard = toggleCard;

/* ─────────────────────────────
   VIRTUAL ACCOUNTS
───────────────────────────── */
async function loadVirtualAccounts() {
  try {
    const res = await fetch(`${BASE}/api/virtual-accounts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load accounts");

    const data = await res.json();
    virtualAccounts = data.accounts || [];

    renderVA();

  } catch (err) {
    console.error("VA ERROR:", err);
  }
}

function renderVA() {
  const grid = document.getElementById("vaGrid");
  const empty = document.getElementById("vaEmpty");

  if (!grid) return;

  grid.querySelectorAll(".va-tile").forEach(el => el.remove());

  if (!virtualAccounts.length) {
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  virtualAccounts.forEach(va => {
    const el = document.createElement("div");
    el.className = "va-tile";

    el.innerHTML = `
      <h4>${va.name}</h4>
      <p>₵ ${va.balance.toFixed(2)}</p>
    `;

    grid.appendChild(el);
  });
}

/* ─────────────────────────────
   AVATAR
───────────────────────────── */
function setAvatar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const el = document.getElementById("navAvatar");

  if (user.name && el) {
    el.textContent = user.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}

/* ─────────────────────────────
   TOAST
───────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}