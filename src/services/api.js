// API service for consuming the mock json-server backend
const API_BASE_URL = 'http://localhost:3001';

export const getUsuario = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario`);
    if (!response.ok) {
      throw new Error('Failed to fetch usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching usuario:', error);
    throw error;
  }
};

export const getTransacoes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transacoes`);
    if (!response.ok) {
      throw new Error('Failed to fetch transacoes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transacoes:', error);
    throw error;
  }
};

export const getMesAnterior = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mesAnterior`);
    if (!response.ok) {
      throw new Error('Failed to fetch mesAnterior');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching mesAnterior:', error);
    throw error;
  }
};

export const postTransacao = async (transacao) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transacao),
    });
    if (!response.ok) {
      throw new Error('Failed to post transacao');
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting transacao:', error);
    throw error;
  }
};