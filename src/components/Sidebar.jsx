import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart2, Target, User } from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/analise", label: "Análise", icon: BarChart2 },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/perfil", label: "Perfil", icon: User },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-money">Money</span>
        <span className="sidebar__logo-map">Map</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
            }
          >
            <div className="sidebar__icon">
              <Icon size={16} />
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
