/* ═══════════════════════════════════════
   VAULTGREEN — cards.js (FRONTEND)
   FIXED + FULL PRODUCTION VERSION
══════════════════════════════════════ */

const BASE = "https://ttb-x042.onrender.com";
const token = localStorage.getItem("token");

/* ─────────────────────────────
   STATE
───────────────────────────── */
let cards = [];
let virtualAccounts = [];
let activeCardIdx = 0;
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
    await loadKycStatus();
    await loadCards();
    await loadVirtualAccounts();
    setAvatar();
  } catch (err) {
    console.error("INIT ERROR:", err);
  }
}

/* ─────────────────────────────
   TAB SWITCH (FIX FOR YOUR ERROR)
───────────────────────────── */
function switchTab(name, btn) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  const panel = document.getElementById(`panel-${name}`);
  if (panel) panel.classList.remove("hidden");

  if (btn) btn.classList.add("active");
}

/* ─────────────────────────────
   KYC
───────────────────────────── */
async function loadKycStatus() {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return;

    const data = await res.json();
    const user = data.user;

    const status = user.kycStatus || "none";

    const dot = document.getElementById("kycDot");
    const label = document.getElementById("kycLabel");

    if (!dot || !label) return;

    if (status === "approved") {
      dot.className = "kyc-dot verified";
      label.textContent = "KYC Verified";
    } else if (status === "pending") {
      dot.className = "kyc-dot pending";
      label.textContent = "KYC Pending";
    } else {
      dot.className = "kyc-dot";
      label.textContent = "KYC Not Started";
    }

  } catch (err) {
    console.error("KYC ERROR:", err);
  }
}

/* ─────────────────────────────
   CARDS
───────────────────────────── */
async function loadCards() {
  try {
    const res = await fetch(`${BASE}/api/cards`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return;

    const data = await res.json();
    cards = data.cards || [];

    renderCards();
  } catch (err) {
    console.error("CARDS ERROR:", err);
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

    const visible = balanceVisible[i] || false;

    el.innerHTML = `
      <div class="card-top">
        <h3>**** **** **** ${card.last4 || "0000"}</h3>
      </div>

      <div class="card-balance">
        ${visible ? `₵ ${card.balance.toFixed(2)}` : "₵ ••••••"}
        <button onclick="toggleBalance(${i})">
          ${visible ? "🙈" : "👁"}
        </button>
      </div>
    `;

    stage.appendChild(el);
  });
}

function toggleBalance(i) {
  balanceVisible[i] = !balanceVisible[i];
  renderCards();
}

/* ─────────────────────────────
   VIRTUAL ACCOUNTS
───────────────────────────── */
async function loadVirtualAccounts() {
  try {
    const res = await fetch(`${BASE}/api/virtual-accounts`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return;

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
   USER AVATAR
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
   GLOBAL FUNCTIONS (HTML CALLS)
───────────────────────────── */
window.switchTab = switchTab;
window.toggleBalance = toggleBalance;