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
    // Garantindo que os campos obrigatórios estejam presentes e no formato correto
    const payload = {
      board_id: Number(taskData.board_id),
      column_id: Number(taskData.column_id),
      title: String(taskData.title),
      // Campos opcionais com valores padrão null
      sets_reps: taskData.sets_reps || null,
      distance_time: taskData.distance_time || null,
      pace_speed: taskData.pace_speed || null,
      run_screenshot_base64: taskData.run_screenshot_base64 || null,
      rpe_scale: taskData.rpe_scale ? Number(taskData.rpe_scale) : null,
      muscle_group: taskData.muscle_group || null
    };

    // Validação adicional para rpe_scale
    if (payload.rpe_scale !== null) {
      if (payload.rpe_scale < 1 || payload.rpe_scale > 10) {
        return {
          success: false,
          message: 'A escala RPE deve estar entre 1 e 10',
          errors: ['rpe_scale']
        };
      }
    }

    console.log('Payload sendo enviado:', payload);

    const response = await axios.post(`${API_URL}/gym/tasks`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Erro ao criar tarefa:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      payload: taskData,
      error: error.message
    });

    if (error.response?.status === 422) {
      return {
        success: false,
        message: 'Dados inválidos. Por favor, verifique os campos.',
        errors: error.response?.data?.detail || [],
        status: 422
      };
    }

    return { 
      success: false, 
      message: error.response?.data?.detail || 'Erro ao criar tarefa.',
      errors: error.response?.data?.errors || [],
      status: error.response?.status
    };
  }
};

const updateTask = async (taskData) => {
  try {
    // Campos obrigatórios
    const payload = {
      task_id: Number(taskData.task_id),
      board_id: Number(taskData.board_id),
    };

    // Adiciona campos opcionais apenas se foram fornecidos
    if (taskData.column_id !== undefined) {
      payload.column_id = Number(taskData.column_id);
    }
    if (taskData.title !== undefined) {
      payload.title = String(taskData.title).trim();
    }
    if (taskData.sets_reps !== undefined) {
      payload.sets_reps = taskData.sets_reps ? String(taskData.sets_reps).trim() : null;
    }
    if (taskData.distance_time !== undefined) {
      payload.distance_time = taskData.distance_time ? String(taskData.distance_time).trim() : null;
    }
    if (taskData.pace_speed !== undefined) {
      payload.pace_speed = taskData.pace_speed ? String(taskData.pace_speed).trim() : null;
    }
    if (taskData.run_screenshot_base64 !== undefined) {
      payload.run_screenshot_base64 = taskData.run_screenshot_base64 || null;
    }
    if (taskData.rpe_scale !== undefined) {
      const numericRpe = Number(taskData.rpe_scale);
      if (!isNaN(numericRpe) && numericRpe >= 1 && numericRpe <= 10) {
        payload.rpe_scale = numericRpe;
      } else if (taskData.rpe_scale === null || String(taskData.rpe_scale).trim() === '') {
        payload.rpe_scale = null;
      }
    }
    if (taskData.muscle_group !== undefined) {
      payload.muscle_group = taskData.muscle_group ? String(taskData.muscle_group).trim() : null;
    }

    console.log('Payload de atualização:', payload);

    const response = await axios.put(`${API_URL}/gym/tasks`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      payload: taskData,
      error: error.message
    });

    if (error.response?.status === 422) {
      return {
        success: false,
        message: 'Dados inválidos. Por favor, verifique os campos.',
        errors: error.response?.data?.detail || [],
        status: 422
      };
    }

    return { 
      success: false, 
      message: error.response?.data?.detail || 'Erro ao atualizar tarefa.',
      errors: error.response?.data?.errors || [],
      status: error.response?.status
    };
  }
};

const deleteTask = async (taskData) => {
  try {
    const payload = {
      task_id: Number(taskData.task_id),
      board_id: Number(taskData.board_id)
    };

    console.log('Payload de deleção:', payload);

    const response = await axios.delete(`${API_URL}/gym/tasks`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
    });
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Erro ao deletar tarefa:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      payload: taskData,
      error: error.message
    });

    if (error.response?.status === 422) {
      return {
        success: false,
        message: 'Dados inválidos. Por favor, verifique os campos.',
        errors: error.response?.data?.detail || [],
        status: 422
      };
    }

    return { 
      success: false, 
      message: error.response?.data?.detail || 'Erro ao deletar tarefa.',
      errors: error.response?.data?.errors || [],
      status: error.response?.status
    };
  }
};

export { getTasks, createTask, updateTask, deleteTask }; 