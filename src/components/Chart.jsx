import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import "./Chart.css";

const CORES = ["#1A5A5A", "#589D99", "#90CFCB", "#D7B06B", "#F1D39F"];

function Chart({ porCategoria }) {
  const dados = Object.entries(porCategoria).map(([nome, valor]) => ({
    nome,
    valor: parseFloat(valor.toFixed(2)),
  }));

  const total = dados.reduce((acc, d) => acc + d.valor, 0);

  return (
    <motion.div
      className="chart"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      <div className="chart__wrap">
        <div className="chart__donut">
          <PieChart width={240} height={240}>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
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
        </div>

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
      </div>
    </motion.div>
  );
}

export default Chart;
