const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Outros: "📦",
};

function CardCategoria({ categoria, percentual }) {
  const icone = iconesPorCategoria[categoria] || "📦";

  return (
    <div className="card-categoria">
      <div className="card-categoria__icone">{icone}</div>
      <div className="card-categoria__info">
        <span className="card-categoria__label">Maior Categoria</span>
        <span className="card-categoria__nome">{categoria}</span>
        <span className="card-categoria__sub">{percentual}% do total</span>
      </div>
    </div>
  );
}

export default CardCategoria;
