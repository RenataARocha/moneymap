import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getTransacoes } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import dadosDemo from "../data/gastos.json";

const TransacoesContext = createContext();

export function TransacoesProvider({ children }) {
  const { autenticado } = useAuth();
  const [transacoes, setTransacoes] = useState(dadosDemo.transacoes);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [isDemo, setIsDemo] = useState(true);

  async function buscarTransacoes(logado) {
    setCarregando(true);
    setErro("");
    try {
      if (!logado) {
        setTransacoes(dadosDemo.transacoes);
        setIsDemo(true);
      } else {
        const dados = await getTransacoes();
        setTransacoes(Array.isArray(dados) ? dados : []);
        setIsDemo(false);
      }
    } catch (err) {
      console.error(err);
      setTransacoes(dadosDemo.transacoes);
      setIsDemo(true);
      setErro("");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(
    function () {
      buscarTransacoes(autenticado);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [autenticado],
  );

  const recarregar = useCallback(
    async function () {
      await buscarTransacoes(autenticado);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [autenticado],
  );

  return (
    <TransacoesContext.Provider
      value={{ transacoes, carregando, recarregar, erro, isDemo }}
    >
      {children}
    </TransacoesContext.Provider>
  );
}

export function useTransacoes() {
  return useContext(TransacoesContext);
}
