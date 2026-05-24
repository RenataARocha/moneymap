import { motion } from "framer-motion";
import "./Insights.css";

const iconesPadrao = { alta: "📈", baixa: "📉", estavel: "✅", padrao: "🔍" };

function Insights({ padroes, recomendacoes }) {
  return (
    <motion.div
      className="insights"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <section className="insights__secao" aria-label="Padrões detectados">
        <h3 className="insights__titulo">Padrões Detectados</h3>
        {padroes.length === 0 ? (
          <p className="insights__vazio">Nenhum padrão detectado este mês.</p>
        ) : (
          <ul className="insights__lista" aria-label="Lista de padrões">
            {padroes.map(function (p, i) {
              return (
                <motion.li
                  key={i}
                  className="insights__item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className={"insights__icone insights__icone--" + p.tipo}
                    aria-hidden="true"
                  >
                    {iconesPadrao[p.tipo] || "📊"}
                  </div>
                  <div className="insights__texto">
                    <strong>{p.mensagem}</strong>
                    <span>{p.detalhe}</span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        className="insights__secao"
        aria-label="Recomendações de economia"
      >
        <h3 className="insights__titulo">Recomendações de Economia</h3>
        {recomendacoes.length === 0 ? (
          <p className="insights__vazio">Sem recomendações no momento.</p>
        ) : (
          <ul className="insights__lista">
            {recomendacoes.slice(0, 2).map(function (r, i) {
              return (
                <li
                  key={i}
                  className={
                    "insights__rec " +
                    (i === 0 ? "insights__rec--destaque" : "")
                  }
                >
                  <div className="insights__rec-icone" aria-hidden="true">
                    {r.icone}
                  </div>
                  <div className="insights__texto">
                    <strong>{r.titulo}</strong>
                    {r.valor && (
                      <span className="insights__rec-valor">{r.valor}</span>
                    )}
                    <span>{r.descricao}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </motion.div>
  );
}

export default Insights;
