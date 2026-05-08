import { useState } from "react";
import "./Transacoes.css";
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

const ITENS_POR_PAGINA = 7;

function Transacoes() {

  const [filtroTipo, setFiltroTipo] = useState("saida");
  const [mesSelecionado, setMesSelecionado] = useState("maio");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const { transacoes, carregando, recarregar, erro  } = useTransacoes();


  if (carregando)
    return <div className="transacoes">Carregando transações...</div>;
  if (erro) return <div className="transacoes">{erro}</div>;

  const filtradas = transacoes
    .filter((t) => t.tipo === filtroTipo)
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalPaginas = Math.ceil(filtradas.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const paginadas = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);

  function handleDeletar() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta transação?",
    );

    if (!confirmar) return;

    recarregar();

    setMensagem("Transação excluída com sucesso!");

    setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  return (
    <div className="transacoes">
      {mensagem && (
        <div
          className={`transacoes__feedback ${
            mensagem.includes("excluída")
              ? "transacoes__feedback--erro"
              : "transacoes__feedback--sucesso"
          }`}
        >
          {mensagem}
        </div>
      )}

      <div className="transacoes__topo">
        <h2 className="transacoes__titulo">Transações</h2>
        <div className="transacoes__controles">
          <div className="transacoes__toggle">
            <button
              className={`transacoes__toggle-btn ${filtroTipo === "entrada" ? "ativo" : ""}`}
              onClick={() => {
                setFiltroTipo("entrada");
                setPaginaAtual(1);
              }}
            >
              Entradas
            </button>
            <button
              className={`transacoes__toggle-btn ${filtroTipo === "saida" ? "ativo" : ""}`}
              onClick={() => {
                setFiltroTipo("saida");
                setPaginaAtual(1);
              }}
            >
              Saídas
            </button>
          </div>
          <select
            className="transacoes__select"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            <option value="janeiro">Mês: Janeiro 2026</option>
            <option value="fevereiro">Mês: Fevereiro 2026</option>
            <option value="março">Mês: Março 2026</option>
            <option value="abril">Mês: Abril 2026</option>
            <option value="maio">Mês: Maio 2026</option>
          </select>
        </div>
      </div>

      <div className="transacoes__card">
        <h3 className="transacoes__card-titulo">Lista de Gastos — Maio 2026</h3>
        <table className="transacoes__tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginadas.map((t) => (
              <tr key={t.id}>
                <td className="transacoes__data">
                  {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </td>
                <td className="transacoes__desc">{t.descricao}</td>
                <td>
                  <span className="transacoes__badge">
                    {iconesPorCategoria[t.categoria] || "📦"} {t.categoria}
                  </span>
                </td>
                <td className="transacoes__valor">
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td>
                  <button
                    className="transacoes__deletar"
                    onClick={() => handleDeletar(t.id)}
                    aria-label="Deletar transação"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="transacoes__paginacao">
          <button
            className="transacoes__pag-btn"
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            disabled={paginaAtual === 1}
          >
            ‹
          </button>
          <span className="transacoes__pag-info">
            {paginaAtual} de {totalPaginas}
          </span>
          <button
            className="transacoes__pag-btn"
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transacoes;
