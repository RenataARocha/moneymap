import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Transacoes.css";
import { useTransacoes } from "../context/TransacoesContext";
import { deleteTransacao } from "../services/api";

const iconesPorCategoria = {
  Alimentação: "🥗",
  Lazer: "🎮",
  Moradia: "🏠",
  Transporte: "🚗",
  Saúde: "💊",
  Receita: "💰",
  Outros: "📦",
};

const mesesMap = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

const ITENS_POR_PAGINA = 7;

function Transacoes() {
  const [filtroTipo, setFiltroTipo] = useState("saida");
  const [mesSelecionado, setMesSelecionado] = useState("05");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [mensagem, setMensagem] = useState({
    texto: "",
    tipo: "",
  });

  const { transacoes, carregando, recarregar, erro } = useTransacoes();

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
  }

  async function handleDeletar(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta transação?",
    );
    if (!confirmar) return;

    try {
      await deleteTransacao(id);
      await recarregar();
      mostrarMensagem("✅ Transação excluída com sucesso!");
    } catch (err) {
      console.error(err);
      mostrarMensagem("❌ Erro ao excluir transação.", "erro");
    }
  }

  if (carregando) {
    return (
      <div
        className="home-loading"
        role="status"
        aria-label="Carregando transações"
      >
        <div className="home-loading__logo">
          <div className="home-loading__spinner" aria-hidden="true" />
          <span>Carregando transações...</span>
        </div>
      </div>
    );
  }

  if (erro)
    return (
      <div className="transacoes" role="alert">
        {erro}
      </div>
    );

  // ─── filtro de mês + tipo ───────────────────────────
  const filtradas = transacoes
    .filter((t) => {
      const mes = t.data?.split("-")[1];
      return t.tipo === filtroTipo && mes === mesSelecionado;
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtradas.length / ITENS_POR_PAGINA),
  );
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const paginadas = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);

  const nomeMes = mesesMap[mesSelecionado] || "—";
  const tituloLista =
    filtroTipo === "saida"
      ? `Lista de Gastos — ${nomeMes} 2026`
      : `Lista de Rendas — ${nomeMes} 2026`;

  return (
    <div className="transacoes">
      {/* ─── Toast ─── */}
      <AnimatePresence>
        {mensagem.texto && (
          <motion.div
            role="alert"
            aria-live="polite"
            className={`transacoes__feedback transacoes__feedback--${mensagem.tipo}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {mensagem.texto}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Topo ─── */}
      <div className="transacoes__topo">
        <h2 className="transacoes__titulo">Transações</h2>
        <div
          className="transacoes__controles"
          role="group"
          aria-label="Filtros de transação"
        >
          {/* Toggle Entradas/Saídas */}
          <div
            className="transacoes__toggle"
            role="group"
            aria-label="Tipo de transação"
          >
            <button
              className={`transacoes__toggle-btn ${filtroTipo === "entrada" ? "ativo" : ""}`}
              aria-pressed={filtroTipo === "entrada"}
              onClick={() => {
                setFiltroTipo("entrada");
                setPaginaAtual(1);
              }}
            >
              Entradas
            </button>
            <button
              className={`transacoes__toggle-btn ${filtroTipo === "saida" ? "ativo" : ""}`}
              aria-pressed={filtroTipo === "saida"}
              onClick={() => {
                setFiltroTipo("saida");
                setPaginaAtual(1);
              }}
            >
              Saídas
            </button>
          </div>

          {/* Filtro de mês */}
          <label htmlFor="filtro-mes" className="sr-only">
            Filtrar por mês
          </label>
          <select
            id="filtro-mes"
            className="transacoes__select"
            value={mesSelecionado}
            onChange={(e) => {
              setMesSelecionado(e.target.value);
              setPaginaAtual(1);
            }}
          >
            {Object.entries(mesesMap).map(([valor, nome]) => (
              <option key={valor} value={valor}>
                Mês: {nome} 2026
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Tabela ─── */}
      <motion.div
        className="transacoes__card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h3 className="transacoes__card-titulo">{tituloLista}</h3>

        {filtradas.length === 0 ? (
          <div className="transacoes__vazio" role="status">
            <span>😕</span>
            <p>Nenhuma transação encontrada para {nomeMes} 2026.</p>
          </div>
        ) : (
          <table className="transacoes__tabela" aria-label={tituloLista}>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Descrição</th>
                <th scope="col">Categoria</th>
                <th scope="col">Valor</th>
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginadas.map((t, index) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <td className="transacoes__data">
                    {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="transacoes__desc">{t.descricao}</td>
                  <td>
                    <span
                      className="transacoes__badge"
                      aria-label={`Categoria: ${t.categoria}`}
                    >
                      <span aria-hidden="true">
                        {iconesPorCategoria[t.categoria] || "📦"}
                      </span>{" "}
                      {t.categoria}
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
                      aria-label={`Excluir transação: ${t.descricao}`}
                    >
                      🗑️
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ─── Paginação ─── */}
        {filtradas.length > 0 && (
          <nav
            className="transacoes__paginacao"
            aria-label="Paginação de transações"
          >
            <button
              className="transacoes__pag-btn"
              onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}
              aria-label="Página anterior"
            >
              ‹
            </button>
            <span className="transacoes__pag-info" aria-live="polite">
              {paginaAtual} de {totalPaginas}
            </span>
            <button
              className="transacoes__pag-btn"
              onClick={() =>
                setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={paginaAtual === totalPaginas}
              aria-label="Próxima página"
            >
              ›
            </button>
          </nav>
        )}
      </motion.div>
    </div>
  );
}

export default Transacoes;
