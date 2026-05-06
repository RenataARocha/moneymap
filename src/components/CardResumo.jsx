
function CardResumo({ icone, label, valor, variacao, tipo }) {
  const positivo = variacao >= 0;

  return (
    <div className={`card-resumo ${tipo === "destaque" ? "destaque" : ""}`}>
      <div className="card-resumo__icone">{icone}</div>
      <div className="card-resumo__info">
        <span className="card-resumo__label">{label}</span>
        <span className="card-resumo__valor">{valor}</span>
        {variacao !== undefined && (
          <span
            className={`card-resumo__variacao ${positivo ? "positivo" : "negativo"}`}
          >
            {positivo ? "+" : ""}
            {variacao.toFixed(1)}% vs. mês anterior
          </span>
        )}
      </div>
    </div>
  );
}

export default CardResumo;
