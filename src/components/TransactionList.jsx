import { useState } from "react";
import "./TransactionList.css";

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Receita: "💰",
  Outros: "📦",
};

const ITENS_POR_PAGINA = 5;

function TransactionList({ transacoes }) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const totalPaginas = Math.ceil(transacoes.length / ITENS_POR_PAGINA);

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;

  const transacoesPaginadas = transacoes.slice(
    inicio,
    inicio + ITENS_POR_PAGINA,
  );

  return (
    <div className="transaction-list">
      <h3 className="transaction-list__titulo">Últimas Transações</h3>
      <table className="transaction-list__tabela">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transacoesPaginadas.map((t) => (
            <tr key={t.id}>
              <td className="transaction-list__data">
                {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}
              </td>
              <td className="transaction-list__desc">{t.descricao}</td>
              <td>
                <span className="transaction-list__badge">
                  {iconesPorCategoria[t.categoria] || "📦"} {t.categoria}
                </span>
              </td>
              <td
                className={`transaction-list__valor ${t.tipo === "entrada" ? "entrada" : "saida"}`}
              >
                {t.tipo === "entrada" ? "+" : "-"}
                {t.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="transaction-list__paginacao">
        <button
          className="transaction-list__pag-btn"
          onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
          disabled={paginaAtual === 1}
        >
          ‹
        </button>

        <span className="transaction-list__pag-info">
          {paginaAtual} de {totalPaginas}
        </span>

        <button
          className="transaction-list__pag-btn"
          onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default TransactionList;
