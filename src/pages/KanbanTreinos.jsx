// src/pages/KanbanTreinos.jsx

import React from "react";
import BoardWorkspace from "../core/pages/boards/BoardWorkspace";
import * as boardService from "../features/kanbanAcademia/boardService";
import * as columnService from "../features/kanbanAcademia/columnService";
import * as taskService from "../features/kanbanAcademia/taskService";

const KanbanTreinos = () => {
  return (
    <BoardWorkspace
      boardService={boardService}
      columnService={columnService}
      taskService={taskService}
      allowAddColumn={false}
      allowAddBoard={false}
      allowEditColumn={false}
      allowDeleteColumn={false}
      allowEditBoard={false}
      allowDeleteBoard={false}
    />
  );
};

export default KanbanTreinos;