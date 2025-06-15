// Mock temporário enquanto o backend não está pronto
export async function getTasks() {
  // Retorna alguns exercícios de exemplo
  return [
    {
      id: '1',
      title: 'Supino Reto',
      description: '3 séries de 12 repetições',
      type: 'exercicio',
      grupoMuscular: 'peito',
      cards: []
    },
    {
      id: '2',
      title: 'Agachamento',
      description: '4 séries de 10 repetições',
      type: 'exercicio',
      grupoMuscular: 'pernas',
      cards: []
    },
    {
      id: '3',
      title: 'Corrida',
      description: '30 minutos',
      type: 'cardio',
      grupoMuscular: 'cardio',
      cards: []
    }
  ];
}

// Método específico para obter exercícios de um dia específico
export async function getExerciciosDia(boardId, dia) {
  const tasks = await getTasks(boardId, dia);
  return tasks.filter(task => task.type === 'exercicio');
}

// Método específico para obter exercícios por tipo
export async function getExerciciosPorTipo(boardId, columnId, tipo) {
  const tasks = await getTasks(boardId, columnId);
  return tasks.filter(task => task.tipo === tipo);
}

// Método específico para obter exercícios por grupo muscular
export async function getExerciciosPorGrupoMuscular(boardId, columnId, grupoMuscular) {
  const tasks = await getTasks(boardId, columnId);
  return tasks.filter(task => task.grupoMuscular === grupoMuscular);
}

// Mock temporário enquanto o backend não está pronto
export async function updateTask(taskId, taskData) {
  console.log(`Mock: Atualizando card ${taskId} com dados:`, taskData);
  return { success: true };
}

export async function createTask(taskData) {
  console.log(`Mock: Criando card com dados:`, taskData);
  return { 
    id: Math.random().toString(),
    ...taskData,
    success: true 
  };
}

export async function deleteTask(taskId) {
  console.log(`Mock: Deletando card ${taskId}`);
  return { success: true };
} 