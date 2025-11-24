import { useState } from "react";
import "./PlayerCard.css";

export default function PlayerCard({ player, isInSlot }) {
  const [erroFoto, setErroFoto] = useState(false);

  const fotoFinal = !erroFoto && player.foto ? player.foto : "/fallback.jpg";

  // Map de rota -> caminho da imagem
  const rotaIcons = {
    TOP: "/icons/TOP.png",
    JUNGLER: "/icons/jungler.png",
    MIDLANER: "/icons/midlaner.png",
    ADCARRY: "/icons/adcarry.png",
    SUPORTE: "/icons/suporte.png"
  };

  return (
    <div className={`card-horizontal ${isInSlot ? "in-slot" : ""}`}>
      {/* FOTO */}
      <div className="card-photo">
        <img
          src={fotoFinal}
          alt={player.nickname}
          onError={() => setErroFoto(true)}
        />
      </div>

      {/* INFO */}
      <div className="card-info">
        <h2 className="card-nick">{player.nickname}</h2>

        <div className="info-text">
          <p>
            <strong>Rota Primária:</strong>{" "}
            <img
              src={rotaIcons[player.rotaPrincipal]}
              alt={player.rotaPrincipal}
              className="rota-icon"
            />
          </p>
          <p>
            <strong>Rota Secundária:</strong>{" "}
            <img
              src={rotaIcons[player.rotaSecundaria]}
              alt={player.rotaSecundaria}
              className="rota-icon"
            />
          </p>
          <p><strong>Micro:</strong> {player.micro}</p>
          <p><strong>Macro:</strong> {player.macro}</p>
        </div>

        {/* ELOS como texto */}
        <div className="elos">
          <div className="elo">
            <strong>Elo Atual:</strong> {player.eloAtual}
          </div>
          <div className="elo">
            <strong>Elo Máximo:</strong> {player.eloMaisAlto}
          </div>
        </div>
      </div>
    </div>
  );
}
