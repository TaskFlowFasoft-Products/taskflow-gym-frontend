import React, { useState, useEffect } from 'react';
import BoardWorkspace from '../core/pages/boards/BoardWorkspace';
import * as boardServiceGym from './api/boardServiceGym';
import * as columnServiceGym from './api/columnServiceGym';
import * as taskServiceGym from './api/taskServiceGym';

const GymBoardWorkspace = () => {
  const [boardTemplates, setBoardTemplates] = useState([]);

  useEffect(() => {
    const fetchBoardTemplates = async () => {
      const templates = await boardServiceGym.getBoardTemplates();
      setBoardTemplates(templates);
    };
    fetchBoardTemplates();
  }, []);

  const gymServices = {
    boardService: boardServiceGym,
    columnService: columnServiceGym,
    taskService: taskServiceGym,
  };

  const getCardConfigForBoard = (board) => {
    if (!board) {
      return { additionalFields: [], cardType: 'default' };
    }

    if (board.name === 'Treinos da Semana') {
      return {
        cardType: 'musculacao',
        additionalFields: [
          { name: 'sets_reps', label: 'Séries x Repetições', type: 'text', placeholder: 'Ex: 4x10' },
          { name: 'muscle_group', label: 'Grupo Muscular', type: 'text', placeholder: 'Ex: Peito' },
          { name: 'rpe_scale', label: 'Sensação (RPE 1-10)', type: 'number', min: 1, max: 10, placeholder: 'Ex: 8' },
        ],
      };
    } else if (board.name === 'Cardio Semanal') {
      return {
        cardType: 'cardio',
        additionalFields: [
          { name: 'distance_time', label: 'Distância/Tempo', type: 'text', placeholder: 'Ex: 5km ou 30min' },
          { name: 'pace_speed', label: 'Pace/Velocidade', type: 'text', placeholder: 'Ex: 5:00 min/km ou 12 km/h' },
          { name: 'run_screenshot_base64', label: 'Upload de Print (Mock)', type: 'file', accept: 'image/*' },
          { name: 'rpe_scale', label: 'Sensação (RPE 1-10)', type: 'number', min: 1, max: 10, placeholder: 'Ex: 7' },
        ],
      };
    }

    return { additionalFields: [], cardType: 'default' };
  };

  return (
    <div>
      {/* <h1>Kanban de Treinos na Academia (TaskGym)</h1> */}
      <BoardWorkspace services={gymServices} getCardConfigForBoard={getCardConfigForBoard} boardTemplates={boardTemplates} />
      {/* <p>Este será o componente principal do TaskGym.</p> */}
    </div>
  );
};

export default GymBoardWorkspace; 