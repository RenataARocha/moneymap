import { Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header({ nomeUsuario }) {
  const primeiroNome = nomeUsuario ? nomeUsuario.split(" ")[0] : "Usuário";
  const iniciais = nomeUsuario
    ? nomeUsuario
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "U";

  return (
    <header className="header">
      <div className="header__saudacao">
        <h1 className="header__titulo">Olá, {primeiroNome}! 👋</h1>
        <p className="header__subtitulo">Resumo de consumo — Maio 2026</p>
      </div>

      <div className="header__acoes">
        <ThemeToggle />
        <button className="header__sino" title="Notificações">
          <Bell size={16} />
        </button>
        <div className="header__avatar" title={nomeUsuario}>
          {iniciais}
        </div>
      </div>
    </header>
  );
}

export default Header;
