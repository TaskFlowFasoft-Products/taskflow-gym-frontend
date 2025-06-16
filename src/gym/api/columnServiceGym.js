import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getBoardColumns = async (boardId) => {
  if (!boardId || isNaN(Number(boardId))) {
    console.error('ID do quadro inválido:', boardId);
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/column/${boardId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data.columns || [];
  } catch (error) {
    console.error('Erro ao listar colunas:', error);
    return [];
  }
};

const createColumn = async (boardId, title) => {
  try {
    const response = await axios.post(`${API_URL}/column`, { board_id: boardId, title }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, column: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao criar coluna.' };
  }
};

const updateColumn = async (boardId, columnId, newTitle) => {
  try {
    const response = await axios.put(`${API_URL}/column/${boardId}`, { column_id: columnId, title: newTitle }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao atualizar coluna.' };
  }
};

const deleteColumn = async (boardId, columnId) => {
  try {
    const response = await axios.delete(`${API_URL}/column`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      data: { id: columnId, board_id: boardId } 
    });
    return { success: true, ...response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao deletar coluna.' };
  }
};

export { getBoardColumns, createColumn, updateColumn, deleteColumn }; 