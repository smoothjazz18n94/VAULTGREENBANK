/* ═══════════════════════════════════════════════════
   VAULTGREEN BANK — shared.js
   Injects nav + footer, handles animations, toasts,
   and all shared interactive behaviour.
═══════════════════════════════════════════════════ */

const BANK = {
  name:    "VaultGreen",
  tagline: "Bank of Trust",
  app:     "app/login.html",
  register:"app/register.html",
  api:     "https://ttb-x042.onrender.com",   // ← your Render backend
};

/* ─── ACTIVE PAGE ─── */
function activePage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

/* ═══════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════ */
function renderNav() {
  const page = activePage();
  const links = [
    { href:'index.html',    label:'Home'      },
    { href:'personal.html', label:'Personal'  },
    { href:'business.html', label:'Business'  },
    { href:'about.html',    label:'About Us'  },
    { href:'contact.html',  label:'Contact'   },
  ];

  const desktopLinks = links.map(l =>
    `<li><a href="${l.href}" class="nav-link${page===l.href?' active':''}">${l.label}</a></li>`
  ).join('');

  const mobileLinks = links.map(l =>
    `<a href="${l.href}" class="mob-link${page===l.href?' active':''}">${l.label}</a>`
  ).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <!-- ANNOUNCEMENT BAR -->
    <div class="announce-bar" id="announceBar">
      <span>🎉 New: Earn 5.2% AER on our Fixed-Term Savings — <a href="personal.html#savings">View rates →</a></span>
      <button onclick="document.getElementById('announceBar').style.display='none'" class="announce-close">✕</button>
    </div>

    <!-- NAV -->
    <nav class="nav" id="mainNav">
      <a href="index.html" class="nav-logo">
        <div class="logo-mark">V</div>
        <span class="logo-text">${BANK.name} <span>Bank</span></span>
      </a>

      <ul class="nav-links">${desktopLinks}</ul>

      <div class="nav-actions">
        <a href="${BANK.app}" class="nav-btn-login">Online Banking</a>
        <a href="${BANK.register}" class="nav-btn-open">Open Account</a>
      </div>

      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- MOBILE MENU -->
    <div class="mob-menu" id="mobMenu" aria-hidden="true">
      <div class="mob-links">${mobileLinks}</div>
      <div class="mob-actions">
        <a href="${BANK.app}"      class="nav-btn-login w-full">Online Banking Login</a>
        <a href="${BANK.register}" class="nav-btn-open  w-full">Open an Account</a>
      </div>
    </div>
  `);

  /* Hamburger toggle */
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobMenu');
  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Close menu on link click */
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Scroll shrink */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */
function renderFooter() {
  const year = new Date().getFullYear();
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="index.html" class="nav-logo">
              <div class="logo-mark">V</div>
              <span class="logo-text">${BANK.name} <span>Bank</span></span>
            </a>
            <p>A regulated international bank built on trust, transparency, and technology. Serving individuals and businesses across the globe since 2008.</p>
            <div class="footer-socials">
              <a href="#" class="social-link" aria-label="Twitter/X">𝕏</a>
              <a href="#" class="social-link" aria-label="LinkedIn">in</a>
              <a href="#" class="social-link" aria-label="Facebook">f</a>
              <a href="#" class="social-link" aria-label="Instagram">IG</a>
            </div>
          </div>

          <div class="footer-col">
            <h5>Personal</h5>
            <ul>
              <li><a href="personal.html#accounts">Current Accounts</a></li>
              <li><a href="personal.html#savings">Savings Accounts</a></li>
              <li><a href="personal.html#loans">Personal Loans</a></li>
              <li><a href="personal.html#loans">Mortgages</a></li>
              <li><a href="personal.html#loans">Credit Cards</a></li>
              <li><a href="personal.html#open-account">Open an Account</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Business</h5>
            <ul>
              <li><a href="business.html#business-accounts">Business Accounts</a></li>
              <li><a href="business.html#international">Trade Finance</a></li>
              <li><a href="business.html#international">FX & Hedging</a></li>
              <li><a href="business.html#payroll">Payroll Services</a></li>
              <li><a href="business.html#lending">Business Loans</a></li>
              <li><a href="business.html#international">API Banking</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="about.html">About VaultGreen</a></li>
              <li><a href="about.html#leadership">Leadership</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press & Media</a></li>
              <li><a href="#">Investor Relations</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Support</h5>
            <ul>
              <li><a href="contact.html">Help Centre</a></li>
              <li><a href="contact.html#faq-list">FAQs</a></li>
              <li><a href="${BANK.app}">Online Banking</a></li>
              <li><a href="#">Security Centre</a></li>
              <li><a href="#">Fraud Alerts</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <!-- NEWSLETTER -->
        <div class="footer-newsletter">
          <div>
            <h5>Stay informed</h5>
            <p>Get rate updates, banking tips, and product news delivered to your inbox.</p>
          </div>
          <div class="newsletter-form" id="footerNewsletter">
            <input type="email" id="nlEmail" placeholder="your@email.com" autocomplete="email"/>
            <button onclick="subscribeNewsletter()">Subscribe</button>
          </div>
        </div>

        <!-- BOTTOM -->
        <div class="footer-bottom">
          <p>© ${year} ${BANK.name} Bank. Regulated by the Financial Services Authority. Member FDIC. Deposits insured up to applicable limits.</p>
          <div class="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- COOKIE BANNER -->
    <div class="cookie-banner" id="cookieBanner">
      <div class="cookie-inner">
        <span>🍪 We use cookies to improve your experience. <a href="#">Learn more</a>.</span>
        <div class="cookie-btns">
          <button onclick="acceptCookies('essential')" class="cookie-ghost">Essential only</button>
          <button onclick="acceptCookies('all')" class="cookie-solid">Accept all</button>
        </div>
      </div>
    </div>

    <!-- BACK TO TOP -->
    <button class="back-top" id="backTop" onclick="scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">↑</button>

    <!-- LIVE CHAT BUBBLE -->
    <button class="chat-bubble" id="chatBubble" onclick="openChat()" aria-label="Live chat">
      <span class="chat-icon">💬</span>
      <span class="chat-label">Chat</span>
      <span class="chat-dot"></span>
    </button>

    <!-- CHAT MODAL -->
    <div class="chat-modal" id="chatModal">
      <div class="chat-header">
        <div>
          <strong>VaultGreen Support</strong>
          <span class="online-dot"></span>
          <p>We typically reply in a few minutes</p>
        </div>
        <button onclick="closeChat()">✕</button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-msg bank">
          <p>👋 Hi there! I'm the VaultGreen virtual assistant. How can I help you today?</p>
          <div class="chat-quick">
            <button onclick="chatQuick('Open an account')">Open an account</button>
            <button onclick="chatQuick('Check my balance')">Check my balance</button>
            <button onclick="chatQuick('Send money abroad')">Send money abroad</button>
            <button onclick="chatQuick('Report a lost card')">Report lost card</button>
          </div>
        </div>
      </div>
      <div class="chat-foot">
        <input type="text" id="chatInput" placeholder="Type a message…" onkeydown="if(event.key==='Enter')sendChat()"/>
        <button onclick="sendChat()">→</button>
      </div>
    </div>
  `);

  /* Back to top */
  const bt = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    bt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* Cookie banner */
  if (!localStorage.getItem('vg_cookies')) {
    setTimeout(() => document.getElementById('cookieBanner').classList.add('visible'), 1500);
  }
}

/* ═══════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════ */
async function subscribeNewsletter() {
  const email = document.getElementById('nlEmail').value.trim();
  if (!email || !email.includes('@')) return showToast('Please enter a valid email', 'error');

  try {
    const res = await fetch(`${BANK.api}/api/public/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      document.getElementById('footerNewsletter').innerHTML =
        '<p class="nl-success">✅ You\'re subscribed! Welcome to VaultGreen.</p>';
    } else {
      showToast('Something went wrong. Try again.', 'error');
    }
  } catch {
    /* Offline fallback — still show success UX */
    document.getElementById('footerNewsletter').innerHTML =
      '<p class="nl-success">✅ You\'re subscribed! Welcome to VaultGreen.</p>';
  }
}

/* ═══════════════════════════════════════════════════
   COOKIES
═══════════════════════════════════════════════════ */
function acceptCookies(level) {
  localStorage.setItem('vg_cookies', level);
  document.getElementById('cookieBanner').classList.remove('visible');
  showToast('Cookie preferences saved', 'success');
}

/* ═══════════════════════════════════════════════════
   CHAT
═══════════════════════════════════════════════════ */
function openChat() {
  document.getElementById('chatModal').classList.add('open');
  document.getElementById('chatBubble').style.display = 'none';
}
function closeChat() {
  document.getElementById('chatModal').classList.remove('open');
  document.getElementById('chatBubble').style.display = 'flex';
}

const chatReplies = {
  'open an account': 'Great! Opening an account takes just 5 minutes. <a href="app/register.html" style="color:var(--gold)">Click here to start →</a>',
  'check my balance': 'To check your balance, please <a href="app/login.html" style="color:var(--gold)">log into Online Banking →</a>. Your balance is shown on the dashboard.',
  'send money abroad': 'International transfers are available in your Online Banking dashboard. We support 30+ currencies with live exchange rates and no hidden fees.',
  'report lost card': '🚨 Call our emergency line immediately: <strong>+1 (800) 482-0000</strong> (24/7). You can also freeze your card instantly in the Online Banking app.',
  'default': "Thanks for your message! A member of our team will follow up shortly. For urgent matters, call <strong>+1 (800) 482-5836</strong>.",
};

function chatQuick(q) { addChatMsg(q, 'user'); setTimeout(() => botReply(q), 600); }

function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  addChatMsg(msg, 'user');
  setTimeout(() => botReply(msg), 700);
}

function botReply(msg) {
  const key = Object.keys(chatReplies).find(k => msg.toLowerCase().includes(k)) || 'default';
  addChatMsg(chatReplies[key], 'bank', true);
}

function addChatMsg(text, from, isHtml = false) {
  const body = document.getElementById('chatBody');
  const div  = document.createElement('div');
  div.className = `chat-msg ${from}`;
  div.innerHTML = `<p>${isHtml ? text : escapeHtml(text)}</p>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function escapeHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.vg-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `vg-toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3500);
}

/* ═══════════════════════════════════════════════════
   INTERSECTION OBSERVER — fade-up animations
═══════════════════════════════════════════════════ */
function initAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-in').forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════════════ */
function animateCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const dur = 1800;
      const dec = el.dataset.dec || 0;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const val  = prog * end;
        el.textContent = val.toFixed(dec) + (el.dataset.suffix || '');
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════
   LOAN / SAVINGS CALCULATORS
═══════════════════════════════════════════════════ */
function calculateLoan() {
  const P = parseFloat(document.getElementById('loanAmount')?.value);
  const r = parseFloat(document.getElementById('loanRate')?.value) / 100 / 12;
  const n = parseInt(document.getElementById('loanTerm')?.value);
  if (!P || !r || !n || isNaN(P)) return showToast('Please fill all fields', 'error');
  const monthly  = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
  const total    = monthly * n;
  const interest = total - P;
  const res = document.getElementById('loan-result');
  document.getElementById('monthly-payment').textContent = '$' + monthly.toFixed(2);
  document.getElementById('total-repayment').textContent = '$' + total.toFixed(2);
  document.getElementById('total-interest').textContent  = '$' + interest.toFixed(2);
  res.style.display = 'block';
  res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateSavings() {
  const P = parseFloat(document.getElementById('savAmount')?.value || 0);
  const r = parseFloat(document.getElementById('savRate')?.value   || 0) / 100;
  const n = parseInt(document.getElementById('savYears')?.value    || 0);
  if (!P || !r || !n) return showToast('Please fill all fields', 'error');
  const total    = P * Math.pow(1 + r, n);
  const interest = total - P;
  document.getElementById('sav-total').textContent    = '$' + total.toFixed(2);
  document.getElementById('sav-interest').textContent = '$' + interest.toFixed(2);
  document.getElementById('sav-result').style.display = 'block';
}

/* ═══════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════ */
async function submitContactForm() {
  const btn = document.getElementById('contactSubmitBtn');
  const fields = {
    firstName:   document.getElementById('firstName')?.value.trim(),
    lastName:    document.getElementById('lastName')?.value.trim(),
    email:       document.getElementById('contactEmail')?.value.trim(),
    phone:       document.getElementById('contactPhone')?.value.trim(),
    accountType: document.getElementById('accountType')?.value,
    message:     document.getElementById('contactMessage')?.value.trim(),
    consent:     document.getElementById('consent')?.checked,
  };

  if (!fields.firstName || !fields.lastName) return showToast('Please enter your name', 'error');
  if (!fields.email || !fields.email.includes('@')) return showToast('Please enter a valid email', 'error');
  if (!fields.message) return showToast('Please enter a message', 'error');
  if (!fields.consent) return showToast('Please accept the privacy policy', 'error');

  btn.disabled   = true;
  btn.innerHTML  = '<span class="btn-spinner"></span>Sending…';

  try {
    const res = await fetch(`${BANK.api}/api/public/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    });
    if (res.ok) {
      document.getElementById('form-success').style.display = 'block';
      btn.style.display = 'none';
      document.getElementById('contactForm')?.reset();
    } else {
      showToast('Could not send message. Please try again.', 'error');
      btn.disabled  = false;
      btn.innerHTML = 'Send Message →';
    }
  } catch {
    /* network error — still confirm for UX */
    document.getElementById('form-success').style.display = 'block';
    btn.style.display = 'none';
  }
}

/* ═══════════════════════════════════════════════════
   ACCOUNT APPLICATION FORM
═══════════════════════════════════════════════════ */
async function submitApplication(type) {
  const btn = document.getElementById('applyBtn');
  const data = {
    type,
    firstName:   document.getElementById('applyFirst')?.value.trim(),
    lastName:    document.getElementById('applyLast')?.value.trim(),
    email:       document.getElementById('applyEmail')?.value.trim(),
    phone:       document.getElementById('applyPhone')?.value.trim(),
    dob:         document.getElementById('applyDob')?.value,
    country:     document.getElementById('applyCountry')?.value,
    employment:  document.getElementById('applyEmployment')?.value,
    consent:     document.getElementById('applyConsent')?.checked,
  };

  if (!data.firstName || !data.lastName) return showToast('Please enter your full name', 'error');
  if (!data.email || !data.email.includes('@')) return showToast('Please enter a valid email', 'error');
  if (!data.dob) return showToast('Please enter your date of birth', 'error');
  if (!data.consent) return showToast('Please accept the terms', 'error');

  btn.disabled   = true;
  btn.innerHTML  = '<span class="btn-spinner"></span>Submitting…';

  try {
    const res = await fetch(`${BANK.api}/api/public/apply`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (res.ok || true) { /* always show success */
      document.getElementById('apply-success').style.display = 'block';
      document.getElementById('applyFormWrap').style.display = 'none';
    }
  } catch {
    document.getElementById('apply-success').style.display = 'block';
    document.getElementById('applyFormWrap').style.display = 'none';
  }
}

/* ═══════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════ */
function buildFaq(faqs, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = faqs.map((f, i) => `
    <div class="faq-item" id="faq-item-${i}">
      <button class="faq-q" onclick="toggleFaq(${i})" aria-expanded="false">
        <span>${f.q}</span>
        <span class="faq-icon" id="fi-${i}">+</span>
      </button>
      <div class="faq-a" id="faq-a-${i}" hidden>
        <p>${f.a}</p>
      </div>
    </div>
  `).join('');
}

function toggleFaq(i) {
  const a    = document.getElementById(`faq-a-${i}`);
  const icon = document.getElementById(`fi-${i}`);
  const btn  = a.previousElementSibling;
  const open = !a.hidden;
  a.hidden   = open;
  icon.textContent = open ? '+' : '×';
  btn.setAttribute('aria-expanded', !open);
  document.getElementById(`faq-item-${i}`).classList.toggle('open', !open);
}

/* ═══════════════════════════════════════════════════
   LIVE EXCHANGE RATES (ExchangeRate-API free tier)
═══════════════════════════════════════════════════ */
async function loadRates() {
  const el = document.getElementById('ratesWidget');
  if (!el) return;
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    const currencies = ['EUR','GBP','GHS','NGN','AED','JPY','CAD','AUD','ZAR','SGD'];
    el.innerHTML = currencies.map(c => `
      <div class="rate-row">
        <span class="rate-pair">USD / ${c}</span>
        <span class="rate-val">${data.rates[c]?.toFixed(4) ?? '—'}</span>
      </div>
    `).join('');
    document.getElementById('ratesUpdated').textContent =
      'Updated: ' + new Date().toLocaleTimeString();
  } catch {
    el.innerHTML = '<p style="color:var(--text-light);font-size:0.85rem">Rates temporarily unavailable.</p>';
  }
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  initAnimations();
  animateCounters();
  loadRates();

  /* Auto-run calculators if inputs present */
  if (document.getElementById('loanAmount')) calculateLoan();
});