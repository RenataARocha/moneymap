const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Receita: "💰",
  Outros: "📦",
};

function TransactionList({ transacoes }) {
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
          {transacoes.map((t) => (
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
    </div>
  );
}

export default TransactionList;
