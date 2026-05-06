import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AnaliseGastos from "./pages/AnaliseGastos";
import Transacoes from "./pages/Transacoes";
import InsightsPage from "./pages/InsightsPage";
import "./styles/global.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/analise" element={<AnaliseGastos />} />
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/insights" element={<InsightsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
