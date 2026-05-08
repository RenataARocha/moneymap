import { useState } from "react";
import dados from "../data/gastos.json";
import {
  calcularTotalGastos,
  calcularPorCategoria,
  maiorCategoria,
  formatarMoeda,
  gerarRecomendacoes,
} from "../utils/calculations";
import "./InsightsPage.css";

function InsightsPage() {
  const { transacoes } = dados;
  const [mesSelecionado, setMesSelecionado] = useState("maio");

  const totalGastos = calcularTotalGastos(transacoes);
  const porCategoria = calcularPorCategoria(transacoes);
  const [maiorCat] = maiorCategoria(porCategoria);

  const maiorTransacao = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((maior, t) => (t.valor > maior.valor ? t : maior), transacoes[0]);

  const totalReceita = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const pctMaiorCat =
    totalGastos > 0
      ? ((porCategoria[maiorCat] / totalGastos) * 100).toFixed(1)
      : 0;

  const insightsFinanceiros = [
    {
      icone: "📈",
      texto: (
        <>
          Você gastou mais em <strong>{maiorCat}</strong> —{" "}
          <strong>{pctMaiorCat}%</strong> do total
        </>
      ),
    },
    {
      icone: "🏆",
      texto: (
        <>
          Categoria dominante <strong>{maiorCat}</strong> com{" "}
          <strong>{formatarMoeda(porCategoria[maiorCat] || 0)}</strong>
        </>
      ),
    },
    {
      icone: "💸",
      texto: (
        <>
          Maior transação:{" "}
          <strong>{formatarMoeda(maiorTransacao?.valor || 0)}</strong> em{" "}
          <strong>{maiorTransacao?.categoria}</strong>
        </>
      ),
    },
    {
      icone: "💰",
      texto: (
        <>
          Receita do mês: <strong>{formatarMoeda(totalReceita)}</strong> —
          Saldo: <strong>{formatarMoeda(totalReceita - totalGastos)}</strong>
        </>
      ),
    },
  ];

  // DADOS PROVISÓRIOS — substituir quando calculations.js definitivo for entregue
// REMOVA o array hardcoded e coloque:
const recomendacoes = gerarRecomendacoes(porCategoria, totalGastos, dados.mesAnterior, transacoes);

  return (
    <div className="insights-page">
      <div className="insights-page__topo">
        <h2 className="insights-page__titulo">Insights e Recomendações</h2>
        <select
          className="insights-page__select"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        >
          <option value="janeiro">Mês: Janeiro 2026</option>
          <option value="fevereiro">Mês: Fevereiro 2026</option>
          <option value="março">Mês: Março 2026</option>
          <option value="abril">Mês: Abril 2026</option>
          <option value="maio">Mês: Maio 2026</option>
        </select>
      </div>

      <div className="insights-page__secao">
        <h3 className="insights-page__secao-titulo">Insights Financeiros</h3>
        <div className="insights-page__financeiros">
          {insightsFinanceiros.map((item, i) => (
            <div key={i} className="insights-page__financeiro-card">
              <span className="insights-page__financeiro-icone">
                {item.icone}
              </span>
              <p className="insights-page__financeiro-texto">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-page__secao">
        <h3 className="insights-page__secao-titulo">Recomendações Práticas</h3>
        <div className="insights-page__recomendacoes">
          {recomendacoes.map((r, i) => (
            <div key={i} className="insights-page__rec-card">
              <div className="insights-page__rec-topo">
                <img
                  src={r.imagem}
                  alt={r.titulo}
                  className="insights-page__rec-img"
                />
                <strong className="insights-page__rec-titulo">
                  {r.titulo}
                </strong>
              </div>
              <p className="insights-page__rec-descricao">{r.descricao}</p>
              {r.sugerido && (
                <p className="insights-page__rec-sugerido">
                  <span>Sugerido:</span> {r.sugerido}
                </p>
              )}
              {r.dica && (
                <p className="insights-page__rec-sugerido">
                  <span>Dica:</span> {r.dica}
                </p>
              )}
              {r.valor && (
                <p className="insights-page__rec-economia">
                  Possível economia: <strong>{r.valor}</strong>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InsightsPage;
