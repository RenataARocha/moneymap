import { useState } from "react";
import { motion } from "framer-motion";
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
  const totalPaginas = Math.max(
    1,
    Math.ceil(transacoes.length / ITENS_POR_PAGINA),
  );
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const paginadas = transacoes.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <motion.div
      className="transaction-list"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h3 className="transaction-list__titulo">Últimas Transações</h3>

      {transacoes.length === 0 ? (
        <div className="transaction-list__vazio" role="status">
          <span aria-hidden="true">📭</span>
          <p>Nenhuma transação neste mês ainda.</p>
        </div>
      ) : (
        <table
          className="transaction-list__tabela"
          aria-label="Últimas transações do mês"
        >
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Descrição</th>
              <th scope="col">Categoria</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            {paginadas.map(function (t) {
              return (
                <tr key={t.id}>
                  <td className="transaction-list__data">
                    {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="transaction-list__desc">{t.descricao}</td>
                  <td>
                    <span
                      className="transaction-list__badge"
                      aria-label={"Categoria: " + t.categoria}
                    >
                      <span aria-hidden="true">
                        {iconesPorCategoria[t.categoria] || "📦"}
                      </span>{" "}
                      {t.categoria}
                    </span>
                  </td>
                  <td
                    className={
                      "transaction-list__valor " +
                      (t.tipo === "entrada" ? "entrada" : "saida")
                    }
                  >
                    <span aria-hidden="true">
                      {t.tipo === "entrada" ? "+ " : "- "}
                    </span>
                    {t.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {transacoes.length > ITENS_POR_PAGINA && (
        <nav
          className="transaction-list__paginacao"
          aria-label="Paginação de transações"
        >
          <button
            className="transaction-list__pag-btn"
            onClick={function () {
              setPaginaAtual(function (p) {
                return Math.max(p - 1, 1);
              });
            }}
            disabled={paginaAtual === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>
          <span className="transaction-list__pag-info" aria-live="polite">
            {paginaAtual} de {totalPaginas}
          </span>
          <button
            className="transaction-list__pag-btn"
            onClick={function () {
              setPaginaAtual(function (p) {
                return Math.min(p + 1, totalPaginas);
              });
            }}
            disabled={paginaAtual === totalPaginas}
            aria-label="Próxima página"
          >
            ›
          </button>
        </nav>
      )}
    </motion.div>
  );
}

export default TransactionList;
