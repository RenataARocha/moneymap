// DADOS PROVISÓRIOS — apagar depois que a menina de dados entregar o gastos.json
import dados from "../data/gastos.json";

// LÓGICA PROVISÓRIA — apagar depois que a menina de lógica entregar o calculations.js
import {
  calcularTotalGastos,
  calcularPorCategoria,
  calcularPorcentagens,
  maiorCategoria,
  formatarMoeda,
} from "../utils/calculations";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CORES = ["#5DCAA5", "#1D9E75", "#EBC558", "#64748b", "#ef4444"];

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Outros: "📦",
};

function AnaliseGastos() {
  const { transacoes } = dados;

  const totalGastos = calcularTotalGastos(transacoes);
  const porCategoria = calcularPorCategoria(transacoes);
  const porcentagens = calcularPorcentagens(porCategoria, totalGastos);
  const [maiorCat] = maiorCategoria(porCategoria);

  const dadosGrafico = Object.entries(porCategoria)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);

  return (
    <div className="analise">
      <div className="analise__header">
        <h2 className="analise__titulo">Análise de Gastos</h2>
        <p className="analise__subtitulo">
          Distribuição detalhada por categoria — Maio 2026
        </p>
      </div>

      <div className="analise__grafico-card">
        <h3 className="analise__secao-titulo">Gastos por Categoria</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={dadosGrafico}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <XAxis
              dataKey="nome"
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `R$${v}`}
            />
            <Tooltip
              formatter={(value) => formatarMoeda(value)}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
              {dadosGrafico.map((_, index) => (
                <Cell key={index} fill={CORES[index % CORES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="analise__cards">
        {dadosGrafico.map(({ nome, valor }, index) => (
          <div
            key={nome}
            className={`analise__card ${nome === maiorCat ? "analise__card--destaque" : ""}`}
          >
            <div
              className="analise__card-icone"
              style={{ background: `${CORES[index % CORES.length]}20` }}
            >
              {iconesPorCategoria[nome] || "📦"}
            </div>
            <div className="analise__card-info">
              <span className="analise__card-nome">{nome}</span>
              <span className="analise__card-valor">
                {formatarMoeda(valor)}
              </span>
            </div>
            <div className="analise__card-pct">
              <span
                className="analise__card-pct-valor"
                style={{ color: CORES[index % CORES.length] }}
              >
                {porcentagens[nome]}%
              </span>
              <div className="analise__card-barra">
                <div
                  className="analise__card-barra-fill"
                  style={{
                    width: `${porcentagens[nome]}%`,
                    background: CORES[index % CORES.length],
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnaliseGastos;
