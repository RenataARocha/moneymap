import { motion, AnimatePresence } from "framer-motion";
import "./Toast.css";

function Toast({ mensagem }) {
  return (
    <AnimatePresence>
      {mensagem && (
        <motion.div
          className={
            "toast " +
            (mensagem.includes("❌") ? "toast--erro" : "toast--sucesso")
          }
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {mensagem}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
