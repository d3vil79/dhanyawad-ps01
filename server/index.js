require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AccessCare API is running ✅', time: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Start ─────────────────────────────────────────────
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 AccessCare API running at http://localhost:${PORT}`);
  });
}

startServer();
