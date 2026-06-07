import { useState } from "react";
import { calcularPorCategoria, formatarMoeda } from "../utils/calculations";
import "./Metas.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTransacoes } from "../context/TransacoesContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const { transacoes } = useTransacoes();
  const { autenticado } = useAuth();
  const navigate = useNavigate();
  const porCategoria = calcularPorCategoria(transacoes);
  const totalGastos = Object.values(porCategoria).reduce((a, b) => a + b, 0);

  const [limites, setLimites] = useState(function () {
    const salvo = localStorage.getItem("mm-metas");
    if (!salvo) return limitesPadrao;

    const parsed = JSON.parse(salvo);
    const temValorInvalido = Object.values(parsed).some(function (v) {
      return v > 100;
    });

    if (temValorInvalido) {
      localStorage.removeItem("mm-metas");
      return limitesPadrao;
    }

    return parsed;
  });

  const [metaEconomia, setMetaEconomia] = useState(function () {
    return parseFloat(localStorage.getItem("mm-meta-economia") || "500");
  });

  const [editandoEconomia, setEditandoEconomia] = useState(false);
  const [economiaTemp, setEconomiaTemp] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorTemp, setValorTemp] = useState("");
  const [salvo, setSalvo] = useState(false);

  const totalReceita = transacoes
    .filter(function (t) {
      return t.tipo === "entrada";
    })
    .reduce(function (acc, t) {
      return acc + t.valor;
    }, 0);

  const saldoDisponivel = totalReceita - totalGastos;
  const progressoEconomia =
    metaEconomia > 0
      ? Math.min((saldoDisponivel / metaEconomia) * 100, 100)
      : 0;
  const statusEconomia =
    progressoEconomia >= 100
      ? "ok"
      : progressoEconomia >= 60
        ? "warning"
        : "danger";

  function salvarEconomia() {
    if (!autenticado) {
      navigate("/login");
      return;
    }
    const val = parseFloat(economiaTemp) || 0;
    setMetaEconomia(val);
    localStorage.setItem("mm-meta-economia", String(val));
    setEditandoEconomia(false);
    mostrarSalvo();
  }

  function mostrarSalvo() {
    setSalvo(true);
    setTimeout(function () {
      setSalvo(false);
    }, 2000);
  }

  function handleEditar(cat) {
    if (!autenticado) {
      navigate("/login");
      return;
    }
    setEditando(cat);
    setValorTemp(limites[cat] || "");
  }

  function handleConfirmar(cat) {
    const novo = Object.assign({}, limites, {
      [cat]: parseFloat(valorTemp) || 0,
    });
    setLimites(novo);
    localStorage.setItem("mm-metas", JSON.stringify(novo));
    setEditando(null);
    mostrarSalvo();
  }

  const categorias = Object.keys(porCategoria);

  return (
    <div className="metas">
      <motion.div
        className="metas__topo"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          <h2 className="metas__titulo">Metas</h2>
          <p className="metas__subtitulo">
            Defina limites de gasto por categoria
          </p>
        </div>
        <AnimatePresence>
          {salvo && (
            <motion.span
              className="metas__salvo"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span aria-hidden="true">✅</span> Meta salva!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Card de Economia ─── */}
      <motion.section
        aria-label="Meta de Economia"
        className={"metas__invest-card metas__invest-card--" + statusEconomia}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ y: -4 }}
      >
        <div className="metas__invest-top">
          <div className="metas__invest-left">
            <div className="metas__invest-icone" aria-hidden="true">
              🎯
            </div>
            <div>
              <span className="metas__invest-titulo">Meta de Economia</span>
              <span className="metas__invest-sub">
                Quanto você quer guardar este mês?
              </span>
            </div>
          </div>
          <div className="metas__invest-right">
            {editandoEconomia ? (
              <div
                className="metas__edit"
                role="group"
                aria-label="Editar meta de economia"
              >
                <label htmlFor="input-economia" className="sr-only">
                  Meta de economia em reais
                </label>
                <span className="metas__edit-prefix" aria-hidden="true">
                  R$
                </span>
                <input
                  id="input-economia"
                  className="metas__input"
                  type="number"
                  min="0"
                  value={economiaTemp}
                  onChange={function (e) {
                    setEconomiaTemp(e.target.value);
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="metas__btn-ok"
                  onClick={salvarEconomia}
                  aria-label="Confirmar meta de economia"
                >
                  <span aria-hidden="true">✓</span>
                </button>
              </div>
            ) : (
              <div className="metas__invest-valor-wrap">
                <span className="metas__invest-pct">
                  {formatarMoeda(metaEconomia)}
                </span>
                <button
                  type="button"
                  className="metas__btn-editar"
                  onClick={function () {
                    setEditandoEconomia(true);
                    setEconomiaTemp(metaEconomia);
                  }}
                  aria-label="Editar meta de economia"
                  title="Editar meta de economia"
                >
                  <span aria-hidden="true">✏️</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="metas__invest-progresso-wrap">
          <div
            className="metas__progresso"
            role="progressbar"
            aria-valuenow={Math.round(progressoEconomia)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso da meta de economia"
            aria-valuetext={
              Math.round(progressoEconomia) + "% da meta de economia concluída"
            }
          >
            <div
              className={
                "metas__progresso-fill metas__progresso-fill--" + statusEconomia
              }
              style={{ width: progressoEconomia + "%" }}
            />
          </div>
          <span
            className={"metas__pct metas__pct--" + statusEconomia}
            aria-live="polite"
          >
            {progressoEconomia >= 100 ? (
              <>
                <span aria-hidden="true">✅</span> Parabéns! Você atingiu sua
                meta de economia!
              </>
            ) : (
              "Saldo disponível: " +
              formatarMoeda(saldoDisponivel) +
              " de " +
              formatarMoeda(metaEconomia)
            )}
          </span>
        </div>

        <dl className="metas__invest-resumo">
          <div className="metas__invest-item">
            <dt className="metas__invest-item-label">Receita</dt>
            <dd className="metas__invest-item-valor">
              {formatarMoeda(totalReceita)}
            </dd>
          </div>
          <div className="metas__invest-item">
            <dt className="metas__invest-item-label">Total gasto</dt>
            <dd className="metas__invest-item-valor">
              {formatarMoeda(totalGastos)}
            </dd>
          </div>
          <div className="metas__invest-item">
            <dt className="metas__invest-item-label">Saldo disponível</dt>
            <dd
              className={
                "metas__invest-item-valor metas__pct--" + statusEconomia
              }
            >
              {formatarMoeda(saldoDisponivel)}
            </dd>
          </div>
        </dl>
      </motion.section>

      {/* ─── Lista de categorias ─── */}
      <ul className="metas__lista" aria-label="Metas por categoria">
        {categorias.map(function (cat, catIndex) {
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
            <motion.li
              key={cat}
              aria-label={
                cat +
                ": " +
                formatarMoeda(gasto) +
                ", " +
                percentualAtual.toFixed(1) +
                "% do total"
              }
              className={"metas__card metas__card--" + status}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: catIndex * 0.08,
                ease: "easeOut",
              }}
              whileHover={{ y: -5 }}
            >
              <div className="metas__card-topo">
                <div className="metas__card-info">
                  <div className="metas__icone" aria-hidden="true">
                    {iconesPorCategoria[cat] || "📦"}
                  </div>
                  <div>
                    <span className="metas__cat-nome">{cat}</span>
                    <span className="metas__cat-gasto">
                      {formatarMoeda(gasto)}
                    </span>
                    <span className="metas__cat-percentual">
                      {percentualAtual.toFixed(1)}% do total
                    </span>
                  </div>
                </div>

                <div className="metas__card-limite">
                  {editando === cat ? (
                    <div
                      className="metas__edit"
                      role="group"
                      aria-label={"Editar limite de " + cat}
                    >
                      <label htmlFor={"input-" + cat} className="sr-only">
                        Limite para {cat} em porcentagem
                      </label>
                      <input
                        id={"input-" + cat}
                        className="metas__input"
                        type="number"
                        min="0"
                        max="100"
                        value={valorTemp}
                        onChange={function (e) {
                          setValorTemp(e.target.value);
                        }}
                        autoFocus
                      />
                      <span className="metas__edit-prefix" aria-hidden="true">
                        %
                      </span>
                      <button
                        type="button"
                        className="metas__btn-ok"
                        onClick={function () {
                          handleConfirmar(cat);
                        }}
                        aria-label={"Confirmar limite de " + cat}
                      >
                        <span aria-hidden="true">✓</span>
                      </button>
                    </div>
                  ) : (
                    <div className="metas__limite-wrap">
                      <span className="metas__limite-valor">
                        Limite: {limite > 0 ? limite + "%" : "—"}
                      </span>
                      <button
                        type="button"
                        className="metas__btn-editar"
                        onClick={function () {
                          handleEditar(cat);
                        }}
                        title={"Editar limite de " + cat}
                      >
                        <span aria-hidden="true">✏️</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {limite > 0 && (
                <div className="metas__progresso-wrap">
                  <div
                    className="metas__progresso"
                    role="progressbar"
                    aria-valuenow={Math.round(percentualMeta)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={
                      percentualAtual.toFixed(1) + "% usado de " + limite + "%"
                    }
                  >
                    <motion.div
                      className={
                        "metas__progresso-fill metas__progresso-fill--" + status
                      }
                      initial={{ width: 0 }}
                      whileInView={{ width: percentualMeta + "%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className={"metas__pct metas__pct--" + status}>
                    {percentualAtual.toFixed(1)}% usado de {limite}%
                    {status === "danger" && (
                      <>
                        <span aria-hidden="true"> ⚠️</span>
                        <span> Limite atingido!</span>
                      </>
                    )}
                    {status === "warning" && (
                      <>
                        <span aria-hidden="true"> ⚠️</span>
                        <span> Atenção ao limite!</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default Metas;
