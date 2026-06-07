import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import "./Header.css";

function saudacaoPorHorario() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function Header({ nomeUsuario, onAbrirModal, autenticado }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const primeiroNome = nomeUsuario ? nomeUsuario.split(" ")[0] : "Usuário";
  const iniciais = nomeUsuario
    ? nomeUsuario
        .split(" ")
        .map(function (n) {
          return n[0];
        })
        .slice(0, 2)
        .join("")
    : "U";

  function handleLogout() {
    logout();
    navigate("/dashboard");
  }

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header__saudacao">
        <h1 className="header__titulo">
          {saudacaoPorHorario()}, {autenticado ? primeiroNome : "visitante"}! 👋
        </h1>
        <p className="header__subtitulo">Resumo de consumo — MoneyMap</p>
      </div>

      <div className="header__acoes">
        <button
          className="header__btn-adicionar"
          onClick={function () {
            onAbrirModal("saida");
          }}
        >
          + Despesa
        </button>
        <button
          className="header__btn-receita"
          onClick={function () {
            onAbrirModal("entrada");
          }}
        >
          + Receita
        </button>

        <ThemeToggle />

        {autenticado && (
          <button
            className="header__logout"
            onClick={handleLogout}
            aria-label="Sair da conta"
          >
            <LogOut size={16} />
          </button>
        )}

        <div
          className="header__avatar"
          title={nomeUsuario}
          onClick={function () {
            navigate("/perfil");
          }}
          role="button"
          tabIndex={0}
          aria-label={autenticado ? "Perfil de " + nomeUsuario : "Perfil"}
          onKeyDown={function (e) {
            if (e.key === "Enter") navigate("/perfil");
          }}
        >
          {autenticado ? iniciais : "👤"}
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
