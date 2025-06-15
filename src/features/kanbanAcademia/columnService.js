// Mock temporário enquanto o backend não está pronto
export async function getBoardColumns(boardId) {
  // Retorna as colunas padrão para qualquer board
  return [
    { id: 'seg', title: 'Segunda-feira', cards: [] },
    { id: 'ter', title: 'Terça-feira', cards: [] },
    { id: 'qua', title: 'Quarta-feira', cards: [] },
    { id: 'qui', title: 'Quinta-feira', cards: [] },
    { id: 'sex', title: 'Sexta-feira', cards: [] },
    { id: 'sab', title: 'Sábado', cards: [] },
    { id: 'dom', title: 'Domingo', cards: [] },
  ];
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