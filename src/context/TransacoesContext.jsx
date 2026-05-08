import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getTransacoes } from "../services/api";

const TransacoesContext = createContext();

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(""); 

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      try {
        const dados = await getTransacoes();
        setTransacoes(dados);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar as transações.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await getTransacoes();
      setTransacoes(dados);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar as transações.");
    } finally {
      setCarregando(false);
    }
  }, []);

  return (
    <TransacoesContext.Provider value={{ transacoes, carregando, recarregar, erro }}>
      {children}
    </TransacoesContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useTransacoes() {
  return useContext(TransacoesContext);
}