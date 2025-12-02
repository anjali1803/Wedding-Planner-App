import api from './api';

export const getWeddings = async () => {
  const response = await api.get('/weddings');
  return response.data;
};

export const getWedding = async (id) => {
  const response = await api.get(`/weddings/${id}`);
  return response.data;
};

export const createWedding = async (weddingData) => {
  const response = await api.post('/weddings', weddingData);
  return response.data;
};

export const updateWedding = async (id, weddingData) => {
  const response = await api.put(`/weddings/${id}`, weddingData);
  return response.data;
};

export const deleteWedding = async (id) => {
  const response = await api.delete(`/weddings/${id}`);
  return response.data;
};
