/* ═══════════════════════════════════════════════
   VAULTGREEN BANK — register.js
   Multi-step registration, validation, API submit
═══════════════════════════════════════════════ */

const BASE_URL = "https://ttb-x042.onrender.com";

/* ─── REDIRECT IF ALREADY LOGGED IN ─── */
(function () {
  if (localStorage.getItem("token")) window.location.href = "dashboard.html";
})();

/* ─── STATE ─── */
let currentStep = 1;
let selectedAccountType = "Classic Current Account";

/* ─── ACCOUNT TYPE SELECTION ─── */
document.querySelectorAll(".account-option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document.querySelectorAll(".account-option").forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    opt.querySelector("input").checked = true;
    selectedAccountType = opt.dataset.val;
  });
});

/* ─── STEP NAVIGATION ─── */
function goStep(n) {
  // Hide all
  document.querySelectorAll(".step-content").forEach(el => el.classList.add("hidden"));

  // Update indicators
  document.querySelectorAll(".step").forEach((el, i) => {
    el.classList.remove("active", "done");
    if (i + 1 < n)  el.classList.add("done");
    if (i + 1 === n) el.classList.add("active");
  });

  // Show target
  const target = document.getElementById(`step${n}`) || document.getElementById("stepSuccess");
  if (target) target.classList.remove("hidden");

  currentStep = n;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─── STEP 2 VALIDATION ─── */
function validateStep2() {
  let ok = true;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const email     = document.getElementById("regEmail").value.trim();
  const dob       = document.getElementById("dob").value;

  if (!firstName) { setErr("firstErr", "First name is required"); ok = false; } else clearErr("firstErr");
  if (!lastName)  { setErr("lastErr",  "Last name is required");  ok = false; } else clearErr("lastErr");

  if (!email || !isEmail(email)) {
    setErr("emailErr", "Please enter a valid email address"); ok = false;
  } else clearErr("emailErr");

  if (!dob) {
    setErr("dobErr", "Date of birth is required"); ok = false;
  } else {
    const age = Math.floor((Date.now() - new Date(dob)) / 31557600000);
    if (age < 16) { setErr("dobErr", "You must be at least 16 years old"); ok = false; }
    else clearErr("dobErr");
  }

  if (ok) goStep(3);
}

/* ─── PASSWORD STRENGTH ─── */
function checkStrength() {
  const pw    = document.getElementById("regPassword").value;
  const fill  = document.getElementById("strengthFill");
  const label = document.getElementById("strengthLabel");

  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const levels = [
    { pct: "0%",   bg: "transparent", text: "Enter a password" },
    { pct: "20%",  bg: "#f43f5e",     text: "Very weak" },
    { pct: "40%",  bg: "#f97316",     text: "Weak" },
    { pct: "60%",  bg: "#eab308",     text: "Fair" },
    { pct: "80%",  bg: "#84cc16",     text: "Good" },
    { pct: "100%", bg: "#10b981",     text: "Strong 💪" },
  ];

  const lvl = pw.length === 0 ? 0 : Math.min(score, 5);
  fill.style.width      = levels[lvl].pct;
  fill.style.background = levels[lvl].bg;
  label.textContent     = levels[lvl].text;
  label.style.color     = pw.length > 0 ? levels[lvl].bg : "var(--text3)";
}

function toggleRegPw() {
  const inp = document.getElementById("regPassword");
  const btn = inp.nextElementSibling;
  const show = inp.type === "password";
  inp.type = show ? "text" : "password";
  btn.textContent = show ? "🙈" : "👁";
}

/* ─── LOADING STATE ─── */
function setLoading(loading) {
  const btn  = document.getElementById("regSubmitBtn");
  const text = document.getElementById("regBtnText");
  btn.disabled = loading;
  text.innerHTML = loading
    ? '<span class="spinner"></span>Creating your account…'
    : "Open My Account";
}

/* ─── MAIN REGISTER ─── */
async function doRegister() {
  const regError  = document.getElementById("regError");
  const regErrMsg = document.getElementById("regErrorMsg");
  regError.hidden = true;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const email     = document.getElementById("regEmail").value.trim();
  const phone     = document.getElementById("regPhone").value.trim();
  const dob       = document.getElementById("dob").value;
  const country   = document.getElementById("country").value;
  const employment= document.getElementById("employment").value;
  const name      = document.getElementById("displayName").value.trim() || `${firstName} ${lastName}`;
  const password  = document.getElementById("regPassword").value;
  const confirm   = document.getElementById("regPasswordConfirm").value;
  const terms     = document.getElementById("termsConsent").checked;

  // Validate
  let ok = true;
  if (!password || password.length < 8) {
    setErr("pwErr", "Password must be at least 8 characters"); ok = false;
  } else clearErr("pwErr");

  if (password !== confirm) {
    setErr("pwConfirmErr", "Passwords do not match"); ok = false;
  } else clearErr("pwConfirmErr");

  if (!terms) {
    showBanner("Please accept the Terms & Conditions to continue.");
    return;
  }

  if (!ok) return;

  setLoading(true);

  try {
    // 1. Register with your existing auth endpoint
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const txt = await res.text();
      let msg = "Registration failed. Please try again.";
      try {
        const json = JSON.parse(txt);
        msg = json.error || json.message || (json.errors?.[0]?.msg) || msg;
      } catch {}
      showBanner(msg);
      return;
    }

    const data = await res.json();

    // 2. Also save full application details to your public API
    try {
      await fetch(`${BASE_URL}/api/public/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedAccountType,
          firstName, lastName, email, phone, dob, country, employment,
          reference: data.user?.accountNumber || "pending",
        }),
      });
    } catch {} // Non-blocking

    // 3. Store auth data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user",  JSON.stringify(data.user));

    // 4. Show success
    showSuccess(data.user);

  } catch (err) {
    console.error("Register error:", err);
    showBanner("Unable to connect to the server. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
}

/* ─── SUCCESS SCREEN ─── */
function showSuccess(user) {
  // Mark all steps done
  document.querySelectorAll(".step").forEach(el => {
    el.classList.remove("active");
    el.classList.add("done");
  });

  document.querySelectorAll(".step-content").forEach(el => el.classList.add("hidden"));
  document.getElementById("stepSuccess").classList.remove("hidden");

  // Populate details
  const details = [
    ["Account Type",   selectedAccountType],
    ["Account Number", user?.accountNumber || "Pending allocation"],
    ["Name",           user?.name || "—"],
    ["Email",          user?.email || "—"],
    ["Status",         "✅ Active"],
  ];

  document.getElementById("successDetails").innerHTML = details.map(([l, v]) => `
    <div class="success-detail-row">
      <span class="sd-label">${l}</span>
      <span class="sd-val">${v}</span>
    </div>`).join("");

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Auto-redirect after 8s
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 8000);
}

/* ─── HELPERS ─── */
function isEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function setErr(id, msg) { document.getElementById(id).textContent = msg; }
function clearErr(id) { document.getElementById(id).textContent = ""; }
function showBanner(msg) {
  const el  = document.getElementById("regError");
  const txt = document.getElementById("regErrorMsg");
  txt.textContent = msg;
  el.hidden = false;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}