// ⚠️ ARQUIVO PROVISÓRIO — criado apenas para desbloquear o build
// Substituir pela implementação definitiva da responsável pela lógica de dados
// Contato: [nome/usuário da colega aqui]

// TODO: remover este arquivo quando calculations.js definitivo for entregue

// --- Funções básicas de cálculo (implementação mínima) ---

export function calcularTotalGastos(transacoes) {
    return transacoes
        .filter((t) => t.tipo === "saida")
        .reduce((acc, t) => acc + t.valor, 0);
}

export function calcularTotalEntradas(transacoes) {
    return transacoes
        .filter((t) => t.tipo === "entrada")
        .reduce((acc, t) => acc + t.valor, 0);
}

export function calcularPorCategoria(transacoes) {
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
            padroes.push({ tipo: "alta", categoria: cat, mensagem: `${cat} subiu ${variacao.toFixed(0)}%`, detalhe: `Gasto com ${cat} acima da média` });
        } else if (variacao <= -10) {
            padroes.push({ tipo: "baixa", categoria: cat, mensagem: `${cat} reduziu ${Math.abs(variacao).toFixed(0)}%`, detalhe: `Ótimo controle em ${cat}!` });
        } else {
            padroes.push({ tipo: "estavel", categoria: cat, mensagem: `${cat} estável`, detalhe: "Dentro da média — ótimo!" });
        }
    }

    return padroes.slice(0, 3);
}

export function gerarRecomendacoes(porCategoria, total) {
    const [maiorCat, maiorValor] = maiorCategoria(porCategoria);
    const pct = (maiorValor / total) * 100;
    if (pct > 30) {
        const economia = maiorValor * 0.1;
        return [{ icone: "💡", titulo: "Economia potencial", valor: `R$ ${economia.toFixed(0)}/mês`, descricao: `Reduzindo 10% em ${maiorCat} você economiza R$ ${(economia * 12).toFixed(0)} por ano.` }];
    }
    return [{ icone: "🎯", titulo: "Ótimo trabalho!", valor: null, descricao: "Seus gastos estão controlados este mês. Continue assim!" }];
}

export function ultimas5Transacoes(transacoes) {
    return [...transacoes].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
}

export function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}