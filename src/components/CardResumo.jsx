import "./CardResumo.css";

function CardResumo({ icone, label, valor, variacao, tipo }) {
  const positivo = variacao >= 0;

  return (
    <div className={`card-resumo ${tipo === "destaque" ? "destaque" : ""}`}>
      {/* Alterado de {icone} para <img> */}
      <div className="card-resumo__icone">
        <img
          src={icone}
          alt={label}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

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
