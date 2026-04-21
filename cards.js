const BASE = "https://ttb-x042.onrender.com";
const token = localStorage.getItem("token");

let cards = [];
let virtualAccounts = [];
let balanceVisible = {};

/* ───────── AUTH GUARD ───────── */
if (!token) {
  window.location.href = "login.html";
}

/* ───────── INIT ───────── */
document.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadUserStatus();
  await loadCards();
  await loadVirtualAccounts();
  setAvatar();
}

/* ───────── USER STATUS (KYC CHECK) ───────── */
async function loadUserStatus() {
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return;

  const data = await res.json();
  const user = data.user;

  const status = user.kycStatus || "none";

  const dot = document.getElementById("kycDot");
  const label = document.getElementById("kycLabel");

  if (status === "approved") {
    dot.className = "kyc-dot verified";
    label.textContent = "KYC Verified";
  } else if (status === "pending") {
    dot.className = "kyc-dot pending";
    label.textContent = "KYC Pending";
  } else {
    dot.className = "kyc-dot";
    label.textContent = "KYC Not Verified";
  }

  // BLOCK FEATURES IF NOT APPROVED
  if (status !== "approved") {
    document.getElementById("createCardBtn").disabled = true;
    document.getElementById("vaCreateForm").style.opacity = "0.4";
  }
}

/* ───────── CARDS ───────── */
async function loadCards() {
  const res = await fetch(`${BASE}/api/cards`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  cards = data.cards || [];

  renderCards();
}

function renderCards() {
  const stage = document.getElementById("cardStage");
  const empty = document.getElementById("cardEmpty");

  stage.querySelectorAll(".bank-card").forEach(c => c.remove());

  if (!cards.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "bank-card";

    const visible = balanceVisible[i];

    el.innerHTML = `
      <h3>**** **** **** ${card.cardNumber?.slice(-4) || "0000"}</h3>

      <div>
        ${visible ? `₵${card.balance}` : "₵••••••"}
        <button onclick="toggleBalance(${i})">👁</button>
      </div>
    `;

    stage.appendChild(el);
  });
}

function toggleBalance(i) {
  balanceVisible[i] = !balanceVisible[i];
  renderCards();
}

/* ───────── VIRTUAL ACCOUNTS ───────── */
async function loadVirtualAccounts() {
  const res = await fetch(`${BASE}/api/virtual-accounts`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  virtualAccounts = data.accounts || [];

  renderVA();
}

function renderVA() {
  const grid = document.getElementById("vaGrid");
  const empty = document.getElementById("vaEmpty");

  grid.querySelectorAll(".va-tile").forEach(e => e.remove());

  if (!virtualAccounts.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  virtualAccounts.forEach(va => {
    const el = document.createElement("div");
    el.className = "va-tile";

    el.innerHTML = `
      <h4>${va.name}</h4>
      <p>₵${va.balance}</p>
    `;

    grid.appendChild(el);
  });
}

/* ───────── ACCOUNT FUNCTIONS (PLACEHOLDERS) ───────── */
async function createCard() {
  const res = await fetch(`${BASE}/api/cards/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  await loadCards();
}

async function createVirtualAccount() {
  const name = document.getElementById("vaName").value;

  await fetch(`${BASE}/api/virtual-accounts/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });

  await loadVirtualAccounts();
}

/* ───────── UI ───────── */
function switchTab(name, btn) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  document.querySelector(`#panel-${name}`).classList.remove("hidden");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
}

function setAvatar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const el = document.getElementById("navAvatar");

  if (user.name) {
    el.textContent = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  }
}

/* expose */
window.switchTab = switchTab;
window.toggleBalance = toggleBalance;
window.createCard = createCard;
window.createVirtualAccount = createVirtualAccount;