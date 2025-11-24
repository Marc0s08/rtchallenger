// backend/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Caminhos dos arquivos JSON
const dataFile = path.join(__dirname, "data.json");
const teamsFile = path.join(__dirname, "teams.json");

// Função para ler JSON ou criar vazio se não existir
function readJSON(file, defaultValue) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const content = fs.readFileSync(file, "utf-8");
  if (!content) return defaultValue;
  return JSON.parse(content);
}

// --- ROTAS --- //

// Retorna lista de jogadores (FA)
app.get("/data", (req, res) => {
  const players = readJSON(dataFile, []);
  res.json(players);
});

// Retorna estrutura de times
app.get("/teams", (req, res) => {
  const defaultTeams = {
    FA: [],
    "Time A": { TOP: null, JUNGLER: null, MIDLANER: null, ADCARRY: null, SUPORTE: null },
    "Time B": { TOP: null, JUNGLER: null, MIDLANER: null, ADCARRY: null, SUPORTE: null },
    "Time C": { TOP: null, JUNGLER: null, MIDLANER: null, ADCARRY: null, SUPORTE: null },
  };
  const teams = readJSON(teamsFile, defaultTeams);
  res.json(teams);
});

// Salva os times
app.post("/teams", (req, res) => {
  try {
    fs.writeFileSync(teamsFile, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar os times" });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
