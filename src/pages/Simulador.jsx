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
import { useNavigate } from "react-router-dom";
import "./Simulador.css";

const MODOS = [
  {
    id: "meta",
    label: "🎯 Atingir uma meta",
    desc: "Quanto preciso guardar por mês?",
  },
  {
    id: "mensal",
    label: "💰 Simular poupança",
    desc: "Quanto terei guardando X por mês?",
  },
  {
    id: "reducao",
    label: "✂️ Reduzir gastos",
    desc: "Quanto economizo cortando X categoria?",
  },
];

function gerarProjecaoMeta(valorMensal, meta) {
  const meses = Math.ceil(meta / valorMensal);
  const limitado = Math.min(meses, 60);
  let acumulado = 0;
  return Array.from({ length: limitado }, function (_, i) {
    acumulado = Math.min(acumulado + valorMensal, meta);
    return {
      mes: "Mês " + (i + 1),
      acumulado: parseFloat(acumulado.toFixed(2)),
      meta,
    };
  });
}

function gerarProjecaoMensal(valorMensal, meses, taxa) {
  let acumulado = 0;
  return Array.from({ length: meses }, function (_, i) {
    acumulado = (acumulado + valorMensal) * (1 + taxa);
    return {
      mes: "Mês " + (i + 1),
      acumulado: parseFloat(acumulado.toFixed(2)),
      aportado: parseFloat(((i + 1) * valorMensal).toFixed(2)),
    };
  });
}

function Simulador() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("meta");

  // modo meta
  const [meta, setMeta] = useState("");
  const [prazo, setPrazo] = useState("");

  // modo mensal
  const [poupancaMensal, setPoupancaMensal] = useState("");
  const [mesesSim, setMesesSim] = useState("12");
  const [taxaSim, setTaxaSim] = useState("0.01");

  // modo reducao
  const [gastoAtual, setGastoAtual] = useState("");
  const [percentualCorte, setPercentualCorte] = useState("");
  const [nomeCategoria, setNomeCategoria] = useState("Alimentação");

  const [resultado, setResultado] = useState(null);
  const [projecao, setProjecao] = useState([]);

  function simular() {
    if (modo === "meta") {
      const m = parseFloat(meta);
      const p = parseInt(prazo);
      if (!m || !p || p <= 0) return;
      const necessario = m / p;
      const dados = gerarProjecaoMeta(necessario, m);
      setProjecao(dados);
      setResultado({
        tipo: "meta",
        principal: formatarMoeda(necessario) + "/mês",
        desc: "Para atingir " + formatarMoeda(m) + " em " + p + " meses",
        detalhe: "Total a poupar: " + formatarMoeda(m),
        ok: true,
      });
    } else if (modo === "mensal") {
      const v = parseFloat(poupancaMensal);
      const m = parseInt(mesesSim);
      const t = parseFloat(taxaSim);
      if (!v || !m) return;
      const dados = gerarProjecaoMensal(v, m, t);
      const total = dados[dados.length - 1]?.acumulado || 0;
      const aportado = v * m;
      const rendimento = total - aportado;
      setProjecao(dados);
      setResultado({
        tipo: "mensal",
        principal: formatarMoeda(total),
        desc: "Patrimônio em " + m + " meses",
        detalhe: "Rendimento estimado: " + formatarMoeda(rendimento),
        ok: true,
      });
    } else {
      const g = parseFloat(gastoAtual);
      const p = parseFloat(percentualCorte);
      if (!g || !p) return;
      const economiaMensal = g * (p / 100);
      const economiaAnual = economiaMensal * 12;
      const dados = Array.from({ length: 12 }, function (_, i) {
        return {
          mes: "Mês " + (i + 1),
          economizado: parseFloat(((i + 1) * economiaMensal).toFixed(2)),
          semCorte: parseFloat(((i + 1) * g).toFixed(2)),
        };
      });
      setProjecao(dados);
      setResultado({
        tipo: "reducao",
        principal: formatarMoeda(economiaMensal) + "/mês",
        desc: "Economia cortando " + p + "% em " + nomeCategoria,
        detalhe: "Em 1 ano: " + formatarMoeda(economiaAnual),
        ok: true,
      });
    }
  }

  function limpar() {
    setResultado(null);
    setProjecao([]);
    setMeta("");
    setPrazo("");
    setPoupancaMensal("");
    setMesesSim("12");
    setGastoAtual("");
    setPercentualCorte("");
  }

  const TooltipCustom = function (props) {
    if (!props.active || !props.payload || !props.payload.length) return null;
    return (
      <div className="sim__tooltip">
        <p className="sim__tooltip-label">{props.label}</p>
        {props.payload.map(function (p, i) {
          return (
            <p
              key={i}
              style={{ color: p.color }}
              className="sim__tooltip-valor"
            >
              {p.name}: {formatarMoeda(p.value)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="sim">
      <motion.div
        className="sim__topo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="sim__titulo">Simulador Financeiro</h2>
          <p className="sim__subtitulo">
            Planeje seu futuro financeiro com simulações inteligentes
          </p>
        </div>
        <button
          className="sim__btn-voltar"
          onClick={function () {
            navigate("/dashboard");
          }}
          aria-label="Voltar ao dashboard"
        >
          ← Dashboard
        </button>
      </motion.div>

      {/* Seletor de modo */}
      <motion.div
        className="sim__modos"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        role="group"
        aria-label="Tipo de simulação"
      >
        {MODOS.map(function (m) {
          return (
            <button
              key={m.id}
              className={"sim__modo-btn " + (modo === m.id ? "ativo" : "")}
              onClick={function () {
                setModo(m.id);
                limpar();
              }}
              aria-pressed={modo === m.id}
            >
              <span className="sim__modo-label">{m.label}</span>
              <span className="sim__modo-desc">{m.desc}</span>
            </button>
          );
        })}
      </motion.div>

      <div className="sim__corpo">
        {/* Formulário */}
        <motion.div
          className="sim__form"
          key={modo}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="sim__form-titulo">
            {modo === "meta" && "Definir meta financeira"}
            {modo === "mensal" && "Simular poupança mensal"}
            {modo === "reducao" && "Simular redução de gastos"}
          </h3>

          {modo === "meta" && (
            <div className="sim__campos">
              <div className="sim__campo">
                <label htmlFor="sim-meta" className="sim__label">
                  Quanto quero atingir (R$)
                </label>
                <input
                  id="sim-meta"
                  className="sim__input"
                  type="number"
                  min="0"
                  placeholder="Ex: 10000"
                  value={meta}
                  onChange={function (e) {
                    setMeta(e.target.value);
                  }}
                />
              </div>
              <div className="sim__campo">
                <label htmlFor="sim-prazo" className="sim__label">
                  Em quantos meses?
                </label>
                <input
                  id="sim-prazo"
                  className="sim__input"
                  type="number"
                  min="1"
                  placeholder="Ex: 12"
                  value={prazo}
                  onChange={function (e) {
                    setPrazo(e.target.value);
                  }}
                />
              </div>
              {meta && prazo && (
                <div className="sim__preview">
                  💡 Você precisará guardar{" "}
                  <strong>
                    {formatarMoeda(parseFloat(meta) / parseInt(prazo))}/mês
                  </strong>
                </div>
              )}
            </div>
          )}

          {modo === "mensal" && (
            <div className="sim__campos">
              <div className="sim__campo">
                <label htmlFor="sim-valor" className="sim__label">
                  Quanto guardar por mês (R$)
                </label>
                <input
                  id="sim-valor"
                  className="sim__input"
                  type="number"
                  min="0"
                  placeholder="Ex: 500"
                  value={poupancaMensal}
                  onChange={function (e) {
                    setPoupancaMensal(e.target.value);
                  }}
                />
              </div>
              <div className="sim__campo">
                <label htmlFor="sim-meses" className="sim__label">
                  Por quantos meses?
                </label>
                <select
                  id="sim-meses"
                  className="sim__select"
                  value={mesesSim}
                  onChange={function (e) {
                    setMesesSim(e.target.value);
                  }}
                >
                  <option value="6">6 meses</option>
                  <option value="12">1 ano</option>
                  <option value="24">2 anos</option>
                  <option value="36">3 anos</option>
                  <option value="60">5 anos</option>
                </select>
              </div>
              <div className="sim__campo">
                <label htmlFor="sim-taxa" className="sim__label">
                  Tipo de investimento
                </label>
                <select
                  id="sim-taxa"
                  className="sim__select"
                  value={taxaSim}
                  onChange={function (e) {
                    setTaxaSim(e.target.value);
                  }}
                >
                  <option value="0.005">🐷 Poupança (0.5%/mês)</option>
                  <option value="0.008">🏦 Renda Fixa (0.8%/mês)</option>
                  <option value="0.01">💼 Fundos (1%/mês)</option>
                  <option value="0.015">📈 Ações (1.5%/mês)</option>
                  <option value="0">📦 Sem rendimento</option>
                </select>
              </div>
            </div>
          )}

          {modo === "reducao" && (
            <div className="sim__campos">
              <div className="sim__campo">
                <label htmlFor="sim-cat" className="sim__label">
                  Categoria
                </label>
                <select
                  id="sim-cat"
                  className="sim__select"
                  value={nomeCategoria}
                  onChange={function (e) {
                    setNomeCategoria(e.target.value);
                  }}
                >
                  {[
                    "Alimentação",
                    "Lazer",
                    "Moradia",
                    "Transporte",
                    "Saúde",
                    "Outros",
                  ].map(function (c) {
                    return (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="sim__campo">
                <label htmlFor="sim-gasto" className="sim__label">
                  Gasto atual nessa categoria (R$)
                </label>
                <input
                  id="sim-gasto"
                  className="sim__input"
                  type="number"
                  min="0"
                  placeholder="Ex: 800"
                  value={gastoAtual}
                  onChange={function (e) {
                    setGastoAtual(e.target.value);
                  }}
                />
              </div>
              <div className="sim__campo">
                <label htmlFor="sim-corte" className="sim__label">
                  Quanto quer reduzir (%)
                </label>
                <input
                  id="sim-corte"
                  className="sim__input"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Ex: 20"
                  value={percentualCorte}
                  onChange={function (e) {
                    setPercentualCorte(e.target.value);
                  }}
                />
              </div>
              {gastoAtual && percentualCorte && (
                <div className="sim__preview">
                  💡 Economia de{" "}
                  <strong>
                    {formatarMoeda(
                      parseFloat(gastoAtual) *
                        (parseFloat(percentualCorte) / 100),
                    )}
                    /mês
                  </strong>
                </div>
              )}
            </div>
          )}

          <button
            className="sim__btn-simular"
            onClick={simular}
            aria-label="Executar simulação"
          >
            Simular agora →
          </button>
        </motion.div>

        {/* Resultado */}
        <AnimatePresence>
          {resultado && (
            <motion.div
              className="sim__resultado"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="sim__resultado-destaque">
                <span className="sim__resultado-label">{resultado.desc}</span>
                <span className="sim__resultado-valor">
                  {resultado.principal}
                </span>
                <span className="sim__resultado-detalhe">
                  {resultado.detalhe}
                </span>
              </div>

              {projecao.length > 0 && (
                <div className="sim__grafico">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                      data={projecao}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="mes"
                        tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval={Math.floor(projecao.length / 5)}
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
                      <Tooltip content={TooltipCustom} />
                      {resultado.tipo === "meta" && (
                        <>
                          <ReferenceLine
                            y={parseFloat(meta)}
                            stroke="var(--accent)"
                            strokeDasharray="4 4"
                            label={{
                              value: "Meta",
                              fill: "var(--accent)",
                              fontSize: 10,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="acumulado"
                            stroke="var(--success)"
                            strokeWidth={2.5}
                            dot={false}
                            name="Acumulado"
                            animationDuration={1200}
                          />
                        </>
                      )}
                      {resultado.tipo === "mensal" && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="acumulado"
                            stroke="var(--success)"
                            strokeWidth={2.5}
                            dot={false}
                            name="Com rendimento"
                            animationDuration={1200}
                          />
                          <Line
                            type="monotone"
                            dataKey="aportado"
                            stroke="var(--accent)"
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Aportado"
                            animationDuration={1200}
                          />
                        </>
                      )}
                      {resultado.tipo === "reducao" && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="economizado"
                            stroke="var(--success)"
                            strokeWidth={2.5}
                            dot={false}
                            name="Com corte"
                            animationDuration={1200}
                          />
                          <Line
                            type="monotone"
                            dataKey="semCorte"
                            stroke="var(--danger)"
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Sem corte"
                            animationDuration={1200}
                          />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <button
                className="sim__btn-limpar"
                onClick={limpar}
                aria-label="Limpar simulação"
              >
                Fazer nova simulação
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Simulador;
