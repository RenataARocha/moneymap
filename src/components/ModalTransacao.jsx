import { useState } from "react";
import "./ModalTransacao.css";
import { postTransacao } from "../services/api";
import { useTransacoes } from "../context/TransacoesContext";

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Receita: "💰",
  Outros: "📦",
};

function ModalTransacao({ onAdicionar, onFechar, tipo = "saida" }) {
  const { recarregar } = useTransacoes();
  const [novaTransacao, setNovaTransacao] = useState({
    valor: "",
    descricao: "",
    data: "",
    categoria: "",
  });

  async function handleAdicionar() {
    if (!novaTransacao.valor || !novaTransacao.descricao || !novaTransacao.data)
      return;
    if (tipo === "saida" && !novaTransacao.categoria) return;

    const nova = {
      id: Date.now(),
      valor: parseFloat(novaTransacao.valor),
      descricao: novaTransacao.descricao,
      data: novaTransacao.data,
      categoria: tipo === "saida" ? novaTransacao.categoria : "Receita",
      tipo,
      metodoPagamento: "outros",
    };

    onAdicionar(nova);

    try {
      await postTransacao(nova);
      await recarregar();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
    setNovaTransacao({ valor: "", descricao: "", data: "", categoria: "" });
    onFechar();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal__fechar" onClick={onFechar}>
          ✕
        </button>

        <h3 className="modal__titulo">Adicionar Transação</h3>
        <p className="modal__subtitulo">
          {tipo === "saida" ? "Gastos/Despesa/Saída" : "Renda/Receita/Entrada"}
        </p>

        <div className="modal__campos">
          <input
            className="modal__input"
            type="number"
            placeholder="Valor R$"
            value={novaTransacao.valor}
            onChange={(e) =>
              setNovaTransacao((p) => ({ ...p, valor: e.target.value }))
            }
          />
          <textarea
            className="modal__textarea"
            placeholder="Descrição"
            value={novaTransacao.descricao}
            onChange={(e) =>
              setNovaTransacao((p) => ({ ...p, descricao: e.target.value }))
            }
          />
          <input
            className="modal__input"
            type="date"
            value={novaTransacao.data}
            onChange={(e) =>
              setNovaTransacao((p) => ({ ...p, data: e.target.value }))
            }
          />

          {tipo === "saida" && (
            <select
              className="modal__select"
              value={novaTransacao.categoria}
              onChange={(e) =>
                setNovaTransacao((p) => ({ ...p, categoria: e.target.value }))
              }
            >
              <option value="">Selecione uma Categoria</option>
              {Object.keys(iconesPorCategoria)
                .filter((cat) => cat !== "Receita")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          )}
        </div>

        <div className="modal__botoes">
          <button
            className="modal__btn modal__btn--adicionar"
            onClick={handleAdicionar}
          >
            ADICIONAR
          </button>
          <button
            className="modal__btn modal__btn--cancelar"
            onClick={onFechar}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTransacao;
