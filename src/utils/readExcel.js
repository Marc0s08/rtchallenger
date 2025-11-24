import * as XLSX from "xlsx";

function convertGoogleDriveLink(url) {
  if (!url) return null;

  // Caso: /file/d/ID/view
  const idFromFile = url.match(/\/file\/d\/([^/]+)/);
  if (idFromFile) {
    return `https://drive.google.com/uc?export=view&id=${idFromFile[1]}`;
  }

  // Caso: ?id=ID
  const idFromParam = url.match(/id=([^&]+)/);
  if (idFromParam) {
    return `https://drive.google.com/uc?export=view&id=${idFromParam[1]}`;
  }

  // Caso: /d/ID/
  const idFromD = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (idFromD) {
    return `https://drive.google.com/uc?export=view&id=${idFromD[1]}`;
  }

  return url; // fallback
}

export async function loadPlayers() {
  const response = await fetch("/jogadores.xlsx");
  const buffer = await response.arrayBuffer();

  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet);

  return rows.map(row => ({
    nickname: row["Nickname"],
    rota_principal: row["Rota Principal"],
    rota_secundaria: row["Rota Secundária"],
    micro: row["Micro"],
    macro: row["Macro"],
    elo_atual: row["Elo Atual"],
    elo_max: row["Elo Mais Alto"],
    foto: convertGoogleDriveLink(row["Link Foto"]), // ✔ agora funciona
  }));
}
