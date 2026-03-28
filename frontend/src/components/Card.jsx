import "./Card.css";

export default function Card({ image, title }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="card-label">
        {title}
      </div>
    </div>
  );
}
