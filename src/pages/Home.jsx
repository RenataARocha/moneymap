// DADOS PROVISÓRIOS — apagar depois que a menina de dados entregar o gastos.json
import dados from "../data/gastos.json";
import "./Home.css";

// LÓGICA PROVISÓRIA — apagar depois que a menina de lógica entregar o calculations.js
import {
  calcularTotalGastos,
  calcularPorCategoria,
  maiorCategoria,
  calcularVariacaoMensal,
  calcularPorcentagens,
  detectarPadroes,
  gerarRecomendacoes,
  ultimas5Transacoes,
  formatarMoeda,
} from "../utils/calculations";

import CardResumo from "../components/CardResumo";
import CardCategoria from "../components/CardCategoria";
import Chart from "../components/Chart";
import Insights from "../components/Insights";
import TransactionList from "../components/TransactionList";
import imgSaldo from "../assets/saldo.png";
import imgGasto from "../assets/gasto.png";
import imgCategoria from "../assets/categoria.png";

function Home() {
  const { usuario, transacoes, mesAnterior } = dados;

  const totalGastos = calcularTotalGastos(transacoes);
  const porCategoria = calcularPorCategoria(transacoes);
  const [catNome] = maiorCategoria(porCategoria);
  const porcentagens = calcularPorcentagens(porCategoria, totalGastos);
  const variacaoGastos = calcularVariacaoMensal(
    totalGastos,
    mesAnterior.totalGastos,
  );
  const padroes = detectarPadroes(transacoes, mesAnterior);
  const recomendacoes = gerarRecomendacoes(
    porCategoria,
    totalGastos,
    mesAnterior,
  );
  const ultimas = ultimas5Transacoes(transacoes);

  return (
    <div className="home">
      <div className="home__cards-topo">
        <CardResumo
          icone={imgSaldo} // Variável importada
          label="Saldo Atual"
          valor={formatarMoeda(usuario.saldoAtual)}
        />
        <CardResumo
          icone={imgGasto} // Variável importada
          label="Gasto do Mês"
          valor={formatarMoeda(totalGastos)}
          variacao={variacaoGastos}
        />
        <CardCategoria
          categoria={catNome}
          valor={porCategoria[catNome]}
          percentual={porcentagens[catNome]}
          iconePadrao={imgCategoria} // Passando a imagem padrão se quiser usar
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
