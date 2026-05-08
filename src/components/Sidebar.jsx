import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Lightbulb,
  List,
  Target,
  User,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/analise", label: "Análise", icon: BarChart2 },
  { to: "/transacoes", label: "Transações", icon: List },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/perfil", label: "Perfil", icon: User },
];

function Sidebar({ aberta, fechar, onLogout }) {
  return (
    <motion.aside
      className={`sidebar ${aberta ? "sidebar--open" : ""}`}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <div className="sidebar__logo">
        <span className="sidebar__logo-money">Money</span>
        <span className="sidebar__logo-map">Map</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={fechar} // fecha ao navegar no mobile
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
            }
          >
            <div className="sidebar__icon">
              <Icon size={18} />
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Botão de logout na parte de baixo */}
      <div className="sidebar__footer">
        <button className="sidebar__item sidebar__logout" onClick={onLogout}>
          <div className="sidebar__icon">
            <LogOut size={18} />
          </div>
          <span>Sair</span>
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
