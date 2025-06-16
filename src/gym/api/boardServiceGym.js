import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const createBoard = async (templateId) => {
  try {
    const response = await axios.post(`${API_URL}/gym/boards`, { id: templateId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, board: response.data, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao criar quadro.' };
  }
};

const getBoards = async () => {
  try {
    const response = await axios.get(`${API_URL}/gym/boards`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response && response.data && Array.isArray(response.data.boards)) {
      return response.data.boards;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao listar quadros:', error);
    return [];
  }
};

const deleteBoard = async (boardId) => {
  try {
    const response = await axios.delete(`${API_URL}/gym/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, board_id: response.data.board_id, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao deletar quadro.' };
  }
};

const getBoardTemplates = async () => {
  try {
    const response = await axios.get(`${API_URL}/gym/boards/templates`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data.templates;
  } catch (error) {
    console.error('Erro ao listar modelos de quadros:', error);
    return [];
  }
};

export { createBoard, getBoards, deleteBoard, getBoardTemplates }; 