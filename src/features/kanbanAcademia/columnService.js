// Mock temporário enquanto o backend não está pronto
export async function getBoardColumns(boardId) {
  // Simula a obtenção de colunas com base no boardId
  // Retorna um conjunto fixo de colunas e cards para demonstração
  if (boardId === '1') { // Treinos da Semana
    return [
      {
        id: 'col-1',
        title: 'Segunda-feira',
        cards: [
          { id: 'card-1', title: 'Supino Reto', description: '3 séries de 12 repetições', due_date: '2024-06-24' },
          { id: 'card-2', title: 'Agachamento', description: '4 séries de 10 repetições', due_date: '2024-06-24' },
        ],
      },
      {
        id: 'col-2',
        title: 'Terça-feira',
        cards: [],
      },
      {
        id: 'col-3',
        title: 'Quarta-feira',
        cards: [],
      },
      {
        id: 'col-4',
        title: 'Quinta-feira',
        cards: [],
      },
      {
        id: 'col-5',
        title: 'Sexta-feira',
        cards: [],
      },
      {
        id: 'col-6',
        title: 'Sábado',
        cards: [],
      },
      {
        id: 'col-7',
        title: 'Domingo',
        cards: [],
      },
    ];
  } else if (boardId === '2') { // Cardio Semanal
    return [
      {
        id: 'col-8',
        title: 'Segunda-feira',
        cards: [
          { id: 'card-3', title: 'Corrida', description: '30 minutos', due_date: '2024-06-24' },
          { id: 'card-4', title: 'Elíptico', description: '20 minutos', due_date: '2024-06-24' },
        ],
      },
      {
        id: 'col-9',
        title: 'Terça-feira',
        cards: [],
      },
      {
        id: 'col-10',
        title: 'Quarta-feira',
        cards: [],
      },
      {
        id: 'col-11',
        title: 'Quinta-feira',
        cards: [],
      },
      {
        id: 'col-12',
        title: 'Sexta-feira',
        cards: [],
      },
      {
        id: 'col-13',
        title: 'Sábado',
        cards: [],
      },
      {
        id: 'col-14',
        title: 'Domingo',
        cards: [],
      },
    ];
  }
  return [];
}

export async function createColumn(boardId, columnData) {
  console.log(`Mock: Criando coluna para o quadro ${boardId} com dados:`, columnData);
  return { id: `col-${Math.random().toString()}`, ...columnData };
}

export async function updateColumn(columnId, columnData) {
  console.log(`Mock: Atualizando coluna ${columnId} com dados:`, columnData);
  return { id: columnId, ...columnData };
}

export async function deleteColumn(columnId) {
  console.log(`Mock: Deletando coluna ${columnId}`);
  return { success: true };
}

// Método específico para obter colunas de um dia específico
export async function getDiaTreino(boardId, dia) {
  const columns = await getBoardColumns(boardId);
  return columns.find(col => col.title.toLowerCase() === dia.toLowerCase());
}

// Método específico para obter todos os dias da semana
export async function getDiasSemana(boardId) {
  const columns = await getBoardColumns(boardId);
  return columns.filter(col => 
    ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 
     'sexta-feira', 'sábado', 'domingo'].includes(col.title.toLowerCase())
  );
} 