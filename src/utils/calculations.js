

// --- Funções básicas de cálculo (implementação mínima) ---

import imgReduzir from "../assets/reduzir.png";
import imgControlar from "../assets/controlar.png";
import imgParabens from "../assets/parabens.png";
import imgContas from "../assets/contas.png";
import imgOutros from "../assets/outros.png";
import imgInvestimento from "../assets/investimento.png"

export function calcularTotalGastos(transacoes) {
  //certo
  return transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);
}

export function calcularTotalEntradas(transacoes) {
  //certo
  return transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);
}

export function calcularPorCategoria(transacoes) {
  //
  const totais = {};
  transacoes
    .filter((t) => t.tipo === "saida")
    .forEach((t) => {
      totais[t.categoria] = (totais[t.categoria] || 0) + t.valor;
    });
  return totais;
}

export function maiorCategoria(porCategoria) {
  const entries = Object.entries(porCategoria);
  if (entries.length === 0) return ["—", 0];
  return entries.sort((a, b) => b[1] - a[1])[0];
}

export function calcularVariacaoMensal(totalAtual, totalAnterior) {
  if (totalAnterior === 0) return 0;
  return ((totalAtual - totalAnterior) / totalAnterior) * 100;
}

export function calcularPorcentagens(porCategoria, total) {
  const resultado = {};
  for (const [cat, valor] of Object.entries(porCategoria)) {
    resultado[cat] = parseFloat(((valor / total) * 100).toFixed(1));
  }
  return resultado;
}

export function detectarPadroes(transacoes, mesAnterior) {
  const padroes = [];
  const porCategoria = calcularPorCategoria(transacoes);

  for (const [cat, valorAtual] of Object.entries(porCategoria)) {
    const valorAnterior = mesAnterior.porCategoria[cat];
    if (!valorAnterior) continue;
    const variacao = calcularVariacaoMensal(valorAtual, valorAnterior);
    if (variacao >= 15) {
      padroes.push({
        tipo: "alta",
        categoria: cat,
        mensagem: `${cat} subiu ${variacao.toFixed(0)}%`,
        detalhe: `Gasto com ${cat} acima da média`,
      });
    } else if (variacao <= -10) {
      padroes.push({
        tipo: "baixa",
        categoria: cat,
        mensagem: `${cat} reduziu ${Math.abs(variacao).toFixed(0)}%`,
        detalhe: `Ótimo controle em ${cat}!`,
      });
    } else {
      padroes.push({
        tipo: "estavel",
        categoria: cat,
        mensagem: `${cat} estável`,
        detalhe: "Dentro da média — ótimo!",
      });
    }
  }

  return padroes.slice(0, 3);
}

export function gerarRecomendacoes(
  porCategoria,
  total,
  mesAnterior = null,
  transacoes = [],
) {
  const recomendacoes = [];

  // 1. Categoria dominante (>30% do total)
  const [maiorCat, maiorValor] = maiorCategoria(porCategoria);
  const pct = (maiorValor / total) * 100;
  if (pct > 30) {
    const economia = maiorValor * 0.1;
    recomendacoes.push({
        imagem:imgContas,
      icone: "💡",
      titulo: "Categoria dominante",
      valor: `R$ ${economia.toFixed(0)}/mês`,
      descricao: `${maiorCat} representa ${pct.toFixed(0)}% dos seus gastos. Reduzindo 10%, você economiza R$ ${(economia * 12).toFixed(0)}/ano.`,
    });
  }

  // 2. Comparação com mês anterior por categoria
  if (mesAnterior?.porCategoria) {
    for (const [cat, valorAtual] of Object.entries(porCategoria)) {
      const valorAnterior = mesAnterior.porCategoria[cat];
      if (!valorAnterior) continue;
      const variacao = ((valorAtual - valorAnterior) / valorAnterior) * 100;
      if (variacao > 20) {
        recomendacoes.push({
            imagem:imgOutros,
          icone: "📈",
          titulo: `Alta em ${cat}`,
          valor: `+${variacao.toFixed(0)}% vs mês anterior`,
          descricao: `Você gastou R$ ${(valorAtual - valorAnterior).toFixed(0)} a mais em ${cat} comparado ao mês passado.`,
        });
      }
      for (const [cat, valorAtual] of Object.entries(porCategoria)) {
        const valorAnterior = mesAnterior.porCategoria[cat];
        if (!valorAnterior) continue;
        const variacao = ((valorAtual - valorAnterior) / valorAnterior) * 100;
        if (variacao < -5) {
          recomendacoes.push({
            imagem:imgParabens,
            icone: "🎉",
            titulo: `Menos gastos em ${cat}`,
            valor: null,
            descricao: `Você reduziu ${Math.abs(variacao).toFixed(0)}% em ${cat} vs mês passado. Continue assim!`,
          });
        }
      }
    }
  }

  // 3. Gastos recorrentes com o mesmo fornecedor (≥3x no mês)
  if (transacoes.length > 0) {
    const frequencia = transacoes
      .filter((t) => t.tipo === "saida")
      .reduce((acc, t) => {
        acc[t.descricao] = (acc[t.descricao] || 0) + 1;
        return acc;
      }, {});

    for (const [desc, qtd] of Object.entries(frequencia)) {
      if (qtd >= 3) {
        const totalDesc = transacoes
          .filter((t) => t.descricao === desc)
          .reduce((s, t) => s + t.valor, 0);
        recomendacoes.push({
            imagem:imgReduzir,
          icone: "🔁",
          titulo: `Gasto frequente: ${desc}`,
          valor: `${qtd}x — R$ ${totalDesc.toFixed(2)}`,
          descricao: `Você usou ${desc} ${qtd} vezes este mês. Vale avaliar se há alternativas mais econômicas.`,
        });
      }
    }
  }

  // 4. Taxa de poupança (receita vs gastos)
  const receitas = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((s, t) => s + t.valor, 0);

  if (receitas > 0) {
    const taxaPoupanca = ((receitas - total) / receitas) * 100;
    if (taxaPoupanca < 10) {
      recomendacoes.push({
        imagem:imgContas,
        icone: "🏦",
        titulo: "Taxa de poupança baixa",
        valor: `${taxaPoupanca.toFixed(0)}% da receita`,
        descricao: `Você está poupando menos de 10% da sua renda. O ideal é guardar ao menos 20% (R$ ${(receitas * 0.2).toFixed(0)}/mês).`,
      });
    } else if (taxaPoupanca >= 20) {
      recomendacoes.push({
        imagem:imgInvestimento,
        icone: "🌟",
        titulo: "Ótima poupança!",
        valor: `${taxaPoupanca.toFixed(0)}% da receita`,
        descricao: `Parabéns! Você está guardando R$ ${(receitas - total).toFixed(0)} este mês — acima da meta de 20%.`,
      });
    }
  }

  // 5. Lazer acima de 15% dos gastos
  const lazer = porCategoria["Lazer"] || 0;
  const pctLazer = (lazer / total) * 100;
  if (pctLazer > 15) {
    recomendacoes.push({
        imagem:imgControlar,
      icone: "🎬",
      titulo: "Lazer elevado",
      valor: `${pctLazer.toFixed(0)}% dos gastos`,
      descricao: `Lazer está acima de 15% do total. Revise assinaturas ativas — Spotify, Netflix e outros somam R$ ${porCategoria["Lazer"].toFixed(2)}.`,
    });
  }

  // 6. Fallback positivo
  if (recomendacoes.length === 0) {
    recomendacoes.push({
        imagem:imgParabens,
      icone: "🎯",
      titulo: "Ótimo trabalho!",
      valor: null,
      descricao: "Seus gastos estão equilibrados este mês. Continue assim!",
    });
  }

  return recomendacoes;
}

export function ultimas5Transacoes(transacoes) {
  return [...transacoes]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5);
}

export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}