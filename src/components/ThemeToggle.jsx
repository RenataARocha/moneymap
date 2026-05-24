import { useTheme } from "../context/useTheme";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}

export default ThemeToggle;
