import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getTransacoes, usuarioEstaLogado } from "../services/api";
import dadosDemo from "../data/gastos.json";

const TransacoesContext = createContext();

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [isDemo, setIsDemo] = useState(!usuarioEstaLogado());

  const carregar = useCallback(async function () {
    setCarregando(true);
    setErro("");
    try {
      if (!usuarioEstaLogado()) {
        setTransacoes(dadosDemo.transacoes);
        setIsDemo(true);
      } else {
        const dados = await getTransacoes();
        setTransacoes(dados);
        setIsDemo(false);
      }
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar as transações.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(
    function () {
      carregar();
    },
    [carregar],
  );

  const recarregar = useCallback(
    async function () {
      await carregar();
    },
    [carregar],
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
