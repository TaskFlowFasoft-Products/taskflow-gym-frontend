// Mock temporário enquanto o backend não está pronto
export async function getBoards() {
  return [
    {
      id: '1',
      name: 'Treinos da Semana',
      columns: [
        { id: 'seg', title: 'Segunda-feira', cards: [] },
        { id: 'ter', title: 'Terça-feira', cards: [] },
        { id: 'qua', title: 'Quarta-feira', cards: [] },
        { id: 'qui', title: 'Quinta-feira', cards: [] },
        { id: 'sex', title: 'Sexta-feira', cards: [] },
        { id: 'sab', title: 'Sábado', cards: [] },
        { id: 'dom', title: 'Domingo', cards: [] },
      ],
    },
    {
      id: '2',
      name: 'Cardio Semanal',
      columns: [
        { id: 'seg', title: 'Segunda-feira', cards: [] },
        { id: 'ter', title: 'Terça-feira', cards: [] },
        { id: 'qua', title: 'Quarta-feira', cards: [] },
        { id: 'qui', title: 'Quinta-feira', cards: [] },
        { id: 'sex', title: 'Sexta-feira', cards: [] },
        { id: 'sab', title: 'Sábado', cards: [] },
        { id: 'dom', title: 'Domingo', cards: [] },
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