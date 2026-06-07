import { useState } from "react";
import { formatarMoeda } from "../utils/calculations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTransacoes } from "../context/TransacoesContext";
import "./Investimentos.css";

const hoje = new Date();
const MES_ATUAL = String(hoje.getMonth() + 1).padStart(2, "0");
const ANO_ATUAL = String(hoje.getFullYear());

const TIPOS_INVESTIMENTO = [
  { id: "renda_fixa", label: "Renda Fixa", icone: "🏦", taxa: 0.01 },
  { id: "acoes", label: "Ações", icone: "📈", taxa: 0.015 },
  { id: "fundos", label: "Fundos", icone: "💼", taxa: 0.008 },
  { id: "cripto", label: "Cripto", icone: "₿", taxa: 0.02 },
  { id: "poupanca", label: "Poupança", icone: "🐷", taxa: 0.005 },
];

function gerarProjecao(valorMensal, meses, taxaMensal) {
  let acumulado = 0;
  return Array.from({ length: meses }, function (_, i) {
    acumulado = (acumulado + valorMensal) * (1 + taxaMensal);
    return {
      mes: "Mês " + (i + 1),
      valor: parseFloat(acumulado.toFixed(2)),
      aportado: parseFloat(((i + 1) * valorMensal).toFixed(2)),
    };
  });
}

function Investimentos() {
  const { autenticado } = useAuth();
  const navigate = useNavigate();
  const { transacoes } = useTransacoes();

  const totalReceita = transacoes
    .filter(function (t) {
      if (!t.data) return false;
      const [ano, mes] = t.data.split("-");
      return t.tipo === "entrada" && mes === MES_ATUAL && ano === ANO_ATUAL;
    })
    .reduce(function (acc, t) {
      return acc + t.valor;
    }, 0);

  const totalGastos = transacoes
    .filter(function (t) {
      if (!t.data) return false;
      const [ano, mes] = t.data.split("-");
      return t.tipo === "saida" && mes === MES_ATUAL && ano === ANO_ATUAL;
    })
    .reduce(function (acc, t) {
      return acc + t.valor;
    }, 0);

  const saldoDisponivel = totalReceita - totalGastos;

  const [percentual, setPercentual] = useState(function () {
    return parseFloat(localStorage.getItem("mm-invest-pct") || "20");
  });
  const [tipoSelecionado, setTipoSelecionado] = useState("renda_fixa");
  const [mesesProjecao, setMesesProjecao] = useState(12);
  const [editandoPct, setEditandoPct] = useState(false);
  const [pctTemp, setPctTemp] = useState("");
  const [salvo, setSalvo] = useState(false);

  const tipo = TIPOS_INVESTIMENTO.find(function (t) {
    return t.id === tipoSelecionado;
  });
  const valorMensal = (totalReceita * percentual) / 100;
  const projecao = gerarProjecao(valorMensal, mesesProjecao, tipo.taxa);
  const totalAcumulado = projecao[projecao.length - 1]?.valor || 0;
  const totalAportado = valorMensal * mesesProjecao;
  const rendimento = totalAcumulado - totalAportado;

  const statusInvest =
    saldoDisponivel >= valorMensal
      ? "ok"
      : saldoDisponivel >= valorMensal * 0.6
        ? "warning"
        : "danger";

  function salvarPercentual() {
    if (!autenticado) {
      navigate("/login");
      return;
    }
    const val = Math.min(Math.max(parseFloat(pctTemp) || 0, 0), 100);
    setPercentual(val);
    localStorage.setItem("mm-invest-pct", String(val));
    setEditandoPct(false);
    setSalvo(true);
    setTimeout(function () {
      setSalvo(false);
    }, 2000);
  }

  const TooltipCustom = function (props) {
    if (!props.active || !props.payload || !props.payload.length) return null;
    return (
      <div className="invest__tooltip">
        <p className="invest__tooltip-label">{props.label}</p>
        <p className="invest__tooltip-valor">
          Acumulado: {formatarMoeda(props.payload[0]?.value || 0)}
        </p>
        <p className="invest__tooltip-aportado">
          Aportado: {formatarMoeda(props.payload[1]?.value || 0)}
        </p>
      </div>
    );
  };

  return (
    <div className="invest">
      {/* ─── Topo ─── */}
      <motion.div
        className="invest__topo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          <h2 className="invest__titulo">Investimentos</h2>
          <p className="invest__subtitulo">Planeje e projete seu patrimônio</p>
        </div>
        <AnimatePresence>
          {salvo && (
            <motion.span
              className="invest__salvo"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span aria-hidden="true">✅</span> Salvo!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Cards resumo ─── */}
      <motion.div
        className="invest__resumo"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="invest__resumo-card">
          <dt className="invest__resumo-label">Receita do mês</dt>
          <dd className="invest__resumo-valor">
            {formatarMoeda(totalReceita)}
          </dd>
        </div>
        <div className="invest__resumo-card">
          <dt className="invest__resumo-label">Saldo disponível</dt>
          <dd
            className={
              "invest__resumo-valor invest__resumo-valor--" + statusInvest
            }
          >
            {formatarMoeda(saldoDisponivel)}
          </dd>
        </div>
        <div className="invest__resumo-card invest__resumo-card--destaque">
          <dt className="invest__resumo-label">Aporte mensal</dt>
          <dd className="invest__resumo-valor invest__resumo-valor--accent">
            {formatarMoeda(valorMensal)}
          </dd>
          <dd className="invest__resumo-pct">{percentual}% da receita</dd>
        </div>
        <div className="invest__resumo-card">
          <dt className="invest__resumo-label">
            Projeção {mesesProjecao} meses
          </dt>
          <dd className="invest__resumo-valor invest__resumo-valor--ok">
            {formatarMoeda(totalAcumulado)}
          </dd>
        </div>
      </motion.div>

      {/* ─── Configuração ─── */}
      <motion.div
        className="invest__config"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Percentual */}
        <div className="invest__config-card">
          <h3 className="invest__config-titulo">💰 Quanto investir?</h3>
          <p className="invest__config-sub">Percentual da sua receita mensal</p>
          {editandoPct ? (
            <div className="invest__config-edit">
              <label htmlFor="input-pct" className="sr-only">
                Percentual de investimento
              </label>
              <input
                id="input-pct"
                className="invest__input"
                type="number"
                min="0"
                max="100"
                value={pctTemp}
                onChange={function (e) {
                  setPctTemp(e.target.value);
                }}
                autoFocus
              />
              <span className="invest__input-suffix">%</span>
              <button
                className="invest__btn-ok"
                onClick={salvarPercentual}
                aria-label="Confirmar percentual"
              >
                ✓
              </button>
            </div>
          ) : (
            <div className="invest__config-valor">
              <span className="invest__config-num">{percentual}%</span>
              <span className="invest__config-reais">
                {formatarMoeda(valorMensal)}/mês
              </span>
              <button
                className="invest__btn-editar"
                onClick={function () {
                  setEditandoPct(true);
                  setPctTemp(percentual);
                }}
                aria-label="Editar percentual de investimento"
              >
                ✏️
              </button>
            </div>
          )}

          {statusInvest === "danger" && (
            <p className="invest__alerta">
              ⚠️ Saldo insuficiente para esse aporte. Reduza os gastos ou o
              percentual.
            </p>
          )}
        </div>

        {/* Tipo de investimento */}
        <div className="invest__config-card">
          <h3 className="invest__config-titulo">📊 Tipo de investimento</h3>
          <p className="invest__config-sub">
            Selecione para simular o rendimento
          </p>
          <div
            className="invest__tipos"
            role="group"
            aria-label="Tipos de investimento"
          >
            {TIPOS_INVESTIMENTO.map(function (t) {
              return (
                <button
                  key={t.id}
                  className={
                    "invest__tipo-btn " +
                    (tipoSelecionado === t.id ? "ativo" : "")
                  }
                  onClick={function () {
                    setTipoSelecionado(t.id);
                  }}
                  aria-pressed={tipoSelecionado === t.id}
                  aria-label={
                    t.label +
                    ", rendimento mensal de " +
                    (t.taxa * 100).toFixed(1) +
                    " por cento"
                  }
                >
                  <span className="invest__tipo-icone" aria-hidden="true">
                    {t.icone}
                  </span>
                  <span className="invest__tipo-label">{t.label}</span>
                  <span className="invest__tipo-taxa">
                    +{(t.taxa * 100).toFixed(1)}%/mês
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Período */}
        <div className="invest__config-card">
          <h3 className="invest__config-titulo">📅 Período da projeção</h3>
          <p className="invest__config-sub">Quantos meses quer simular?</p>
          <div
            className="invest__periodos"
            role="group"
            aria-label="Período de projeção"
          >
            {[6, 12, 24, 36, 60].map(function (m) {
              return (
                <button
                  key={m}
                  className={
                    "invest__periodo-btn " +
                    (mesesProjecao === m ? "ativo" : "")
                  }
                  onClick={function () {
                    setMesesProjecao(m);
                  }}
                  aria-pressed={mesesProjecao === m}
                  aria-label={
                    "Projetar por " +
                    (m >= 12
                      ? m / 12 + (m > 12 ? " anos" : " ano")
                      : m + " meses")
                  }
                >
                  {m >= 12
                    ? m / 12 + " ano" + (m > 12 ? "s" : "")
                    : m + " meses"}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── Gráfico de projeção ─── */}
      <motion.div
        className="invest__grafico-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="invest__grafico-topo">
          <h3 className="invest__grafico-titulo">
            Projeção de crescimento — {tipo.icone} {tipo.label}
          </h3>
          <div className="invest__grafico-legenda">
            <span className="invest__legenda-item invest__legenda-item--acumulado">
              <span className="invest__legenda-cor" aria-hidden="true" />
              Patrimônio acumulado
            </span>
            <span className="invest__legenda-item invest__legenda-item--aportado">
              <span className="invest__legenda-cor" aria-hidden="true" />
              Total aportado
            </span>
          </div>
        </div>

        <div
          role="img"
          aria-label={
            "Gráfico de projeção de crescimento em " +
            tipo.label +
            " por " +
            mesesProjecao +
            " meses. " +
            "Patrimônio estimado: " +
            formatarMoeda(totalAcumulado) +
            ". " +
            "Rendimento estimado: " +
            formatarMoeda(rendimento) +
            "."
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={projecao}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
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
                interval={Math.floor(mesesProjecao / 6)}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={function (v) {
                  return "R$" + (v / 1000).toFixed(0) + "k";
                }}
              />
              <Tooltip content={TooltipCustom} />
              <ReferenceLine
                y={totalAportado}
                stroke="var(--text-muted)"
                strokeDasharray="4 4"
                label={{
                  value: "Aportado",
                  fill: "var(--text-muted)",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="var(--success)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "var(--success)" }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="aportado"
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ─── Resumo da projeção ─── */}
      <motion.dl
        className="invest__resultado"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="invest__resultado-item">
          <dt className="invest__resultado-label">Total aportado</dt>
          <dd className="invest__resultado-valor">
            {formatarMoeda(totalAportado)}
          </dd>
        </div>
        <div className="invest__resultado-item">
          <dt className="invest__resultado-label">Rendimento estimado</dt>
          <dd className="invest__resultado-valor invest__resultado-valor--ok">
            + {formatarMoeda(rendimento)}
          </dd>
        </div>
        <div className="invest__resultado-item invest__resultado-item--destaque">
          <dt className="invest__resultado-label">Patrimônio final</dt>
          <dd className="invest__resultado-valor invest__resultado-valor--accent">
            {formatarMoeda(totalAcumulado)}
          </dd>
        </div>
      </motion.dl>
    </div>
  );
}

export default Investimentos;
