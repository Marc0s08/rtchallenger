import { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard";
import "./Admin.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Admin() {
  const defaultTeams = {
    FA: [],
    "Time A": { TOP: null, JUNGLER: null, MIDLANER: null, ADCARRY: null, SUPORTE: null },
    "Time B": { TOP: null, JUNGLER: null, MIDLANER: null, ADCARRY: null, SUPORTE: null },
    "Time C": { TOP: null, JUNGLER: null, MIDLANER: null, ADCARRY: null, SUPORTE: null },
  };

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState(defaultTeams);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resPlayers = await fetch("http://localhost:5000/data");
        const dataPlayers = resPlayers.ok ? await resPlayers.json() : [];

        const resTeams = await fetch("http://localhost:5000/teams");
        const dataTeams = resTeams.ok ? await resTeams.json() : defaultTeams;

        setPlayers(dataPlayers || []);
        setTeams({ ...defaultTeams, ...dataTeams });
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setPlayers([]);
        setTeams(defaultTeams);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveTeams = async (newTeams) => {
    try {
      await fetch("http://localhost:5000/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeams),
      });
    } catch (err) {
      console.error("Erro ao salvar times:", err);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const player = players.find((p) => p.id === draggableId);
    if (!player) return;

    const sourceCol = source.droppableId.split("-");
    const destCol = destination.droppableId.split("-");

    setTeams((prev) => {
      const newTeams = { ...prev };

      // FA -> Time
      if (sourceCol[0] === "FA" && destCol.length === 2) {
        const teamName = destCol[0];
        const position = destCol[1];
        if (!newTeams[teamName][position]) {
          newTeams[teamName][position] = player;
          newTeams.FA = prev.FA.filter((p) => p.id !== draggableId);
        }
      }
      // Time -> FA
      else if (sourceCol.length === 2 && destCol[0] === "FA") {
        const teamName = sourceCol[0];
        const position = sourceCol[1];
        if (!prev.FA.find((p) => p.id === player.id)) {
          newTeams.FA = [...prev.FA, player];
        }
        newTeams[teamName][position] = null;
      }
      // Time -> Time
      else if (sourceCol.length === 2 && destCol.length === 2) {
        const sourceTeam = sourceCol[0];
        const sourcePos = sourceCol[1];
        const destTeam = destCol[0];
        const destPos = destCol[1];
        if (!newTeams[destTeam][destPos]) {
          newTeams[sourceTeam][sourcePos] = null;
          newTeams[destTeam][destPos] = player;
        }
      }

      saveTeams(newTeams);
      return newTeams;
    });
  };

  const renderPosition = (teamName, pos) => {
    if (!teams[teamName]) return null;
    const player = teams[teamName][pos];
    return (
      <Droppable key={`${teamName}-${pos}`} droppableId={`${teamName}-${pos}`}>
        {(provided) => (
          <div
            className="position-slot"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="position-name">{pos}</div>
            {player && (
              <Draggable key={player.id} draggableId={player.id} index={0}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      width: "100%",
                      height: "100%",
                      zIndex: snapshot.isDragging ? 9999 : "auto",
                    }}
                  >
                    <PlayerCard player={player} isInSlot />
                  </div>
                )}
              </Draggable>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="admin-container">
        {/* Barra lateral FA */}
        <Droppable droppableId="FA">
          {(provided) => (
            <div className="sidebar" ref={provided.innerRef} {...provided.droppableProps}>
              <h2>Free Agents</h2>
              {(teams.FA || []).filter(Boolean).map((player, index) => (
                <Draggable key={player.id} draggableId={player.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        width: "100%",
                        zIndex: snapshot.isDragging ? 9999 : "auto",
                      }}
                    >
                      <PlayerCard player={player} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Times */}
        <div className="teams-container">
          {["Time A", "Time B", "Time C"].map((team) => (
            <div key={team} className="team-column">
              <h2 className="team-title">{team}</h2>
              <div className="team-content">
                {["TOP", "JUNGLER", "MIDLANER", "ADCARRY", "SUPORTE"].map((pos) =>
                  renderPosition(team, pos)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
