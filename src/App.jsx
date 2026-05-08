import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
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

function LayoutComSidebar({ children }) {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoModal, setTipoModal] = useState("saida");
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
  }

  return (
    <div className="layout">
      {/* Botão hamburguer para mobile */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarAberta(true)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Overlay para fechar sidebar no mobile */}
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
          nomeUsuario="Maria Silva"
          onAbrirModal={(tipo = "saida") => {
            setTipoModal(tipo);
            setModalAberto(true);
          }}
        />
        <main className="layout__content">{children}</main>
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
          <Route
            path="/dashboard"
            element={
              <LayoutComSidebar>
                <Home />
              </LayoutComSidebar>
            }
          />
          <Route
            path="/analise"
            element={
              <LayoutComSidebar>
                <AnaliseGastos />
              </LayoutComSidebar>
            }
          />
          <Route
            path="/transacoes"
            element={
              <LayoutComSidebar>
                <Transacoes />
              </LayoutComSidebar>
            }
          />
          <Route
            path="/insights"
            element={
              <LayoutComSidebar>
                <InsightsPage />
              </LayoutComSidebar>
            }
          />
          <Route
            path="/metas"
            element={
              <LayoutComSidebar>
                <Metas />
              </LayoutComSidebar>
            }
          />
          <Route
            path="/perfil"
            element={
              <LayoutComSidebar>
                <Perfil />
              </LayoutComSidebar>
            }
          />
        </Routes>
      </BrowserRouter>
      </TransacoesProvider>
    </ThemeProvider>
  );
}

export default App;
