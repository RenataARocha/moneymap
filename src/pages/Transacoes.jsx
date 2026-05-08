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

const ITENS_POR_PAGINA = 7;

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("saida");
  const [mesSelecionado, setMesSelecionado] = useState("maio");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [novaTransacao, setNovaTransacao] = useState({
    valor: "",
    descricao: "",
    data: "",
    categoria: "",
  });

  useEffect(() => {
    const carregarTransacoes = async () => {
      try {
        setCarregando(true);
        const transacoesData = await getTransacoes();
        setTransacoes(transacoesData);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar as transações.");
      } finally {
        setCarregando(false);
      }
    };
    carregarTransacoes();
  }, []);

  if (carregando)
    return <div className="transacoes">Carregando transações...</div>;
  if (erro) return <div className="transacoes">{erro}</div>;

  const filtradas = transacoes
    .filter((t) => t.tipo === filtroTipo)
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalPaginas = Math.ceil(filtradas.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const paginadas = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);

  function handleDeletar(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta transação?",
    );

    if (!confirmar) return;

    setTransacoes((prev) => prev.filter((t) => t.id !== id));

    setMensagem("Transação excluída com sucesso!");

    setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  function handleAdicionar() {
    if (
      !novaTransacao.valor ||
      !novaTransacao.descricao ||
      !novaTransacao.data ||
      !novaTransacao.categoria
    )
      return;

    const nova = {
      id: Date.now(),
      valor: parseFloat(novaTransacao.valor),
      descricao: novaTransacao.descricao,
      data: novaTransacao.data,
      categoria: novaTransacao.categoria,
      tipo: "saida",
      metodoPagamento: "outros",
    };

    setTransacoes((prev) => [...prev, nova]);

    setMensagem("Transação adicionada com sucesso!");

    setTimeout(() => {
      setMensagem("");
    }, 3000);

    setNovaTransacao({
      valor: "",
      descricao: "",
      data: "",
      categoria: "",
    });

    setModalAberto(false);
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

      <div className="transacoes__rodape">
        <button
          className="transacoes__btn-adicionar"
          onClick={() => setModalAberto(true)}
        >
          ADICIONAR NOVA TRANSAÇÃO
        </button>
      </div>

      {modalAberto && (
        <div className="transacoes__modal-overlay">
          <div className="transacoes__modal">
            <button
              className="transacoes__modal-fechar"
              onClick={() => setModalAberto(false)}
            >
              ✕
            </button>
            <h3 className="transacoes__modal-titulo">Adicionar Transação</h3>
            <p className="transacoes__modal-subtitulo">Gastos/Despesa/Saída</p>

            <div className="transacoes__modal-campos">
              <input
                className="transacoes__modal-input"
                type="number"
                placeholder="Valor R$"
                value={novaTransacao.valor}
                onChange={(e) =>
                  setNovaTransacao((p) => ({ ...p, valor: e.target.value }))
                }
              />
              <textarea
                className="transacoes__modal-textarea"
                placeholder="Descrição"
                value={novaTransacao.descricao}
                onChange={(e) =>
                  setNovaTransacao((p) => ({ ...p, descricao: e.target.value }))
                }
              />
              <input
                className="transacoes__modal-input"
                type="date"
                placeholder="Selecione uma data"
                value={novaTransacao.data}
                onChange={(e) =>
                  setNovaTransacao((p) => ({ ...p, data: e.target.value }))
                }
              />
              <select
                className="transacoes__modal-select"
                value={novaTransacao.categoria}
                onChange={(e) =>
                  setNovaTransacao((p) => ({ ...p, categoria: e.target.value }))
                }
              >
                <option value="">Selecione uma Categoria</option>
                {Object.keys(iconesPorCategoria).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="transacoes__modal-botoes">
              <button
                className="transacoes__modal-btn transacoes__modal-btn--adicionar"
                onClick={handleAdicionar}
              >
                ADICIONAR
              </button>
              <button
                className="transacoes__modal-btn transacoes__modal-btn--cancelar"
                onClick={() => setModalAberto(false)}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transacoes;
