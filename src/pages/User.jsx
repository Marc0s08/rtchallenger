import { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard";
import "./User.css";
import logo from "./background.jpeg";

export default function User() {
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalPlayer, setModalPlayer] = useState(null);

  const rotas = ["TOP", "JUNGLER", "MIDLANER", "ADCARRY", "SUPORTE"];

  useEffect(() => {
    async function fetchData() {
      try {
        const resTeams = await fetch("http://localhost:5000/teams");
        const dataTeams = resTeams.ok ? await resTeams.json() : {};
        setTeams(dataTeams || {});
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar times:", err);
        setTeams({});
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;

  // Identifica Free Agents (jogadores não atribuídos a nenhum time)
  const assignedIds = new Set();
  Object.keys(teams).forEach((team) => {
    if (team !== "FA" && teams[team]) {
      Object.values(teams[team]).forEach((player) => {
        if (player && player.id) assignedIds.add(player.id);
      });
    }
  });
  const freeAgents = teams.FA ? teams.FA.filter((p) => !assignedIds.has(p.id)) : [];
  const teamNames = Object.keys(teams).filter((t) => t !== "FA");

  return (
    <div className="user-container">
      {/* Cabeçalho com logo e título */}
      <div className="user-header">
        <img src={logo} alt="Logo" className="user-logo" />
        <h1 className="user-title">Campeonato Rounds Table Challenger</h1>
      </div>

      {/* Tabela de Times */}
      <div className="teams-table">
        <div className="table-header">
          <div className="table-col rota-col">Rota</div>
          {teamNames.map((team) => (
            <div key={team} className="table-col team-col">{team}</div>
          ))}
        </div>

        {rotas.map((rota) => (
          <div key={rota} className="table-row">
            <div className="table-col rota-col">{rota}</div>
            {teamNames.map((team) => (
              <div key={team} className="table-col team-col">
                {teams[team] && teams[team][rota] ? (
                  <div
                    className="player-cell"
                    onClick={() => setModalPlayer(teams[team][rota])}
                  >
                    <img
                      src={teams[team][rota].foto || ""}
                      alt={teams[team][rota].nickname || ""}
                      className="player-photo"
                    />
                    <span className="player-name">
                      {teams[team][rota].nickname || "Sem nome"}
                    </span>
                  </div>
                ) : (
                  <span className="empty-slot">Vazio</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Free Agents */}
      {freeAgents.length > 0 && (
        <div className="free-agents-section">
          <h2>Free Agents</h2>
          <div className="free-agents-grid">
            {freeAgents.map((p) => (
              <div
                key={p.id}
                className="fa-card"
                onClick={() => setModalPlayer(p)}
              >
                <img src={p.foto || ""} alt={p.nickname} className="fa-photo" />
                <span className="fa-name">{p.nickname || "Sem nome"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal do jogador */}
      {modalPlayer && (
        <div className="modal-overlay" onClick={() => setModalPlayer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPlayer(null)}>
              &times;
            </button>
            <PlayerCard player={modalPlayer} isInSlot={true} />
          </div>
        </div>
      )}
    </div>
  );
}
