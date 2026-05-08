import { useState } from "react";
import dados from "../data/gastos.json";
import {
  calcularTotalGastos,
  calcularPorCategoria,
  maiorCategoria,
  formatarMoeda,
} from "../utils/calculations";
import "./InsightsPage.css";
import imgReduzir from "../assets/reduzir.png";
import imgControlar from "../assets/controlar.png";
import imgParabens from "../assets/parabens.png";

function InsightsPage() {
  const { transacoes } = dados;
  const [mesSelecionado, setMesSelecionado] = useState("maio");

  const totalGastos = calcularTotalGastos(transacoes);
  const porCategoria = calcularPorCategoria(transacoes);
  const [maiorCat] = maiorCategoria(porCategoria);

  const maiorTransacao = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((maior, t) => (t.valor > maior.valor ? t : maior), transacoes[0]);

  const insightsFinanceiros = [
    {
      icone: "📈",
      texto: (
        <>
          Você gastou mais em <strong>{maiorCat}</strong>
        </>
      ),
    },
    {
      icone: "🏆",
      texto: (
        <>
          Categoria dominante <strong>{maiorCat}</strong>
        </>
      ),
    },
    {
      icone: "💸",
      texto: (
        <>
          Maior transação única{" "}
          <strong>{formatarMoeda(maiorTransacao?.valor || 0)}</strong>
        </>
      ),
    },
    {
      icone: "📊",
      texto: (
        <>
          Gasto total maio: <strong>{formatarMoeda(totalGastos)}</strong>
        </>
      ),
    },
  ];

  // DADOS PROVISÓRIOS — substituir quando calculations.js definitivo for entregue
  const recomendacoes = [
    {
      imagem: imgReduzir,
      titulo: "Reduzir Delivery!",
      descricao: "Alimentação está maior que 40% dos seus gastos.",
      sugerido: "Preparar mais refeições em casa.",
      valor: "R$ 200,00",
    },
    {
      imagem: imgControlar,
      titulo: "Controlar Lazer!",
      descricao: "Lazer aumentou 15% em relação a março.",
      sugerido: "Busque sugestões gratuitas ou mais em conta.",
      valor: "R$ 100,00",
    },
    {
      imagem: imgParabens,
      titulo: "Parabéns!",
      descricao: "Gastos com transporte reduziram 5%.",
      dica: "Continue monitorando.",
      valor: "R$ 50,00",
    },
  ];

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
