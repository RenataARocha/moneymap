import { useEffect, useState } from "react";
import {
  calcularTotalGastos,
  calcularTotalEntradas,
  calcularPorCategoria,
  maiorCategoria,
  calcularVariacaoMensal,
  calcularPorcentagens,
  detectarPadroes,
  gerarRecomendacoes,
  ultimas5Transacoes,
  formatarMoeda,
} from "../utils/calculations";
import { getUsuario, getTransacoes, getMesAnterior } from "../services/api";
import CardResumo from "../components/CardResumo";
import CardCategoria from "../components/CardCategoria";
import Chart from "../components/Chart";
import Insights from "../components/Insights";
import TransactionList from "../components/TransactionList";
import imgSaldo from "../assets/saldo.png";
import imgGasto from "../assets/gasto.png";
import imgCategoria from "../assets/categoria.png";
import imgInvestimento from "../assets/investimento.png";
import "./Home.css";

function Home() {
  const [usuario, setUsuario] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [mesAnterior, setMesAnterior] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("05");
  const [percentualInvestimento] = useState(10);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);

        const [usuarioData, transacoesData, mesAnteriorData] =
          await Promise.all([getUsuario(), getTransacoes(), getMesAnterior()]);

        setUsuario(usuarioData);
        setTransacoes(transacoesData);
        setMesAnterior(mesAnteriorData);
      } catch (err) {
        console.log(err);

        setErro(
          "Não foi possível carregar os dados. Tente novamente mais tarde.",
        );
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  if (carregando) {
    return <div className="home">Carregando dados...</div>;
  }

  if (erro) {
    return <div className="home">{erro}</div>;
  }

  if (!usuario || !mesAnterior) {
    return <div className="home">Carregando...</div>;
  }

  const transacoesFiltradas = transacoes.filter(
    (t) => t.data.split("-")[1] === mesSelecionado,
  );

  const totalGastos = calcularTotalGastos(transacoesFiltradas);

  const totalEntradas = calcularTotalEntradas(transacoesFiltradas);

  const valorInvestimento = (totalEntradas * percentualInvestimento) / 100;

  const porCategoria = calcularPorCategoria(transacoesFiltradas);

  const [catNome] = maiorCategoria(porCategoria);

  const porcentagens = calcularPorcentagens(porCategoria, totalGastos);

  const variacaoGastos = calcularVariacaoMensal(
    totalGastos,
    mesAnterior.totalGastos,
  );

  const padroes = detectarPadroes(transacoesFiltradas, mesAnterior);

  const recomendacoes = gerarRecomendacoes(
    porCategoria,
    totalGastos,
    mesAnterior,
  );

  const ultimas = ultimas5Transacoes(transacoesFiltradas);

  return (
    <div className="home">
      <div className="home__filtro">
        <select
          className="home__select"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        >
          <option value="01">Janeiro 2026</option>
          <option value="02">Fevereiro 2026</option>
          <option value="03">Março 2026</option>
          <option value="04">Abril 2026</option>
          <option value="05">Maio 2026</option>
          <option value="06">Junho 2026</option>
          <option value="07">Julho 2026</option>
          <option value="08">Agosto 2026</option>
          <option value="09">Setembro 2026</option>
          <option value="10">Outubro 2026</option>
          <option value="11">Novembro 2026</option>
          <option value="12">Dezembro 2026</option>
        </select>
      </div>

      <div className="home__cards-topo">
        <CardResumo
          icone={imgSaldo}
          label="Receita do Mês"
          valor={formatarMoeda(totalEntradas)}
        />

        <CardResumo
          icone={imgGasto}
          label="Gasto do Mês"
          valor={formatarMoeda(totalGastos)}
          variacao={variacaoGastos}
        />

        <CardCategoria
          categoria={catNome}
          valor={porCategoria[catNome]}
          percentual={porcentagens[catNome]}
          iconePadrao={imgCategoria}
        />

        <CardResumo
          icone={imgInvestimento}
          label="Investimento do Mês"
          valor={`${percentualInvestimento}% • ${formatarMoeda(
            valorInvestimento,
          )}`}
        />
      </div>

      <div className="home__meio">
        <div className="home__chart-card">
          <h3 className="home__secao-titulo">
            Distribuição de Consumo por Categorias (%)
          </h3>

          <Chart porCategoria={porCategoria} />
        </div>

        <Insights padroes={padroes} recomendacoes={recomendacoes} />
      </div>

      <TransactionList transacoes={ultimas} />
    </div>
  );
}

export default Home;
