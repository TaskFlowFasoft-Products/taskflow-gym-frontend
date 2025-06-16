import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getTasks = async (boardId, columnId) => {
  try {
    const response = await axios.get(`${API_URL}/gym/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      params: { board_id: boardId, column_id: columnId },
    });
    return response.data.tasks;
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    return [];
  }
};

const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/gym/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao criar tarefa.' };
  }
};

const updateTask = async (taskData) => {
  try {
    const response = await axios.put(`${API_URL}/gym/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao atualizar tarefa.' };
  }
};

const deleteTask = async (taskData) => {
  try {
    const response = await axios.delete(`${API_URL}/gym/tasks`, { data: taskData }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Erro ao deletar tarefa.' };
  }
};

export { getTasks, createTask, updateTask, deleteTask }; 