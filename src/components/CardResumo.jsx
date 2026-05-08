import { motion } from "framer-motion";
import "./CardResumo.css";

function CardResumo({ icone, label, valor, variacao, tipo }) {
  const positivo = variacao >= 0;

  return (
    <motion.div
      className={`card-resumo ${tipo === "destaque" ? "destaque" : ""}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
    >
      {/* Alterado de {icone} para <img> */}
      <div className="card-resumo__icone">
        <img
          src={icone}
          alt={label}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="card-resumo__info">
        <span className="card-resumo__label">{label}</span>
        <span className="card-resumo__valor">{valor}</span>
        {variacao !== undefined && (
          <span
            className={`card-resumo__variacao ${positivo ? "positivo" : "negativo"}`}
          >
            {positivo ? "+" : ""}
            {variacao.toFixed(1)}% vs. mês anterior
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default CardResumo;
