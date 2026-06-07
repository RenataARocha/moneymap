import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ModalTransacao.css";
import { postTransacao } from "../services/api";
import { useTransacoes } from "../context/TransacoesContext";
import { useAuth } from "../hooks/useAuth";

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Outros: "📦",
};

const metodosPagamento = [
  { value: "cartao", label: "💳 Cartão de crédito" },
  { value: "debito", label: "💳 Cartão de débito" },
  { value: "pix", label: "📱 Pix" },
  { value: "dinheiro", label: "💵 Dinheiro" },
  { value: "outros", label: "📦 Outros" },
];

const estadoInicial = {
  valor: "",
  descricao: "",
  data: "",
  categoria: "",
  metodoPagamento: "pix",
};

function ModalTransacao({ onAdicionar, onFechar, tipo }) {
  const tipoFinal = tipo || "saida";
  const { recarregar } = useTransacoes();
  const { autenticado } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(estadoInicial);
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  function set(campo, valor) {
    setForm(function (p) {
      return Object.assign({}, p, { [campo]: valor });
    });
    if (erros[campo]) {
      setErros(function (p) {
        return Object.assign({}, p, { [campo]: "" });
      });
    }
  }

  function validar() {
    const e = {};
    if (!form.valor || parseFloat(form.valor) <= 0)
      e.valor = "Informe um valor válido.";
    if (!form.descricao.trim()) e.descricao = "Informe uma descrição.";
    if (!form.data) e.data = "Informe a data.";
    if (tipoFinal === "saida" && !form.categoria)
      e.categoria = "Selecione uma categoria.";
    return e;
  }

  async function handleAdicionar() {
    if (!autenticado) {
      onFechar();
      navigate("/login");
      return;
    }

    const e = validar();
    if (Object.keys(e).length > 0) {
      setErros(e);
      return;
    }

    setCarregando(true);
    const nova = {
      id: Date.now(),
      valor: parseFloat(form.valor),
      descricao: form.descricao.trim(),
      data: form.data,
      categoria: tipoFinal === "saida" ? form.categoria : "Receita",
      tipo: tipoFinal,
      metodoPagamento: form.metodoPagamento,
    };

    try {
      await postTransacao(nova);
      await recarregar();
      setForm(estadoInicial);
      onAdicionar(nova);
    } catch (error) {
      console.error(error);
      setErros({ geral: "Erro ao salvar. Tente novamente." });
    } finally {
      setCarregando(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") onFechar();
  }

  return (
    <div
      className="modal-overlay"
      onClick={function (e) {
        if (e.target === e.currentTarget) onFechar();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button
          className="modal__fechar"
          onClick={onFechar}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        <h3 id="modal-titulo" className="modal__titulo">
          Adicionar Transação
        </h3>
        <p className="modal__subtitulo">
          {tipoFinal === "saida"
            ? "Gastos / Despesa / Saída"
            : "Renda / Receita / Entrada"}
        </p>

        {!autenticado && (
          <div className="modal__aviso-login">
            <span>🔒</span>
            <p>Faça login para salvar suas transações reais.</p>
          </div>
        )}

        <div className="modal__campos">
          <div className="modal__campo">
            <label htmlFor="modal-valor" className="modal__label">
              Valor (R$)
            </label>
            <input
              id="modal-valor"
              className={
                "modal__input " + (erros.valor ? "modal__input--erro" : "")
              }
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.valor}
              onChange={function (e) {
                set("valor", e.target.value);
              }}
              aria-describedby={erros.valor ? "erro-valor" : undefined}
            />
            {erros.valor && (
              <span id="erro-valor" className="modal__erro" role="alert">
                {erros.valor}
              </span>
            )}
          </div>

          <div className="modal__campo">
            <label htmlFor="modal-descricao" className="modal__label">
              Descrição
            </label>
            <textarea
              id="modal-descricao"
              className={
                "modal__textarea " +
                (erros.descricao ? "modal__input--erro" : "")
              }
              placeholder="Ex: iFood, Aluguel, Salário..."
              value={form.descricao}
              onChange={function (e) {
                set("descricao", e.target.value);
              }}
              aria-describedby={erros.descricao ? "erro-descricao" : undefined}
            />
            {erros.descricao && (
              <span id="erro-descricao" className="modal__erro" role="alert">
                {erros.descricao}
              </span>
            )}
          </div>

          <div className="modal__campo">
            <label htmlFor="modal-data" className="modal__label">
              Data
            </label>
            <input
              id="modal-data"
              className={
                "modal__input " + (erros.data ? "modal__input--erro" : "")
              }
              type="date"
              value={form.data}
              onChange={function (e) {
                set("data", e.target.value);
              }}
              aria-describedby={erros.data ? "erro-data" : undefined}
            />
            {erros.data && (
              <span id="erro-data" className="modal__erro" role="alert">
                {erros.data}
              </span>
            )}
          </div>

          {tipoFinal === "saida" && (
            <div className="modal__campo">
              <label htmlFor="modal-categoria" className="modal__label">
                Categoria
              </label>
              <select
                id="modal-categoria"
                className={
                  "modal__select " +
                  (erros.categoria ? "modal__input--erro" : "")
                }
                value={form.categoria}
                onChange={function (e) {
                  set("categoria", e.target.value);
                }}
                aria-describedby={
                  erros.categoria ? "erro-categoria" : undefined
                }
              >
                <option value="">Selecione uma categoria</option>
                {Object.keys(iconesPorCategoria).map(function (cat) {
                  return (
                    <option key={cat} value={cat}>
                      {iconesPorCategoria[cat]} {cat}
                    </option>
                  );
                })}
              </select>
              {erros.categoria && (
                <span id="erro-categoria" className="modal__erro" role="alert">
                  {erros.categoria}
                </span>
              )}
            </div>
          )}

          <div className="modal__campo">
            <label htmlFor="modal-metodo" className="modal__label">
              Método de pagamento
            </label>
            <select
              id="modal-metodo"
              className="modal__select"
              value={form.metodoPagamento}
              onChange={function (e) {
                set("metodoPagamento", e.target.value);
              }}
            >
              {metodosPagamento.map(function (m) {
                return (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {erros.geral && (
          <span className="modal__erro" role="alert">
            {erros.geral}
          </span>
        )}

        <div className="modal__botoes">
          <button
            className={
              "modal__btn modal__btn--adicionar " +
              (carregando ? "modal__btn--carregando" : "")
            }
            onClick={handleAdicionar}
            disabled={carregando}
            aria-label={
              autenticado
                ? tipoFinal === "saida"
                  ? "Adicionar despesa"
                  : "Adicionar receita"
                : "Fazer login para adicionar"
            }
          >
            {!autenticado
              ? "🔒 Fazer login"
              : carregando
                ? "Salvando..."
                : "ADICIONAR"}
          </button>
          <button
            className="modal__btn modal__btn--cancelar"
            onClick={onFechar}
            aria-label="Cancelar"
          >
            CANCELAR
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ModalTransacao;
