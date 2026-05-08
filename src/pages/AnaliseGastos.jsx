import { useState } from "react";
import dados from "../data/gastos.json";
import {
  calcularTotalGastos,
  calcularPorCategoria,
  maiorCategoria,
  formatarMoeda,
  gerarRecomendacoes,
} from "../utils/calculations";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

import "./AnaliseGastos.css";

const CORES = ["#1A5A5A", "#589D99", "#90CFCB", "#D7B06B", "#F1D39F"];

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Outros: "📦",
};

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="analise__tooltip">
      <p className="analise__tooltip-label">{label}</p>
      <p className="analise__tooltip-valor">
        {formatarMoeda(payload[0].value)}
      </p>
    </div>
  );
};

const ITENS_POR_PAGINA = 5;

function AnaliseGastos() {
  const { transacoes, mesAnterior } = dados;
  const [tipoGrafico, setTipoGrafico] = useState("barra");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const transacoesOrdenadas = [...transacoes]
    .filter((t) => t.tipo === "saida")
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalPaginas = Math.ceil(transacoesOrdenadas.length / ITENS_POR_PAGINA);

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;

  const transacoesPaginadas = transacoesOrdenadas.slice(
    inicio,
    inicio + ITENS_POR_PAGINA,
  );

  const totalGastos = calcularTotalGastos(transacoes);
  const porCategoria = calcularPorCategoria(transacoes);
  const [maiorCat] = maiorCategoria(porCategoria);
  const recomendacoes = gerarRecomendacoes(
    porCategoria,
    totalGastos,
    mesAnterior,
  );
  const economiaPotencial = recomendacoes[0]?.valor || "—";

  const dadosGrafico = Object.entries(porCategoria)
    .map(([nome, valor]) => ({ nome, valor: parseFloat(valor.toFixed(2)) }))
    .sort((a, b) => b.valor - a.valor);

  const eixoX = {
    dataKey: "nome",
    tick: { fill: "var(--text-muted)", fontSize: 12 },
    axisLine: false,
    tickLine: false,
  };

  const eixoY = {
    tick: { fill: "var(--text-muted)", fontSize: 11 },
    axisLine: false,
    tickLine: false,
    tickFormatter: (v) => `R$${v}`,
  };

  return (
    <div className="analise">
      <div className="analise__topo">
        <h2 className="analise__titulo">Análise de Gastos</h2>
        <div className="analise__controles">
          <div className="analise__toggle">
            <button
              className={`analise__toggle-btn ${tipoGrafico === "linha" ? "ativo" : ""}`}
              onClick={() => setTipoGrafico("linha")}
            >
              Linha
            </button>
            <button
              className={`analise__toggle-btn ${tipoGrafico === "barra" ? "ativo" : ""}`}
              onClick={() => setTipoGrafico("barra")}
            >
              Barra
            </button>
          </div>
          <select className="analise__select" defaultValue="maio">
            <option value="janeiro">Mês: Janeiro 2026</option>
            <option value="fevereiro">Mês: Fevereiro 2026</option>
            <option value="março">Mês: Março 2026</option>
            <option value="abril">Mês: Abril 2026</option>
            <option value="maio">Mês: Maio 2026</option>
          </select>
        </div>
      </div>

      <div className="analise__meio">
        <div className="analise__grafico-card">
          <h3 className="analise__secao-titulo">
            Evolução dos Gastos R$ — Maio 2026
          </h3>

          <div className="analise__legenda">
            {dadosGrafico.map((item, i) => (
              <div key={item.nome} className="analise__legenda-item">
                <span
                  className="analise__legenda-cor"
                  style={{ background: CORES[i % CORES.length] }}
                />
                <span className="analise__legenda-nome">{item.nome}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={260}>
            {tipoGrafico === "barra" ? (
              <BarChart
                tabIndex={-1}
                data={dadosGrafico}
                margin={{ top: 30, right: 16, left: 10, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.15)"
                  vertical={false}
                />
                <XAxis
                  {...eixoX}
                  label={{
                    value: "Categorias",
                    position: "insideBottom",
                    offset: -10,
                    fill: "var(--text-muted)",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  {...eixoY}
                  label={{
                    value: "R$ Valor",
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--text-muted)",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  content={<TooltipCustom />}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar
                  dataKey="valor"
                  radius={[6, 6, 0, 0]}
                  label={{
                    position: "top",
                    fill: "var(--text-muted)",
                    fontSize: 11,
                    formatter: (v) => formatarMoeda(v),
                  }}
                >
                  {dadosGrafico.map((_, i) => (
                    <Cell key={i} fill={CORES[i % CORES.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart
                tabIndex={-1}
                data={dadosGrafico}
                margin={{ top: 16, right: 16, left: 10, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.15)"
                  vertical={false}
                />
                <XAxis {...eixoX} />
                <YAxis {...eixoY} />
                <Tooltip
                  content={<TooltipCustom />}
                  cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--primary-light)"
                  strokeWidth={2}
                  dot={{ fill: "var(--accent)", r: 4 }}
                  activeDot={{ r: 6, fill: "var(--accent)" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="analise__resumo-card">
          <h3 className="analise__secao-titulo">Resumo do Mês</h3>
          <p className="analise__resumo-mes">Maio 2026</p>

          <div className="analise__resumo-item">
            <span className="analise__resumo-label">Total Gasto Mês</span>
            <span className="analise__resumo-valor--destaque">
              {formatarMoeda(totalGastos)}
            </span>
          </div>

          <div className="analise__resumo-item">
            <span className="analise__resumo-label">Categoria Dominante</span>
            <span className="analise__resumo-categoria">
              {iconesPorCategoria[maiorCat] || "📦"} {maiorCat}
            </span>
          </div>

          <div className="analise__resumo-item">
            <span className="analise__resumo-label">Economia Potencial</span>
            <span className="analise__resumo-economia">
              {economiaPotencial}
            </span>
          </div>
        </div>
      </div>

      <div className="analise__tabela-card">
        <h3 className="analise__secao-titulo">Lista de Gastos de Maio 2026</h3>
        <table className="analise__tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoesPaginadas.map((t) => (
              <tr key={t.id}>
                <td>
                  {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </td>
                <td>{t.descricao}</td>
                <td>
                  <span className="analise__badge">
                    {iconesPorCategoria[t.categoria] || "📦"} {t.categoria}
                  </span>
                </td>
                <td className="analise__tabela-valor">
                  {formatarMoeda(t.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="analise__paginacao">
          <button
            className="analise__pag-btn"
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            disabled={paginaAtual === 1}
          >
            ‹
          </button>

          <span className="analise__pag-info">
            {paginaAtual} de {totalPaginas}
          </span>

          <button
            className="analise__pag-btn"
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnaliseGastos;
