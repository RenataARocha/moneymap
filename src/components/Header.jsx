import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";
import "./Header.css";

function Header({ nomeUsuario, onAbrirModal }) {
  const navigate = useNavigate();

  const primeiroNome = nomeUsuario ? nomeUsuario.split(" ")[0] : "Usuário";
  const iniciais = nomeUsuario
    ? nomeUsuario
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "U";

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <div className="header__saudacao">
        <h1 className="header__titulo">Olá, {primeiroNome}! 👋</h1>
        <p className="header__subtitulo">Resumo de consumo — Maio 2026</p>
      </div>

      <div className="header__acoes">
        <button
          className="header__btn-adicionar"
          onClick={() => onAbrirModal("saida")}
        >
          + Despesa
        </button>
        <button
          className="header__btn-receita"
          onClick={() => onAbrirModal("entrada")}
        >
          + Receita
        </button>
        <ThemeToggle />
        <div
          className="header__avatar"
          title={nomeUsuario}
          onClick={() => navigate("/perfil")}
        >
          {iniciais}
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
