import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AnaliseGastos from "./pages/AnaliseGastos";
import Transacoes from "./pages/Transacoes";
import InsightsPage from "./pages/InsightsPage";
import Metas from "./pages/Metas";
import Perfil from "./pages/Perfil";
import "./styles/global.css";

function LayoutComSidebar({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
