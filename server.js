// ═══════════════════════════════════════════════════
// ADD THIS TO YOUR server.js
// Wire in the public website routes
// ═══════════════════════════════════════════════════

const publicRoutes = require('./routes/public');

// Add after your existing routes:
app.use('/api/public', publicRoutes);

// Also add CORS headers for your Vercel frontend domain:
const cors = require('cors');
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',  // ← replace with your Vercel URL
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
  ],
  credentials: true,
}));

// ───────────────────────────────────────────────────
// Your full server.js should look like this:
// ───────────────────────────────────────────────────
/*
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');

const authRoutes    = require('./routes/auth');
const txRoutes      = require('./routes/transactions');
const publicRoutes  = require('./routes/public');        // ← NEW

const app = express();

app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => res.send('VaultGreen API running 🏦'));

app.use('/api/auth',         authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/public',       publicRoutes);   // ← NEW

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
*/