const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app       = express();
const PORT      = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// ── Middleware ──────────────────────────────────
app.use(express.json());
// NB: express.static va DOPO le rotte API, altrimenti serve api.php come file grezzo

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
// Stesse rotte su /api/data e /api.php
// (api.php è usato dall'HTML per compatibilità con hosting PHP)

function handleGet(req, res) {
  res.json(readData());
}

function handlePut(req, res) {
  const { cars, interventions } = req.body;
  if (!Array.isArray(cars) || !Array.isArray(interventions)) {
    return res.status(400).json({ error: 'Payload non valido' });
  }
  writeData({ cars, interventions });
  res.json({ ok: true });
}

app.get(['/api/data', '/api.php'], handleGet);
app.put(['/api/data', '/api.php'], handlePut);

// ── File statici (index.html ecc.) — deve stare DOPO le rotte API ──
app.use(express.static(__dirname));

// ── Avvio ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗  Diario Automezzi → http://localhost:${PORT}\n`);
});
