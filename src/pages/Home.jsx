import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  calcularTotalGastos,
  calcularTotalEntradas,
  calcularPorCategoria,
  maiorCategoria,
  calcularVariacaoMensal,
  calcularPorcentagens,
  detectarPadroes,
  gerarRecomendacoes,
  ultimas5Transacoes,
  formatarMoeda,
  calcularScore,
} from "../utils/calculations";
import CardResumo from "../components/CardResumo";
import CardCategoria from "../components/CardCategoria";
import Chart from "../components/Chart";
import Insights from "../components/Insights";
import TransactionList from "../components/TransactionList";
import { SkeletonHome } from "../components/Skeleton";
import imgSaldo from "../assets/saldo.png";
import imgGasto from "../assets/gasto.png";
import imgCategoria from "../assets/categoria.png";
import imgInvestimento from "../assets/investimento.png";
import { motion } from "framer-motion";
import { useTransacoes } from "../context/TransacoesContext";
import { getMesAnterior } from "../services/api";
import dadosDemo from "../data/gastos.json";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./Home.css";

const MESES = [
  { valor: "01", nome: "Janeiro" },
  { valor: "02", nome: "Fevereiro" },
  { valor: "03", nome: "Março" },
  { valor: "04", nome: "Abril" },
  { valor: "05", nome: "Maio" },
  { valor: "06", nome: "Junho" },
  { valor: "07", nome: "Julho" },
  { valor: "08", nome: "Agosto" },
  { valor: "09", nome: "Setembro" },
  { valor: "10", nome: "Outubro" },
  { valor: "11", nome: "Novembro" },
  { valor: "12", nome: "Dezembro" },
];

const CORES_BAR = ["#1A5A5A", "#589D99", "#90CFCB", "#D7B06B", "#F1D39F"];

function ScoreFinanceiro({ score, nivel, detalhes }) {
  const corVar =
    nivel === "ok"
      ? "var(--success)"
      : nivel === "warning"
        ? "var(--warning)"
        : "var(--danger)";
  const label =
    nivel === "ok" ? "Excelente" : nivel === "warning" ? "Regular" : "Atenção";
  const raio = 38;
  const circunf = 2 * Math.PI * raio;
  const offset = circunf - (score / 100) * circunf;

  return (
    <motion.section
      className="score"
      aria-label={`Score financeiro: ${score} de 100 — ${label}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p className="score__label">Score financeiro</p>

      <div className="score__corpo">
        <div className="score__anel-wrap" aria-hidden="true">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={raio}
              fill="none"
              stroke="var(--border)"
              strokeWidth="7"
            />
            <circle
              cx="48"
              cy="48"
              r={raio}
              fill="none"
              stroke={corVar}
              strokeWidth="7"
              strokeDasharray={circunf}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: "stroke-dashoffset 1.2s ease" }}
            />
            <text
              x="48"
              y="44"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="22"
              fontWeight="500"
              fontFamily="Quicksand"
            >
              {score}
            </text>
            <text
              x="48"
              y="58"
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="10"
            >
              de 100
            </text>
          </svg>
          <span className="score__nivel" style={{ color: corVar }}>
            {label}
          </span>
        </div>

        <ul className="score__itens" aria-label="Critérios do score financeiro">
          {detalhes.map(function (d, i) {
            return (
              <li
                key={i}
                className={`score__item ${d.ok ? "score__item--ok" : "score__item--nok"}`}
              >
                <span className="score__item-icone" aria-hidden="true">
                  {d.ok ? "✓" : "✕"}
                </span>
                <span className="score__item-texto">{d.texto}</span>
                <span className="score__item-pts">+{d.pts} pts</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="score__footer" aria-hidden="true">
        <span className="score__footer-label">0</span>
        <div className="score__barra">
          <div
            className="score__barra-fill"
            style={{ width: `${score}%`, background: corVar }}
          />
        </div>
        <span className="score__footer-total" style={{ color: corVar }}>
          {score} / 100
        </span>
      </div>
    </motion.section>
  );
}

// Fatores aleatórios gerados uma única vez fora do ciclo de render
const FATORES_PROJECAO = Array.from({ length: 6 }, function (_, i) {
  return i === 0 ? 1 : 1 + (Math.random() * 0.1 - 0.05);
});

function ProjecaoSemestral({ totalGastos, totalEntradas, mesAtual }) {
  const mesIdx = parseInt(mesAtual, 10) - 1;
  const dados = useMemo(
    function () {
      return Array.from({ length: 6 }, function (_, i) {
        const idx = (mesIdx + i) % 12;
        const fator = FATORES_PROJECAO[i];
        return {
          mes: MESES[idx].nome.substring(0, 3),
          gastos: parseFloat((totalGastos * fator).toFixed(2)),
          receita: parseFloat((totalEntradas * fator).toFixed(2)),
        };
      });
    },
    [mesIdx, totalGastos, totalEntradas],
  );

  return (
    <motion.section
      className="home__projecao"
      aria-label="Projeção semestral de gastos e receitas"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h3 className="home__secao-titulo">Projeção Semestral</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={dados}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={function (v) {
              return "R$" + (v / 1000).toFixed(0) + "k";
            }}
          />
          <Tooltip
            formatter={function (v) {
              return formatarMoeda(v);
            }}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="receita"
            stroke="var(--success)"
            strokeWidth={2}
            dot={false}
            name="Receita"
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="gastos"
            stroke="var(--danger)"
            strokeWidth={2}
            dot={false}
            name="Gastos"
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="home__projecao-legenda" aria-hidden="true">
        <span className="home__projecao-leg home__projecao-leg--receita">
          — Receita
        </span>
        <span className="home__projecao-leg home__projecao-leg--gastos">
          — Gastos
        </span>
      </div>
    </motion.section>
  );
}

function Home() {
  const { transacoes, carregando, isDemo, erro } = useTransacoes();
  const navigate = useNavigate();
  const [mesAnterior, setMesAnterior] = useState(dadosDemo.mesAnterior); // ← inicia com fallback, não null

  useEffect(function () {
    getMesAnterior()
      .then(setMesAnterior)
      .catch(function () {
        setMesAnterior(dadosDemo.mesAnterior);
      });
  }, []);

  const [mesIdx, setMesIdx] = useState(new Date().getMonth());
  const [percentualInvestimento] = useState(10);
  const [busca, setBusca] = useState("");

  if (carregando) return <SkeletonHome />;

  if (erro)
    return (
      <div className="home" role="alert">
        <div className="home__erro">
          <span aria-hidden="true">⚠️</span>
          <p>{erro}</p>
          <button
            onClick={function () {
              window.location.reload();
            }}
            className="home__erro-btn"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );

  const mesSelecionado = MESES[mesIdx].valor;
  const nomeMes = MESES[mesIdx].nome;

  const transacoesFiltradas = transacoes.filter(function (t) {
    return t.data && t.data.split("-")[1] === mesSelecionado;
  });

  const totalGastos = calcularTotalGastos(transacoesFiltradas);
  const totalEntradas = calcularTotalEntradas(transacoesFiltradas);
  const valorInvest = (totalEntradas * percentualInvestimento) / 100;
  const porCategoria = calcularPorCategoria(transacoesFiltradas);
  const [catNome] = maiorCategoria(porCategoria) || [];
  const porcentagens = calcularPorcentagens(porCategoria, totalGastos);
  const variacaoGastos = calcularVariacaoMensal(
    totalGastos,
    mesAnterior?.totalGastos || 0,
  );
  const padroes = detectarPadroes(transacoesFiltradas, mesAnterior || {});
  const recomendacoes = gerarRecomendacoes(
    porCategoria,
    totalGastos,
    mesAnterior || {},
    transacoesFiltradas,
  );

  const ultimas = ultimas5Transacoes(transacoesFiltradas);
  const ultimasFiltradas = busca.trim()
    ? ultimas.filter(function (t) {
        return (
          t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
          t.categoria.toLowerCase().includes(busca.toLowerCase())
        );
      })
    : ultimas;

  const qtdSaidas = transacoesFiltradas.filter(function (t) {
    return t.tipo === "saida";
  }).length;
  const ticketMedio = qtdSaidas > 0 ? totalGastos / qtdSaidas : 0;
  const saldo = totalEntradas - totalGastos;
  const {
    score,
    nivel: nivelScore,
    detalhes: detalhesScore,
  } = calcularScore(
    transacoesFiltradas,
    porCategoria,
    totalGastos,
    mesAnterior,
    {},
  );

  const topCategorias = Object.entries(porCategoria)
    .sort(function (a, b) {
      return b[1] - a[1];
    })
    .slice(0, 5)
    .map(function ([nome, valor]) {
      return {
        nome,
        valor: parseFloat(valor.toFixed(2)),
        pct:
          totalGastos > 0
            ? parseFloat(((valor / totalGastos) * 100).toFixed(1))
            : 0,
      };
    });

  return (
    <div className="home">
      {isDemo && (
        <motion.div
          className="home__demo-aviso"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span aria-hidden="true">👁️</span>
          <span>
            Você está vendo dados de demonstração.{" "}
            <button
              className="home__demo-btn"
              onClick={function () {
                navigate("/login");
              }}
            >
              Faça login
            </button>{" "}
            para ver e salvar seus dados reais.
          </span>
        </motion.div>
      )}

      {/* ─── Navegação de mês + busca ─── */}
      <div className="home__controles">
        <div className="home__mes-nav" role="group" aria-label="Selecionar mês">
          <button
            className="home__mes-btn"
            onClick={function () {
              setMesIdx(function (i) {
                return (i - 1 + 12) % 12;
              });
            }}
            aria-label="Mês anterior"
          >
            ←
          </button>
          <span
            className="home__mes-nome"
            aria-live="polite"
            aria-atomic="true"
          >
            {nomeMes} 2026
          </span>
          <button
            className="home__mes-btn"
            onClick={function () {
              setMesIdx(function (i) {
                return (i + 1) % 12;
              });
            }}
            aria-label="Próximo mês"
          >
            →
          </button>
        </div>

        <div className="home__busca-wrap">
          <label htmlFor="home-busca" className="sr-only">
            Buscar transação
          </label>
          <span className="home__busca-icone" aria-hidden="true">
            🔍
          </span>
          <input
            id="home-busca"
            className="home__busca"
            type="text"
            placeholder="Buscar transação..."
            value={busca}
            onChange={function (e) {
              setBusca(e.target.value);
            }}
          />
          {busca && (
            <button
              className="home__busca-limpar"
              onClick={function () {
                setBusca("");
              }}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─── Cards topo ─── */}
      <motion.div
        className="home__cards-topo"
        role="region"
        aria-label={`Resumo financeiro de ${nomeMes}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <CardResumo
          icone={imgSaldo}
          label="Receita do Mês"
          valor={formatarMoeda(totalEntradas)}
        />
        <CardResumo
          icone={imgGasto}
          label="Gasto do Mês"
          valor={formatarMoeda(totalGastos)}
          variacao={variacaoGastos}
        />
        <CardCategoria
          categoria={catNome}
          valor={porCategoria[catNome]}
          percentual={porcentagens[catNome]}
          iconePadrao={imgCategoria}
        />
        <CardResumo
          icone={imgInvestimento}
          label="Investimento"
          valor={`${percentualInvestimento}% • ${formatarMoeda(valorInvest)}`}
        />
      </motion.div>

      {/* ─── Indicadores ─── */}
      <motion.section
        className="home__ticket"
        aria-label="Indicadores financeiros do mês"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="home__ticket-card">
          <span className="home__ticket-label">🎫 Ticket Médio</span>
          <span className="home__ticket-valor">
            {formatarMoeda(ticketMedio)}
          </span>
          <span className="home__ticket-sub">{qtdSaidas} despesas no mês</span>
        </div>
        <div className="home__ticket-card">
          <span className="home__ticket-label">📊 Média Diária</span>
          <span className="home__ticket-valor">
            {formatarMoeda(totalGastos / 30)}
          </span>
          <span className="home__ticket-sub">estimativa por dia</span>
        </div>
        <div className="home__ticket-card">
          <span className="home__ticket-label">💰 Saldo do Mês</span>
          <span
            className={`home__ticket-valor ${saldo >= 0 ? "home__ticket-valor--ok" : "home__ticket-valor--danger"}`}
          >
            {formatarMoeda(saldo)}
          </span>
          <span className="home__ticket-sub">receita menos gastos</span>
        </div>
        <div
          className="home__ticket-card home__ticket-card--link"
          onClick={function () {
            navigate("/simulador");
          }}
          role="button"
          tabIndex={0}
          aria-label="Acessar o simulador financeiro"
          onKeyDown={function (e) {
            if (e.key === "Enter") navigate("/simulador");
          }}
        >
          <span className="home__ticket-label">🧮 Simulador</span>
          <span className="home__ticket-valor home__ticket-valor--accent">
            Planejar →
          </span>
          <span className="home__ticket-sub">simule seu futuro</span>
        </div>
      </motion.section>

      {/* ─── Gráfico + Insights ─── */}
      <div className="home__meio">
        <motion.div
          className="home__chart-card"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="home__secao-header">
            <h3 className="home__secao-titulo">Distribuição de Consumo (%)</h3>
            <button
              className="home__link-btn"
              onClick={function () {
                navigate("/analise");
              }}
              aria-label="Ver análise completa de gastos"
            >
              Ver análise →
            </button>
          </div>

          {Object.keys(porCategoria).length === 0 ? (
            <div className="home__vazio" role="status">
              <span aria-hidden="true">📊</span>
              <p>Nenhum gasto registrado em {nomeMes}.</p>
            </div>
          ) : (
            <>
              <Chart porCategoria={porCategoria} />

              {/* BarChart top categorias */}
              <div
                className="home__chart-bar"
                aria-label="Gráfico de top categorias"
              >
                <p className="home__chart-bar-titulo">Top Categorias</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={topCategorias}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="nome"
                      tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={function (v) {
                        return (
                          "R$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)
                        );
                      }}
                    />
                    <Tooltip
                      formatter={function (value, _name, props) {
                        return [
                          formatarMoeda(value),
                          `${props.payload.pct}% do total`,
                        ];
                      }}
                      contentStyle={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar
                      dataKey="valor"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                    >
                      {topCategorias.map(function (_, index) {
                        return (
                          <Cell
                            key={index}
                            fill={CORES_BAR[index % CORES_BAR.length]}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        <div className="home__insights-wrap">
          <div className="home__secao-header">
            <h3
              className="home__secao-titulo"
              style={{ fontSize: "var(--fs-sm)", paddingBottom: 0 }}
            >
              Insights
            </h3>
            <button
              className="home__link-btn"
              onClick={function () {
                navigate("/insights");
              }}
              aria-label="Ver todos os insights"
            >
              Ver todos →
            </button>
          </div>
          <Insights padroes={padroes} recomendacoes={recomendacoes} />
        </div>
      </div>

      {/* ─── Score + Projeção ─── */}
      <div className="home__score-projecao">
        <ScoreFinanceiro
          score={score}
          nivel={nivelScore}
          detalhes={detalhesScore}
        />
        <ProjecaoSemestral
          totalGastos={totalGastos}
          totalEntradas={totalEntradas}
          mesAtual={mesSelecionado}
        />
      </div>

      {/* ─── Últimas transações ─── */}
      <div>
        <div className="home__secao-header" style={{ marginBottom: "0.75rem" }}>
          <h3 className="home__secao-titulo" style={{ paddingBottom: 0 }}>
            Últimas Transações
          </h3>
          <button
            className="home__link-btn"
            onClick={function () {
              navigate("/transacoes");
            }}
            aria-label="Ver todas as transações"
          >
            Ver todas →
          </button>
        </div>
        <TransactionList transacoes={ultimasFiltradas} />
      </div>

      {/* ─── Atalhos rápidos ─── */}
      <motion.nav
        className="home__atalhos"
        aria-label="Atalhos rápidos para outras seções"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {[
          { label: "📊 Análise", sub: "Gráficos detalhados", to: "/analise" },
          {
            label: "💳 Transações",
            sub: "Histórico completo",
            to: "/transacoes",
          },
          { label: "🎯 Metas", sub: "Limites por categoria", to: "/metas" },
          {
            label: "📈 Investimentos",
            sub: "Planeje seu patrimônio",
            to: "/investimentos",
          },
          { label: "🧮 Simulador", sub: "Simule cenários", to: "/simulador" },
          { label: "💡 Insights", sub: "Padrões e dicas", to: "/insights" },
        ].map(function (a) {
          return (
            <button
              key={a.to}
              className="home__atalho"
              onClick={function () {
                navigate(a.to);
              }}
              aria-label={`Ir para ${a.label}`}
            >
              <span className="home__atalho-label">{a.label}</span>
              <span className="home__atalho-sub">{a.sub}</span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}

export default Home;
