import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./Chart.css";

const CORES = ["#5DCAA5", "#1D9E75", "#EBC558", "#64748b", "#ef4444"];

function Chart({ porCategoria }) {
  const dados = Object.entries(porCategoria).map(([nome, valor]) => ({
    nome,
    valor: parseFloat(valor.toFixed(2)),
  }));

  const total = dados.reduce((acc, d) => acc + d.valor, 0);

  const renderLegenda = () => (
    <ul className="chart__legenda">
      {dados.map((entry, index) => {
        const pct = ((entry.valor / total) * 100).toFixed(1);
        return (
          <li key={entry.nome} className="chart__legenda-item">
            <span
              className="chart__legenda-dot"
              style={{ background: CORES[index % CORES.length] }}
            />
            <span className="chart__legenda-nome">{entry.nome}</span>
            <span className="chart__legenda-pct">{pct}%</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="chart">
      <div className="chart__wrap">
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={68}
              dataKey="valor"
              strokeWidth={0}
            >
              {dados.map((_, index) => (
                <Cell key={index} fill={CORES[index % CORES.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {renderLegenda()}
      </div>
    </div>
  );
}

export default Chart;
