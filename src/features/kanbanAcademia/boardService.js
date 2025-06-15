// Mock temporário enquanto o backend não está pronto
export async function getBoards() {
  return [
    {
      id: '1',
      name: 'Treinos da Semana',
      columns: [
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
      ],
    },
    {
      id: '2',
      name: 'Cardio Semanal',
      columns: [
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
      ],
    },
  ];
}

// Métodos específicos para o contexto de academia
export async function getTreinoSemanal() {
  const boards = await getBoards();
  return boards.find(board => board.name === 'Treinos da Semana');
}

export async function getCardioSemanal() {
  const boards = await getBoards();
  return boards.find(board => board.name === 'Cardio Semanal');
}

export async function createBoard(boardData) {
  console.log('Mock: Criando quadro com dados:', boardData);
  return { id: Math.random().toString(), ...boardData };
}

export async function updateBoard(boardId, boardData) {
  console.log(`Mock: Atualizando quadro ${boardId} com dados:`, boardData);
  return { id: boardId, ...boardData };
}

export async function deleteBoard(boardId) {
  console.log(`Mock: Deletando quadro ${boardId}`);
  return { success: true };
}