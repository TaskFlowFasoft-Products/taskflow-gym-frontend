// src/pages/KanbanTreinos.jsx

import React from "react";
import BoardWorkspace from "../core/pages/boards/BoardWorkspace";
import * as boardService from "../features/kanbanAcademia/boardService";

const KanbanTreinos = () => {
  return (
    <BoardWorkspace boardService={boardService} allowAddColumn={false} />
  );
};

export default KanbanTreinos;