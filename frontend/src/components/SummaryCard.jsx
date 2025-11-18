export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>

      <div className="summary-info">
        <p className="summary-title">{title}</p>
        <h3 className="summary-value">{value}</h3>
      </div>
    </div>
  );
}