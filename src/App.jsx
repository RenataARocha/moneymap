import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AnaliseGastos from "./pages/AnaliseGastos";
import Transacoes from "./pages/Transacoes";
import InsightsPage from "./pages/InsightsPage";
import Metas from "./pages/Metas";
import Perfil from "./pages/Perfil";
import ModalTransacao from "./components/ModalTransacao";
import "./styles/globals.css";
import { TransacoesProvider } from "./context/TransacoesContext";

function LayoutComSidebar() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoModal, setTipoModal] = useState("saida");
  const nomeUsuario =
    localStorage.getItem("moneymap-usuario-nome") || "Maria Silva";
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("moneymap-usuario-nome");
    navigate("/login");
  }

  return (
    <div className="layout">
      <button
        className="menu-toggle"
        onClick={() => setSidebarAberta(true)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {sidebarAberta && (
        <div className="overlay" onClick={() => setSidebarAberta(false)} />
      )}

      <Sidebar
        aberta={sidebarAberta}
        fechar={() => setSidebarAberta(false)}
        onLogout={handleLogout}
      />

      <div className="layout__main">
        <Header
          nomeUsuario={nomeUsuario}
          onAbrirModal={(tipo = "saida") => {
            setTipoModal(tipo);
            setModalAberto(true);
          }}
        />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>

      {modalAberto && (
        <ModalTransacao
          tipo={tipoModal}
          onAdicionar={() => {
            setModalAberto(false);
            navigate("/transacoes");
          }}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TransacoesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<LayoutComSidebar />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/analise" element={<AnaliseGastos />} />
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/metas" element={<Metas />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransacoesProvider>
    </ThemeProvider>
  );
}

export default App;
