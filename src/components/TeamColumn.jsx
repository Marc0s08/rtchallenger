import "./TeamColumn.css";

export default function TeamColumn({ title, children }) {
  return (
    <div className="team-column">
      <h2 className="team-title">{title}</h2>
      <div className="team-content">
        {children}
      </div>
    </div>
  );
}
