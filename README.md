# 💰 MoneyMap — Gestor de Transações Financeiras

Um aplicativo moderno e responsivo para controlar despesas, visualizar insights financeiros e gerenciar metas de poupança. Construído com **React**, **Vite** e uma API mock com **json-server**.

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/RenataARocha/moneymap.git
cd moneymap
```

2. Instale as dependências
```bash
npm install
```

### Executar o Projeto

**Terminal 1 — Iniciar a API**
```bash
npm run server
```
A API rodará em `http://localhost:3001`

**Terminal 2 — Iniciar o App**
```bash
npm run dev
```
O app rodará em `http://localhost:5173`

## 📡 API — json-server

A API mock é gerenciada pelo **json-server**, que lê dados do arquivo `db.json`.

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/usuario` | Retorna dados do usuário autenticado |
| GET | `/transacoes` | Lista todas as transações do usuário |
| POST | `/transacoes` | Adiciona uma nova transação |
| DELETE | `/transacoes` | Deleta uma transação por vez |
| GET | `/mesAnterior` | Retorna dados comparativos do mês anterior |

### Estrutura da API

**GET /usuario**
```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "saldoAtual": 2450.00
}
```

**GET /transacoes**
```json
[
  {
    "id": 1,
    "descricao": "iFood",
    "categoria": "Alimentação",
    "valor": 85.90,
    "tipo": "saida",
    "data": "2026-05-01",
    "metodoPagamento": "cartao"
  }
]
```

**POST /transacoes**
```bash
curl -X POST http://localhost:3001/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Novo gasto",
    "categoria": "Lazer",
    "valor": 50.00,
    "tipo": "saida",
    "data": "2026-05-15",
    "metodoPagamento": "pix"
  }'
```

**DELETE /transacoes/:id**
```bash
curl -X DELETE http://localhost:3001/transacoes/1
```

**Resposta**
```json
{}
```

## 🏗️ Serviço de API

O serviço centralizado em `src/services/api.js` encapsula todas as chamadas à API:

```javascript
import {
  getUsuario,
  getTransacoes,
  getMesAnterior,
  postTransacao
} from '../services/api';

// Exemplos de uso
const usuario = await getUsuario();
const transacoes = await getTransacoes();
const mesAnterior = await getMesAnterior();
await postTransacao({ descricao: 'Novo', categoria: 'Lazer', valor: 10, tipo: 'saida', data: '2026-05-15', metodoPagamento: 'pix' });
```

## 🔌 Integração nos Componentes

### Login (`src/pages/Login.jsx`)
- Consome `GET /usuario` para validar e-mail
- Redireciona para `/dashboard` após autenticação bem-sucedida

### Home (`src/pages/Home.jsx`)
- Carrega dados via `getUsuario()`, `getTransacoes()` e `getMesAnterior()`
- Exibe saldo, gastos, categorias e transações recentes

### Transações (`src/pages/Transacoes.jsx`)
- Lista e filtra transações via `GET /transacoes`
- Suporta ordenação por data e categoria
- Deleta a transação de sua escolha pelo iícone "🗑️"

## 📂 Estrutura do Projeto

```
src/
├── services/
│   └── api.js           # Serviço centralizado de API
├── pages/
│   ├── Login.jsx        # Integrado com getUsuario()
│   ├── Home.jsx         # Integrado com API
│   ├── Transacoes.jsx   # Integrado com getTransacoes()
│   └── ...
├── components/
├── context/
├── utils/
└── styles/
db.json                  # Dados mock da API
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Iniciar app em modo desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar ESLint
npm run server   # Iniciar json-server na porta 3001
```

## 📝 Notas

- A API roda localmente na porta `3001`
- O app (Vite) roda localmente na porta `5173`
- Ambos devem estar rodando simultaneamente para o funcionamento completo
- Dados são persistidos em `db.json` durante a sessão do json-server
