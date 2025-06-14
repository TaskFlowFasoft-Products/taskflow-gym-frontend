// src/pages/KanbanTreinos.jsx

import React from "react";
import BoardWorkspace from "../core/pages/boards/BoardWorkspace";
import * as boardService from "../features/kanbanAcademia/boardService";
import { FaPen, FaTrashAlt } from "react-icons/fa";

const KanbanTreinos = () => {
  return (
<BoardWorkspace
  boardService={boardService}
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