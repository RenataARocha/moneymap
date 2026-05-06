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
  Alimentação: 600,
  Lazer: 200,
  Moradia: 1000,
  Transporte: 200,
  Saúde: 150,
};

function Metas() {
  const { transacoes } = dados;
  const porCategoria = calcularPorCategoria(transacoes);

  const [limites, setLimites] = useState(() => {
    const salvo = localStorage.getItem("mm-metas");
    return salvo ? JSON.parse(salvo) : limitesPadrao;
  });
  const [editando, setEditando] = useState(null);
  const [valorTemp, setValorTemp] = useState("");
  const [salvo, setSalvo] = useState(false);

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
      <div className="metas__header">
        <div>
          <h2 className="metas__titulo">Metas</h2>
          <p className="metas__subtitulo">
            Defina limites de gasto por categoria
          </p>
        </div>
        {salvo && <span className="metas__salvo">✅ Meta salva!</span>}
      </div>

      <div className="metas__lista">
        {Object.keys(porCategoria).map((cat) => {
          const gasto = porCategoria[cat] || 0;
          const limite = limites[cat] || 0;
          const percentual =
            limite > 0 ? Math.min((gasto / limite) * 100, 100) : 0;
          const status =
            percentual >= 100 ? "danger" : percentual >= 80 ? "warning" : "ok";

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
                      Gasto: {formatarMoeda(gasto)}
                    </span>
                  </div>
                </div>
                <div className="metas__card-limite">
                  {editando === cat ? (
                    <div className="metas__edit">
                      <span className="metas__edit-prefix">R$</span>
                      <input
                        className="metas__input"
                        type="number"
                        value={valorTemp}
                        onChange={(e) => setValorTemp(e.target.value)}
                        autoFocus
                      />
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
                        Limite: {limite > 0 ? formatarMoeda(limite) : "—"}
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
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <span className={`metas__pct metas__pct--${status}`}>
                    {percentual.toFixed(0)}%
                    {status === "danger" && " ⚠️ Limite atingido!"}
                    {status === "warning" && " Atenção!"}
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
