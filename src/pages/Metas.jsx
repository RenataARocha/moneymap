import { useState } from "react";
import dados from "../data/gastos.json"; // PROVISÓRIO
import { calcularPorCategoria, formatarMoeda } from "../utils/calculations"; // PROVISÓRIO
import "./Metas.css";

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Outros: "📦",
};

const limitesPadrao = {
  Alimentação: 30,
  Lazer: 10,
  Moradia: 50,
  Transporte: 10,
  Saúde: 10,
};

function Metas() {
  const { transacoes } = dados;
  const porCategoria = calcularPorCategoria(transacoes);
  const totalGastos = Object.values(porCategoria).reduce((a, b) => a + b, 0);

  // ─── cálculos de investimento (fora do map) ───────────
  const totalReceita = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);
  const saldoDisponivel = totalReceita - totalGastos;

  const [limites, setLimites] = useState(() => {
    const salvo = localStorage.getItem("mm-metas");
    return salvo ? JSON.parse(salvo) : limitesPadrao;
  });
  const [metaInvestimento, setMetaInvestimento] = useState(() =>
    parseFloat(localStorage.getItem("mm-meta-invest") || "20"),
  );
  const [editandoInvest, setEditandoInvest] = useState(false);
  const [investTemp, setInvestTemp] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorTemp, setValorTemp] = useState("");
  const [salvo, setSalvo] = useState(false);

  const valorMetaInvest = (totalReceita * metaInvestimento) / 100;
  const progressoInvest =
    valorMetaInvest > 0
      ? Math.min((saldoDisponivel / valorMetaInvest) * 100, 100)
      : 0;
  const statusInvest =
    progressoInvest >= 100
      ? "ok"
      : progressoInvest >= 60
        ? "warning"
        : "danger";

  const mensagemInvest = () => {
    if (progressoInvest >= 100)
      return `✅ Ótimo! Você tem saldo suficiente para investir ${formatarMoeda(valorMetaInvest)} esse mês.`;
    if (progressoInvest >= 60)
      return `⚠️ Atenção! Você tem ${formatarMoeda(saldoDisponivel)} disponível. Sua meta é ${formatarMoeda(valorMetaInvest)}.`;
    return `🚨 Seus gastos estão altos. Sobrou apenas ${formatarMoeda(saldoDisponivel)} para investir.`;
  };

  function salvarInvestimento() {
    const val = parseFloat(investTemp) || 0;
    setMetaInvestimento(val);
    localStorage.setItem("mm-meta-invest", val);
    setEditandoInvest(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  function handleEditar(cat) {
    setEditando(cat);
    setValorTemp(limites[cat] || "");
  }

  function handleConfirmar(cat) {
    const novo = { ...limites, [cat]: parseFloat(valorTemp) || 0 };
    setLimites(novo);
    localStorage.setItem("mm-metas", JSON.stringify(novo));
    setEditando(null);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  return (
    <div className="metas">
      <div className="metas__topo">
        <div>
          <h2 className="metas__titulo">Metas</h2>
          <p className="metas__subtitulo">
            Defina limites de gasto por categoria
          </p>
        </div>
        {salvo && <span className="metas__salvo">✅ Meta salva!</span>}
      </div>

      {/* ─── Card de Investimento ─── */}
      <div className={`metas__invest-card metas__invest-card--${statusInvest}`}>
        <div className="metas__invest-top">
          <div className="metas__invest-left">
            <div className="metas__invest-icone">📈</div>
            <div>
              <span className="metas__invest-titulo">Meta de Investimento</span>
              <span className="metas__invest-sub">
                Separe parte da sua receita para investir todo mês
              </span>
            </div>
          </div>
          <div className="metas__invest-right">
            {editandoInvest ? (
              <div className="metas__edit">
                <input
                  className="metas__input"
                  type="number"
                  min="0"
                  max="100"
                  value={investTemp}
                  onChange={(e) => setInvestTemp(e.target.value)}
                  autoFocus
                />
                <span className="metas__edit-prefix">%</span>
                <button className="metas__btn-ok" onClick={salvarInvestimento}>
                  ✓
                </button>
              </div>
            ) : (
              <div className="metas__invest-valor-wrap">
                <span className="metas__invest-pct">{metaInvestimento}%</span>
                <span className="metas__invest-reais">
                  {formatarMoeda(valorMetaInvest)}/mês
                </span>
                <button
                  className="metas__btn-editar"
                  onClick={() => {
                    setEditandoInvest(true);
                    setInvestTemp(metaInvestimento);
                  }}
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="metas__invest-progresso-wrap">
          <div className="metas__progresso">
            <div
              className={`metas__progresso-fill metas__progresso-fill--${statusInvest}`}
              style={{ width: `${progressoInvest}%` }}
            />
          </div>
          <span className={`metas__pct metas__pct--${statusInvest}`}>
            {mensagemInvest()}
          </span>
        </div>

        <div className="metas__invest-resumo">
          <div className="metas__invest-item">
            <span className="metas__invest-item-label">Receita do mês</span>
            <span className="metas__invest-item-valor">
              {formatarMoeda(totalReceita)}
            </span>
          </div>
          <div className="metas__invest-item">
            <span className="metas__invest-item-label">Total gasto</span>
            <span className="metas__invest-item-valor">
              {formatarMoeda(totalGastos)}
            </span>
          </div>
          <div className="metas__invest-item">
            <span className="metas__invest-item-label">Saldo disponível</span>
            <span
              className={`metas__invest-item-valor metas__pct--${statusInvest}`}
            >
              {formatarMoeda(saldoDisponivel)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Lista de categorias ─── */}
      <div className="metas__lista">
        {Object.keys(porCategoria).map((cat) => {
          const gasto = porCategoria[cat] || 0;
          const limite = limites[cat] || 0;
          const percentualAtual =
            totalGastos > 0 ? (gasto / totalGastos) * 100 : 0;
          const percentualMeta =
            limite > 0 ? Math.min((percentualAtual / limite) * 100, 100) : 0;
          const status =
            percentualMeta >= 100
              ? "danger"
              : percentualMeta >= 80
                ? "warning"
                : "ok";

          return (
            <div key={cat} className={`metas__card metas__card--${status}`}>
              <div className="metas__card-topo">
                <div className="metas__card-info">
                  <div className="metas__icone">
                    {iconesPorCategoria[cat] || "📦"}
                  </div>
                  <div>
                    <span className="metas__cat-nome">{cat}</span>
                    <span className="metas__cat-gasto">
                      {percentualAtual.toFixed(1)}% do total —{" "}
                      {formatarMoeda(gasto)}
                    </span>
                  </div>
                </div>
                <div className="metas__card-limite">
                  {editando === cat ? (
                    <div className="metas__edit">
                      <input
                        className="metas__input"
                        type="number"
                        min="0"
                        max="100"
                        value={valorTemp}
                        onChange={(e) => setValorTemp(e.target.value)}
                        autoFocus
                      />
                      <span className="metas__edit-prefix">%</span>
                      <button
                        className="metas__btn-ok"
                        onClick={() => handleConfirmar(cat)}
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="metas__limite-wrap">
                      <span className="metas__limite-valor">
                        Limite: {limite > 0 ? `${limite}%` : "—"}
                      </span>
                      <button
                        className="metas__btn-editar"
                        onClick={() => handleEditar(cat)}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {limite > 0 && (
                <div className="metas__progresso-wrap">
                  <div className="metas__progresso">
                    <div
                      className={`metas__progresso-fill metas__progresso-fill--${status}`}
                      style={{ width: `${percentualMeta}%` }}
                    />
                  </div>
                  <span className={`metas__pct metas__pct--${status}`}>
                    {percentualAtual.toFixed(1)}% de {limite}% definido
                    {status === "danger" && " ⚠️ Limite atingido!"}
                    {status === "warning" && " ⚠️ Atenção!"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Metas;
