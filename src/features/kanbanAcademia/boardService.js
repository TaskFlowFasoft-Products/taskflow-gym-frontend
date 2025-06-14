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