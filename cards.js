const BASE = "https://ttb-x042.onrender.com";
const token = localStorage.getItem("token");

/* ───────── STATE ───────── */
let cards = [];
let virtualAccounts = [];
let balanceVisible = {};
let activeCardIdx = 0; // ✅ FIX: missing variable

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

/* ───────── USER STATUS (KYC) ───────── */
async function loadUserStatus() {
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return;

  const { user } = await res.json();

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
    label.textContent = "KYC Not Verified";
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

    const last4 = card.cardNumber?.slice(-4) || "0000";
    const visible = balanceVisible[i];

    el.innerHTML = `
      <div class="card-header">
        <div class="bank-name">VAULTGREEN BANK</div>
        <div class="card-chip">◉◉</div>
      </div>

      <div class="card-number">
        **** **** **** ${last4}
      </div>

      <div class="card-bottom">
        <div>
          <small>Balance</small>
          <div class="balance">
            ${visible ? `₵ ${card.balance.toFixed(2)}` : "₵ ••••••"}
          </div>
        </div>

        <button class="eye-btn" onclick="toggleBalance(${i})">
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

/* ───────── CREATE CARD ───────── */
async function createCard() {
  const res = await fetch(`${BASE}/api/cards/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert("KYC required or failed to create card.");
    return;
  }

  await loadCards();
}

/* ───────── CVV REVEAL ───────── */
function revealCvv() {
  if (!cards.length) return alert("No card available");

  const card = cards[activeCardIdx] || cards[0];

  const modal = document.getElementById("cvvModal");
  const display = document.getElementById("cvvDisplay");

  display.textContent = card.cvv || "•••";
  modal.style.display = "flex";

  setTimeout(() => {
    modal.style.display = "none";
  }, 10000);
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
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
      <p>₵ ${va.balance.toFixed(2)}</p>
    `;

    grid.appendChild(el);
  });
}

/* ───────── CREATE VA ───────── */
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

/* ───────── TAB SWITCH ───────── */
function switchTab(name, btn) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(`panel-${name}`).classList.remove("hidden");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
}

/* ───────── AVATAR ───────── */
function setAvatar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const el = document.getElementById("navAvatar");

  if (user.name && el) {
    el.textContent = user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
}

/* ───────── GLOBAL EXPORTS ───────── */
window.switchTab = switchTab;
window.toggleBalance = toggleBalance;
window.createCard = createCard;
window.createVirtualAccount = createVirtualAccount;
window.revealCvv = revealCvv;
window.closeModal = closeModal;