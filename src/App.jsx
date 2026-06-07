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
import { TransacoesProvider } from "./context/TransacoesContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Toast from "./components/Toast";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AnaliseGastos from "./pages/AnaliseGastos";
import Transacoes from "./pages/Transacoes";
import InsightsPage from "./pages/InsightsPage";
import Metas from "./pages/Metas";
import Perfil from "./pages/Perfil";
import Investimentos from "./pages/Investimentos";
import ModalTransacao from "./components/ModalTransacao";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Simulador from "./pages/Simulador";
import "./styles/globals.css";

function LayoutComSidebar() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoModal, setTipoModal] = useState("saida");
  const [toastMsg, setToastMsg] = useState("");
  const { logout, autenticado } = useAuth();

  const nomeUsuario = autenticado
    ? localStorage.getItem("moneymap-usuario-nome") || ""
    : "";
  const navigate = useNavigate();

  function mostrarToast(msg) {
    setToastMsg(msg);
    setTimeout(function () {
      setToastMsg("");
    }, 3000);
  }

  function handleLogout() {
    logout();
    navigate("/dashboard");
  }

  return (
    <div className="layout">
      <Toast mensagem={toastMsg} />

      <button
        className="menu-toggle"
        onClick={function () {
          setSidebarAberta(true);
        }}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {sidebarAberta && (
        <div
          className="overlay"
          onClick={function () {
            setSidebarAberta(false);
          }}
        />
      )}

      <Sidebar
        aberta={sidebarAberta}
        fechar={function () {
          setSidebarAberta(false);
        }}
        onLogout={handleLogout}
      />

      <div className="layout__main">
        <Header
          nomeUsuario={nomeUsuario}
          autenticado={autenticado}
          onAbrirModal={function (tipo) {
            setTipoModal(tipo || "saida");
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
          onAdicionar={function (nova) {
            const msg =
              nova.tipo === "saida"
                ? "✅ Despesa adicionada!"
                : "✅ Receita adicionada!";
            setModalAberto(false);
            mostrarToast(msg);
            navigate("/transacoes");
          }}
          onFechar={function () {
            setModalAberto(false);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <TransacoesProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route element={<LayoutComSidebar />}>
                <Route path="/dashboard" element={<Home />} />
                <Route path="/analise" element={<AnaliseGastos />} />
                <Route path="/transacoes" element={<Transacoes />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/metas" element={<Metas />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/investimentos" element={<Investimentos />} />
                <Route path="/simulador" element={<Simulador />} />
              </Route>
            </Routes>
          </TransacoesProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
