import { useEffect, useState } from "react";
import { getTransacoes } from "../services/api";
import "./Transacoes.css";

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Receita: "💰",
  Outros: "📦",
};

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarTransacoes = async () => {
      try {
        setCarregando(true);
        const transacoesData = await getTransacoes();
        setTransacoes(transacoesData);
      } catch (error) {
        setErro("Não foi possível carregar as transações.");
      } finally {
        setCarregando(false);
      }
    };

    carregarTransacoes();
  }, []);

  if (carregando) {
    return <div className="transacoes">Carregando transações...</div>;
  }

  if (erro) {
    return <div className="transacoes">{erro}</div>;
  }

  const categorias = ["Todas", ...new Set(transacoes.map((t) => t.categoria))];

  const transacoesFiltradas =
    filtro === "Todas"
      ? transacoes
      : transacoes.filter((t) => t.categoria === filtro);

  const ordenadas = [...transacoesFiltradas].sort(
    (a, b) => new Date(b.data) - new Date(a.data),
  );

  return (
    <div className="transacoes">
      <div className="transacoes__header">
        <h2 className="transacoes__titulo">Minhas Transações</h2>
        <p className="transacoes__subtitulo">Histórico completo — Maio 2026</p>
      </div>

      <div className="transacoes__filtros">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`transacoes__filtro-btn ${filtro === cat ? "ativo" : ""}`}
            onClick={() => setFiltro(cat)}
          >
            {iconesPorCategoria[cat] || ""} {cat}
          </button>
        ))}
      </div>

      <div className="transacoes__card">
        <table className="transacoes__tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Pagamento</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((t) => (
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
                <td className="transacoes__pagamento">{t.metodoPagamento}</td>
                <td className={`transacoes__valor ${t.tipo}`}>
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
    </div>
  );
}

export default Transacoes;
