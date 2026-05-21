import { useState } from "react";
import { AuthContext } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const [autenticado, setAutenticado] = useState(function () {
    return !!localStorage.getItem("moneymap-usuario-nome");
  });

  function login(nome) {
    localStorage.setItem("moneymap-usuario-nome", nome);
    setAutenticado(true);
  }

  function logout() {
    localStorage.removeItem("moneymap-usuario-nome");
    setAutenticado(false);
  }

  return (
    <AuthContext.Provider value={{ autenticado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}