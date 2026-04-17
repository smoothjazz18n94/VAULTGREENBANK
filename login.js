/* ═══════════════════════════════════════════════
   VAULTGREEN BANK — login.js
   Handles authentication, validation, forgot pw
═══════════════════════════════════════════════ */

const BASE_URL = "https://ttb-x042.onrender.com";

/* ─── REDIRECT IF ALREADY LOGGED IN ─── */
(function () {
  const token = localStorage.getItem("token");
  if (token) window.location.href = "dashboard.html";
})();

/* ─── ELEMENTS ─── */
const emailInput  = document.getElementById("email");
const passInput   = document.getElementById("password");
const submitBtn   = document.getElementById("submitBtn");
const btnText     = document.getElementById("btnText");
const loginError  = document.getElementById("loginError");
const loginErrMsg = document.getElementById("loginErrorMsg");

/* ─── INLINE VALIDATION ─── */
emailInput.addEventListener("blur", () => validateEmail());
passInput.addEventListener("blur",  () => validatePass());

emailInput.addEventListener("input", () => clearError("emailField", "emailErr"));
passInput.addEventListener("input",  () => clearError("passwordField", "passErr"));

function validateEmail() {
  const v = emailInput.value.trim();
  if (!v) return setFieldError("emailField", "emailErr", "Email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return setFieldError("emailField", "emailErr", "Please enter a valid email address");
  clearError("emailField", "emailErr");
  return true;
}

function validatePass() {
  const v = passInput.value;
  if (!v) return setFieldError("passwordField", "passErr", "Password is required");
  if (v.length < 6) return setFieldError("passwordField", "passErr", "Password must be at least 6 characters");
  clearError("passwordField", "passErr");
  return true;
}

function setFieldError(fieldId, errId, msg) {
  document.getElementById(fieldId).classList.add("has-error");
  document.getElementById(errId).textContent = msg;
  document.getElementById(fieldId).querySelector("input").classList.add("invalid");
  return false;
}

function clearError(fieldId, errId) {
  document.getElementById(fieldId).classList.remove("has-error");
  document.getElementById(errId).textContent = "";
  document.getElementById(fieldId).querySelector("input").classList.remove("invalid");
}

/* ─── PASSWORD VISIBILITY ─── */
function togglePassword() {
  const type = passInput.type === "password" ? "text" : "password";
  passInput.type = type;
  document.getElementById("togglePw").textContent = type === "password" ? "👁" : "🙈";
}

/* ─── ENTER KEY ─── */
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

/* ─── LOADING STATE ─── */
function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.classList.toggle("btn-loading", loading);
  btnText.innerHTML = loading
    ? '<span class="spinner"></span>Signing in…'
    : "Sign in to Online Banking";
}

/* ─── SHOW ERROR BANNER ─── */
function showBanner(msg) {
  loginErrMsg.textContent = msg;
  loginError.hidden = false;
  loginError.scrollIntoView({ behavior: "smooth", block: "nearest" });
  // shake animation
  submitBtn.style.animation = "shake .4s ease";
  setTimeout(() => (submitBtn.style.animation = ""), 400);
}

/* ─── MAIN LOGIN ─── */
async function doLogin() {
  loginError.hidden = true;

  const emailOk = validateEmail();
  const passOk  = validatePass();
  if (!emailOk || !passOk) return;

  const email    = emailInput.value.trim();
  const password = passInput.value;

  setLoading(true);

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    // Always check before parsing
    if (!res.ok) {
      const txt = await res.text();
      let msg = "Incorrect email or password. Please try again.";
      try {
        const json = JSON.parse(txt);
        msg = json.error || json.message || msg;
      } catch {}
      showBanner(msg);
      return;
    }

    const data = await res.json();

    // Store auth data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user",  JSON.stringify(data.user));

    // Remember device
    if (document.getElementById("remember").checked) {
      localStorage.setItem("vg_remember_email", email);
    } else {
      localStorage.removeItem("vg_remember_email");
    }

    // Redirect to dashboard
    btnText.innerHTML = "✅ Success! Redirecting…";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);

  } catch (err) {
    console.error("Login error:", err);
    showBanner("Unable to connect to the server. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
}

/* ─── REMEMBER EMAIL ─── */
(function restoreEmail() {
  const saved = localStorage.getItem("vg_remember_email");
  if (saved) {
    emailInput.value = saved;
    document.getElementById("remember").checked = true;
  }
})();

/* ─── FORGOT PASSWORD ─── */
function showForgot(e) {
  e.preventDefault();
  document.getElementById("forgotModal").classList.add("open");
  document.getElementById("resetEmail").value = emailInput.value;
}

function closeForgot() {
  document.getElementById("forgotModal").classList.remove("open");
  document.getElementById("resetSuccess").hidden = true;
}

async function doReset() {
  const email = document.getElementById("resetEmail").value.trim();
  if (!email || !email.includes("@")) {
    document.getElementById("resetEmail").classList.add("invalid");
    return;
  }
  document.getElementById("resetEmail").classList.remove("invalid");

  try {
    // Fire and forget — show success regardless (security best practice)
    await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email }),
    });
  } catch {}

  document.getElementById("resetSuccess").hidden = false;
}

/* ─── CLOSE MODAL ON BACKDROP ─── */
document.getElementById("forgotModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeForgot();
});

/* ─── CSS SHAKE ANIMATION ─── */
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(style);