import axios from 'axios';
import { getTasks } from './taskServiceGym';

const API_URL = import.meta.env.VITE_API_URL;

const getBoardColumns = async (boardId) => {
  if (!boardId || isNaN(Number(boardId))) {
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/column/${boardId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const columns = response.data.columns || [];

    // Buscar os cards para cada coluna
    const columnsWithCards = await Promise.all(
      columns.map(async (column) => {
        try {
          const tasks = await getTasks(boardId, column.id);
          return {
            ...column,
            cards: tasks || []
          };
        } catch (taskError) {
          console.error('Erro ao buscar cards da coluna:', taskError);
          return { ...column, cards: [] };
        }
      })
    );

    return columnsWithCards;
  } catch (error) {
    console.error('Erro ao listar colunas:', error);
    return [];
  }
};

const createColumn = async (boardId, title) => {
  try {
    const response = await axios.post(`${API_URL}/column`, { 
      title,
      board_id: boardId 
    }, {
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
    const response = await axios.put(`${API_URL}/column/${boardId}`, { 
      column_id: columnId,
      title: newTitle 
    }, {
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
      data: { 
        id: columnId,
        board_id: boardId 
      }
    });
    return { success: true, ...response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao deletar coluna.' };
  }
};

export { getBoardColumns, createColumn, updateColumn, deleteColumn }; 