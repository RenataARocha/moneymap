import "./Skeleton.css";

function Skeleton({ largura, altura, arredondado, className }) {
  return (
    <div
      className={
        "skeleton " +
        (arredondado ? "skeleton--redondo " : "") +
        (className || "")
      }
      style={{ width: largura || "100%", height: altura || "1rem" }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton largura="48px" altura="48px" arredondado />
      <div className="skeleton-card__info">
        <Skeleton largura="60%" altura="0.75rem" />
        <Skeleton largura="80%" altura="1.25rem" />
        <Skeleton largura="40%" altura="0.75rem" />
      </div>
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div
      className="skeleton-home"
      role="status"
      aria-label="Carregando dashboard"
    >
      <div className="skeleton-home__mes">
        <Skeleton largura="40px" altura="36px" arredondado />
        <Skeleton largura="160px" altura="28px" />
        <Skeleton largura="40px" altura="36px" arredondado />
      </div>
      <div className="skeleton-home__cards">
        {[1, 2, 3, 4].map(function (i) {
          return <SkeletonCard key={i} />;
        })}
      </div>
      <div className="skeleton-home__meio">
        <div className="skeleton-home__grafico">
          <Skeleton altura="260px" />
        </div>
        <div className="skeleton-home__insights">
          <Skeleton altura="120px" />
          <Skeleton altura="120px" />
        </div>
      </div>
      <Skeleton altura="200px" />
    </div>
  );
}

export default Skeleton;
