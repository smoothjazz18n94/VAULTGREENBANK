// routes/public.js
// Public-facing routes: contact form, newsletter, account applications
// No auth required — these are from the public website

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

/* ═══════════════════════════════════════════
   SCHEMAS (inline — add to models/ if preferred)
═══════════════════════════════════════════ */

// Contact message
const contactSchema = new mongoose.Schema({
  firstName:   { type: String, required: true, trim: true },
  lastName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, default: '' },
  accountType: { type: String, default: 'General' },
  message:     { type: String, required: true },
  status:      { type: String, enum: ['new','read','responded'], default: 'new' },
}, { timestamps: true });

// Newsletter subscriber
const newsletterSchema = new mongoose.Schema({
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt:{ type: Date, default: Date.now },
  active:      { type: Boolean, default: true },
});

// Account application
const applicationSchema = new mongoose.Schema({
  type:       { type: String, required: true },    // e.g. "Classic Current", "Premium Savings"
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, lowercase: true },
  phone:      { type: String, default: '' },
  dob:        { type: String, default: '' },
  country:    { type: String, default: '' },
  employment: { type: String, default: '' },
  status:     { type: String, enum: ['pending','under_review','approved','rejected'], default: 'pending' },
  reference:  { type: String },                    // auto-generated reference
}, { timestamps: true });

const Contact     = mongoose.models.Contact     || mongoose.model('Contact',     contactSchema);
const Newsletter  = mongoose.models.Newsletter  || mongoose.model('Newsletter',  newsletterSchema);
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function generateRef() {
  return 'VG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
}

function isEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/* ═══════════════════════════════════════════
   POST /api/public/contact
   Saves a contact form submission
═══════════════════════════════════════════ */
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, accountType, message, consent } = req.body;

    if (!firstName || !lastName)       return res.status(400).json({ error: 'Name is required' });
    if (!email || !isEmail(email))     return res.status(400).json({ error: 'Valid email is required' });
    if (!message)                      return res.status(400).json({ error: 'Message is required' });

    const contact = await Contact.create({ firstName, lastName, email, phone, accountType, message });

    console.log(`✅ Contact form: ${firstName} ${lastName} <${email}> — ${contact._id}`);

    res.status(201).json({ success: true, message: 'Message received. We will respond within 4 hours.' });

  } catch (err) {
    console.error('❌ Contact form error:', err);
    res.status(500).json({ error: 'Could not save message. Please try again.' });
  }
});

/* ═══════════════════════════════════════════
   POST /api/public/newsletter
   Subscribe to newsletter
═══════════════════════════════════════════ */
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isEmail(email)) return res.status(400).json({ error: 'Valid email is required' });

    await Newsletter.findOneAndUpdate(
      { email },
      { email, active: true },
      { upsert: true, new: true }
    );

    console.log(`✅ Newsletter subscribe: ${email}`);
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });

  } catch (err) {
    console.error('❌ Newsletter error:', err);
    res.status(500).json({ error: 'Could not subscribe. Please try again.' });
  }
});

/* ═══════════════════════════════════════════
   POST /api/public/apply
   Submit an account application
═══════════════════════════════════════════ */
router.post('/apply', async (req, res) => {
  try {
    const { type, firstName, lastName, email, phone, dob, country, employment } = req.body;

    if (!firstName || !lastName)   return res.status(400).json({ error: 'Full name is required' });
    if (!email || !isEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!dob)                      return res.status(400).json({ error: 'Date of birth is required' });
    if (!type)                     return res.status(400).json({ error: 'Account type is required' });

    const reference = generateRef();

    const app = await Application.create({
      type, firstName, lastName, email, phone, dob, country, employment, reference
    });

    console.log(`✅ Application [${type}]: ${firstName} ${lastName} <${email}> — REF: ${reference}`);

    res.status(201).json({
      success:   true,
      reference,
      message:   `Application received. Reference: ${reference}. We'll contact you within 24 hours.`,
    });

  } catch (err) {
    console.error('❌ Application error:', err);
    res.status(500).json({ error: 'Could not submit application. Please try again.' });
  }
});

/* ═══════════════════════════════════════════
   GET /api/public/rates
   Proxy live exchange rates (avoids CORS on frontend)
═══════════════════════════════════════════ */
router.get('/rates', async (req, res) => {
  try {
    const fetch  = (await import('node-fetch')).default;
    const result = await fetch('https://open.er-api.com/v6/latest/USD');
    const data   = await result.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Could not fetch exchange rates' });
  }
});

module.exports = router;