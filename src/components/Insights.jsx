const iconesPadrao = {
  alta: "📈",
  baixa: "📉",
  estavel: "✅",
  padrao: "🔍",
};

function Insights({ padroes, recomendacoes }) {
  return (
    <div className="insights">
      <div className="insights__secao">
        <h3 className="insights__titulo">Padrões Detectados</h3>
        <div className="insights__lista">
          {padroes.map((p, i) => (
            <div key={i} className="insights__item">
              <div className={`insights__icone insights__icone--${p.tipo}`}>
                {iconesPadrao[p.tipo] || "📊"}
              </div>
              <div className="insights__texto">
                <strong>{p.mensagem}</strong>
                <span>{p.detalhe}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights__secao">
        <h3 className="insights__titulo">Recomendações de Economia</h3>
        <div className="insights__lista">
          {recomendacoes.map((r, i) => (
            <div
              key={i}
              className={`insights__rec ${i === 0 ? "insights__rec--destaque" : ""}`}
            >
              <div className="insights__rec-icone">{r.icone}</div>
              <div className="insights__texto">
                <strong>{r.titulo}</strong>
                {r.valor && (
                  <span className="insights__rec-valor">{r.valor}</span>
                )}
                <span>{r.descricao}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Insights;
