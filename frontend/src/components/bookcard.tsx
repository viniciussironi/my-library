import './bookcard.css';

export default function BookCard({ titulo, autor, capa }: { titulo: string; autor: string; capa: string }) {
  return (
    <div className="book-card">
      {/* Capa */}
      <img
        src={capa}
        alt={titulo}
      />
      <div className="book-info">
        <h3>{titulo}</h3>
        <p>{autor}</p>
      </div>
    </div>
  );
}