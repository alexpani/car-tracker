const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app       = express();
const PORT      = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// ── Middleware ──────────────────────────────────
app.use(express.json());
app.use(express.static(__dirname));   // serve index.html e asset statici

// ── Helpers ─────────────────────────────────────
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { cars: [], interventions: [] };
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return { cars: [], interventions: [] }; }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Inizializza data.json se non esiste ──────────
if (!fs.existsSync(DATA_FILE)) {
  writeData({ cars: [], interventions: [] });
  console.log('✔ data.json creato.');
}

// ── API ─────────────────────────────────────────
// Legge tutti i dati
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// Sovrascrive tutti i dati
app.put('/api/data', (req, res) => {
  const { cars, interventions } = req.body;
  if (!Array.isArray(cars) || !Array.isArray(interventions)) {
    return res.status(400).json({ error: 'Payload non valido' });
  }
  writeData({ cars, interventions });
  res.json({ ok: true });
});

// ── Avvio ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗  Diario Automezzi → http://localhost:${PORT}\n`);
});
