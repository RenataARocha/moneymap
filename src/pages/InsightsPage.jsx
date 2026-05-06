// DADOS PROVISÓRIOS — apagar depois que a menina de dados entregar o gastos.json
import dados from "../data/gastos.json";

// LÓGICA PROVISÓRIA — apagar depois que a menina de lógica entregar o calculations.js
import {
  calcularTotalGastos,
  calcularPorCategoria,
  detectarPadroes,
  gerarRecomendacoes,
} from "../utils/calculations";

const iconesTipo = {
  alta: { icone: "📈", cor: "rgba(239,68,68,0.12)", texto: "#ef4444" },
  baixa: { icone: "📉", cor: "rgba(93,202,165,0.12)", texto: "#5DCAA5" },
  estavel: { icone: "✅", cor: "rgba(93,202,165,0.12)", texto: "#5DCAA5" },
  padrao: { icone: "🔍", cor: "rgba(245,158,11,0.12)", texto: "#f59e0b" },
};

function InsightsPage() {
  const { transacoes, mesAnterior } = dados;

  const totalGastos = calcularTotalGastos(transacoes);
  const porCategoria = calcularPorCategoria(transacoes);
  const padroes = detectarPadroes(transacoes, mesAnterior);
  const recomendacoes = gerarRecomendacoes(
    porCategoria,
    totalGastos,
    mesAnterior,
  );

  return (
    <div className="insights-page">
      <div className="insights-page__header">
        <h2 className="insights-page__titulo">Insights</h2>
        <p className="insights-page__subtitulo">
          Análise automática do seu comportamento de consumo
        </p>
      </div>

      <div className="insights-page__secao">
        <h3 className="insights-page__secao-titulo">Padrões Detectados</h3>
        <div className="insights-page__lista">
          {padroes.map((p, i) => {
            const config = iconesTipo[p.tipo] || iconesTipo.padrao;
            return (
              <div key={i} className="insights-page__item">
                <div
                  className="insights-page__icone"
                  style={{ background: config.cor }}
                >
                  {config.icone}
                </div>
                <div className="insights-page__texto">
                  <strong>{p.mensagem}</strong>
                  <span>{p.detalhe}</span>
                </div>
                <span
                  className="insights-page__tag"
                  style={{ color: config.texto, background: config.cor }}
                >
                  {p.categoria}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="insights-page__secao">
        <h3 className="insights-page__secao-titulo">
          Recomendações de Economia
        </h3>
        <div className="insights-page__lista">
          {recomendacoes.map((r, i) => (
            <div
              key={i}
              className={`insights-page__rec ${i === 0 ? "insights-page__rec--destaque" : ""}`}
            >
              <div className="insights-page__rec-icone">{r.icone}</div>
              <div className="insights-page__texto">
                <strong>{r.titulo}</strong>
                {r.valor && (
                  <span className="insights-page__rec-valor">{r.valor}</span>
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

export default InsightsPage;
