import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import "./CardResumo.css";

function ValorAnimado({ valor }) {
  const raw = parseFloat(
    String(valor)
      .replace(/[^0-9,.-]/g, "")
      .replace(",", "."),
  );
  const isMonetary = String(valor).includes("R$");
  const motionVal = useMotionValue(0);

  useEffect(
    function () {
      if (!isNaN(raw)) {
        const ctrl = animate(motionVal, raw, {
          duration: 1.2,
          ease: "easeOut",
        });
        return ctrl.stop;
      }
    },
    [raw],
  );

  if (isNaN(raw) || !isMonetary) {
    return <span className="card-resumo__valor">{valor}</span>;
  }

  return (
    <motion.span className="card-resumo__valor">
      {useTransform(motionVal, function (v) {
        return v.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      })}
    </motion.span>
  );
}

function CardResumo({ icone, label, valor, variacao, tipo }) {
  const positivo = variacao >= 0;

  return (
    <motion.div
      className={"card-resumo " + (tipo === "destaque" ? "destaque" : "")}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="card-resumo__icone">
        <img src={icone} alt={label} />
      </div>
      <div className="card-resumo__info">
        <span className="card-resumo__label">{label}</span>
        <ValorAnimado valor={valor} />
        {variacao !== undefined && (
          <span
            className={
              "card-resumo__variacao " + (positivo ? "positivo" : "negativo")
            }
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
