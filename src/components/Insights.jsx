import { motion } from "framer-motion";
import "./Insights.css";

const iconesPadrao = {
  alta: "📈",
  baixa: "📉",
  estavel: "✅",
  padrao: "🔍",
};

function Insights({ padroes, recomendacoes }) {
  return (
    <motion.div
      className="insights"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
    >
      <div className="insights__secao">
        <h3 className="insights__titulo">Padrões Detectados</h3>
        <div className="insights__lista">
          {padroes.map((p, i) => (
            <motion.div
              key={i}
              className="insights__item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`insights__icone insights__icone--${p.tipo}`}>
                {iconesPadrao[p.tipo] || "📊"}
              </div>
              <div className="insights__texto">
                <strong>{p.mensagem}</strong>
                <span>{p.detalhe}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="insights__secao">
        <h3 className="insights__titulo">Recomendações de Economia</h3>
        <div className="insights__lista">
          {recomendacoes.map((r, i) => (
            <div
              key={i}
              className={`insights__rec ${i === 0 ? "insights__rec--destaque" : ""}`}
            >
              <div className="insights__rec-icone">{r.icone}</div>
              <div className="insights__texto">
                <strong>{r.titulo}</strong>
                {r.valor && (
                  <span className="insights__rec-valor">{r.valor}</span>
                )}
                <span>{r.descricao}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Insights;
