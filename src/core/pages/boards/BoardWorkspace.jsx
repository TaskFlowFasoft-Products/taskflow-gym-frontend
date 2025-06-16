import { useState, useRef, useEffect } from "react";
import styles from "./styles/boardWorkspace.module.css";
import { useNavigate } from "react-router-dom";
import CreateBoardModal from "./components/modals/CreateBoardModal";
import CreateColumnModal from "./components/modals/CreateColumnModal";
import RenameBoardModal from "./components/modals/RenameBoardModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import RenameColumnModal from "./components/modals/RenameColumnModal";
import DeleteCardConfirmModal from "./components/modals/DeleteCardConfirmModal";
import CreateCardModal from "./components/modals/CreateCardModal";
import DeleteColumnConfirmModal from "./components/modals/DeleteColumnConfirmModal";
import MenuPortal from "../../components/MenuPortal";
import {
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaEllipsisH,
  FaTrashAlt,
  FaPen,
} from "react-icons/fa";
import LogoIcon from "../../assets/Logo Icone.png";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CreateColumnsModal from "../../../gym/components/modals/CreateColumnsModal";
import { DAYS_OF_WEEK } from "../../../gym/components/modals/CreateColumnsModal";

const mapColumnsWithActualDates = (columns) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const dayNameToGetDayIndex = {
    'Domingo': 0,
    'Segunda-feira': 1,
    'Terça-feira': 2,
    'Quarta-feira': 3,
    'Quinta-feira': 4,
    'Sexta-feira': 5,
    'Sábado': 6,
  };

  return columns.map(column => {
    const columnDayOfWeek = dayNameToGetDayIndex[column.title];
    if (columnDayOfWeek === undefined) {
      return { ...column, actualDate: null };
    }

    const currentDayOfWeek = today.getDay();
    let diffDays = columnDayOfWeek - currentDayOfWeek;

    const columnDate = new Date(today);
    columnDate.setDate(today.getDate() + diffDays);
    columnDate.setHours(0, 0, 0, 0); 

    return { ...column, actualDate: columnDate.getTime() };
  });
};

const BoardWorkspace = ({ services, getCardConfigForBoard = () => ({ additionalFields: [], cardType: 'default' }), boardTemplates = [] }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false);
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [columnToRename, setColumnToRename] = useState(null);
  const [columnMenu, setColumnMenu] = useState(null);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [columnToDeleteIndex, setColumnToDeleteIndex] = useState(null);
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [columnToAddCard, setColumnToAddCard] = useState(null);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [showDeleteCardConfirmModal, setShowDeleteCardConfirmModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [showCreateColumnsModal, setShowCreateColumnsModal] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);

  const [isSavingCard, setIsSavingCard] = useState(false);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isRenamingBoard, setIsRenamingBoard] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isRenamingColumn, setIsRenamingColumn] = useState(false);

  const [isDeletingBoard, setIsDeletingBoard] = useState(false);
  const [isDeletingColumn, setIsDeletingColumn] = useState(false);
  const [isDeletingCard, setIsDeletingCard] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const userDropdownRef = useRef(null);
  const columnDropdownRef = useRef(null);
  const boardDropdownRef = useRef(null);

  const [loggedInUserName, setLoggedInUserName] = useState("Carregando...");

  const [currentModalColumnActualDate, setCurrentModalColumnActualDate] = useState(null);
  const [existingMuscleGroupCardsForValidation, setExistingMuscleGroupCardsForValidation] = useState([]);

  const updateMuscleGroupValidationData = (currentBoards) => {
    const muscleGroupTasks = [];
    currentBoards.forEach(board => {
      board.columns.forEach(column => {
        column.cards.forEach(card => {
          if (card.muscle_group) {
            muscleGroupTasks.push({
              muscleGroup: card.muscle_group,
              taskDate: card.createdAt,
              taskId: card.id
            });
          }
        });
      });
    });
    setExistingMuscleGroupCardsForValidation(muscleGroupTasks);
  };

  const fetchBoards = async () => {
    let data = [];
    try {
      data = await services.boardService.getBoards();
    } catch (error) {
      console.error("Erro ao carregar quadros:", error);
      toast.error("Erro ao carregar quadros.");
    }

    const normalizedBoards = data.map((board) => ({
      ...board,
      id: `board-${String(board.id || '').replace("undefined", '')}`,
      name: board.name || board.title || '',
      columns: (board.columns || []).map((column) => ({
        ...column,
        id: `col-${String(column.id || '').replace("undefined", '')}`,
        cards: (column.cards || []).map((card) => ({
          ...card,
          id: `card-${String(card.id || '').replace("undefined", '')}`,
          sets_reps: card.sets_reps || null,
          muscle_group: card.muscle_group || null,
          rpe_scale: card.rpe_scale || null,
          distance_time: card.distance_time || null,
          pace_speed: card.pace_speed || null,
          run_screenshot_base64: card.run_screenshot_base64 || null,
          createdAt: card.created_at ? new Date(new Date(card.created_at).setHours(0, 0, 0, 0)).getTime() : null,
        })),
      })),
    }));

    const orderedBoards = normalizedBoards.map(board => ({
      ...board,
      columns: [...board.columns].sort((a, b) => {
        const dayAIndex = DAYS_OF_WEEK.findIndex(day => day.name === a.title);
        const dayBIndex = DAYS_OF_WEEK.findIndex(day => day.name === b.title);
        return dayAIndex - dayBIndex;
      }),
    }));

    const boardsWithActualDates = orderedBoards.map(board => ({
      ...board,
      columns: mapColumnsWithActualDates(board.columns),
    }));

    setBoards(boardsWithActualDates);
    setLoading(false);
    updateMuscleGroupValidationData(boardsWithActualDates);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setLoggedInUserName(storedUsername);
    } else {
      setLoggedInUserName("Usuário");
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [services.boardService]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setActiveMenuIndex(null);
        setUserMenuOpen(false);
      }

      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target)
      ) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (!sidebarOpen) {
      setActiveMenuIndex(null);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target)) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const confirmDeleteColumn = (colIndex) => {
    setColumnToDeleteIndex(colIndex);
    setShowDeleteColumnModal(true);
  };

  const handleConfirmDeleteColumn = async () => {
    const board = boards[selectedBoardIndex];
    const column = board.columns[columnToDeleteIndex];
  
    if (!board || !column) {
        toast.error("Erro interno ao tentar excluir coluna. Por favor, tente novamente.");
        setShowDeleteColumnModal(false);
        setColumnMenu(null);
        return;
    }

    const boardId = Number(String(board.id).replace('board-', '').replace('undefined', ''));
    const columnId = Number(String(column.id).replace('col-', '').replace('undefined', ''));

    if (isNaN(boardId) || isNaN(columnId)) {
        toast.error("Erro: ID do quadro ou coluna inválido para exclusão.");
        setShowDeleteColumnModal(false);
        setColumnMenu(null);
        return;
    }
  
    setIsDeletingColumn(true);
  
    try {
        const result = await services.columnService.deleteColumn(boardId, columnId);
    
        if (result.success) {
          setBoards((prevBoards) => {
            const updatedBoards = structuredClone(prevBoards);
            updatedBoards[selectedBoardIndex].columns = updatedBoards[selectedBoardIndex].columns.filter(
              (_, index) => index !== columnToDeleteIndex
            );
            return updatedBoards;
          });
          toast.success("Coluna excluída com sucesso!");
        } else {
          toast.error(result.message || "Erro ao excluir coluna.");
        }
    } catch (error) {
        console.error("Erro ao excluir coluna:", error);
        toast.error("Erro ao excluir coluna.");
    } finally {
        setShowDeleteColumnModal(false);
        setColumnMenu(null);
        setIsDeletingColumn(false);
    }
  };


  const openRenameColumnModal = (colIndex) => {
    const currentBoardIndex = selectedBoardIndex;
    if (currentBoardIndex === null) return;

    setColumnToRename(colIndex);
    setShowRenameColumnModal(true);
    setColumnMenu(null); 
  };

  const handleConfirmRenameColumn = async (newName) => {
    const currentBoardIndex = selectedBoardIndex; 
    const colIndex = columnToRename;

    if (currentBoardIndex === null || colIndex === null || !boards[currentBoardIndex] || !boards[currentBoardIndex].columns[colIndex]) {
        toast.error("Erro interno ao tentar renomear coluna. Por favor, tente novamente.");
        setShowRenameColumnModal(false);
        return;
    }

    const board = boards[currentBoardIndex];
    const column = board.columns[colIndex];

    setIsRenamingColumn(true);
  
    const result = await services.columnService.updateColumn(board.id, column.id, newName);
  
    if (result.success) {
      setBoards((prev) => {
        const updated = structuredClone(prev);
        updated[currentBoardIndex].columns[colIndex].title = newName;
        return updated;
      });
      toast.success("Coluna renomeada com sucesso!");
    } else {
      toast.error(result.message || "Erro ao renomear coluna.");
    }
  
    setShowRenameColumnModal(false);
    setIsRenamingColumn(false);
  };
  

  const handleCreateBoard = async (newBoard) => {
    const { name, templateId } = newBoard;

    setIsCreatingBoard(true);

    try {
      let result;
      if (templateId) {
        result = await services.boardService.createBoard(templateId);
      } else {
        result = await services.boardService.createBoard(name);
      }

      if (result.success) {
        toast.success("Quadro criado com sucesso!");
        await fetchBoards();
      } else {
        toast.error(result.message || "Erro ao criar quadro.");
      }
    } catch (error) {
        console.error("Erro ao criar quadro:", error);
        const errorMessage = error.response?.data?.detail || "Erro ao criar quadro.";
        toast.error(errorMessage);
    } finally {
        setIsCreatingBoard(false);
        setShowModal(false);
    }
  };
  

  const handleMenuToggle = (index, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.top, left: rect.right + 8 });
    setActiveMenuIndex((prev) => (prev === index ? null : index));
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
    setActiveMenuIndex(null);
  };

  const handleRename = (index) => {
    setRenameIndex(index);
    setShowRenameModal(true);
    setActiveMenuIndex(null);
  };

  const confirmDeleteBoard = async () => {
    const boardIdWithPrefix = boards[deleteIndex]?.id;

    if (!boardIdWithPrefix) {
        toast.error("Erro: ID do quadro não encontrado para exclusão.");
        setShowDeleteModal(false);
        return;
    }

    const boardId = Number(String(boardIdWithPrefix).replace('board-', '').replace('undefined', ''));

    if (isNaN(boardId)) {
        toast.error("Erro: ID do quadro inválido para exclusão.");
        setShowDeleteModal(false);
        return;
    }

    setIsDeletingBoard(true);

    try {
        const result = await services.boardService.deleteBoard(boardId);
    
        if (result.success) {
          setBoards((prev) => prev.filter((_, i) => i !== deleteIndex));
          if (selectedBoardIndex === deleteIndex) {
            setSelectedBoardIndex(null);
          }
          toast.success("Quadro excluído com sucesso!");
        } else {
          toast.error(result.message || "Erro ao excluir quadro.");
        }
    } catch (error) {
        console.error("Erro ao excluir quadro:", error);
        toast.error("Erro ao excluir quadro.");
    } finally {
        setShowDeleteModal(false);
        setIsDeletingBoard(false);
    }
  };
  

  const handleConfirmRename = async (newName) => {
    const board = boards[renameIndex];

    setIsRenamingBoard(true);

    const result = await services.boardService.updateBoard(board.id, newName);
  
    if (result.success) {
      setBoards((prev) => {
        const updated = [...prev];
        updated[renameIndex].name = newName;
        return updated;
      });
      toast.success("Quadro renomeado com sucesso!");
    } else {
      toast.error(result.message || "Erro ao renomear quadro.");
    }
  
    setRenameIndex(null);
    setShowRenameModal(false);
    setIsRenamingBoard(false);
  };
  

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    setUserMenuOpen(false);
    navigate("/login");
  };

  const handleCreateColumn = async (columnName) => {
    if (selectedBoardIndex === null) return; 

    const board = boards[selectedBoardIndex];

    setIsCreatingColumn(true);

    try {
      const result = await services.columnService.createColumn(board.id, columnName);

      if (result.success && result.column) {
        const normalizedColumn = {
          ...result.column,
          id: `col-${String(result.column.id || '').replace("undefined", '')}`,
          cards: [],
        };

        setBoards((prevBoards) => {
          const updated = structuredClone(prevBoards);
          updated[selectedBoardIndex].columns.push(normalizedColumn);
          return updated;
        });

        toast.success("Coluna criada com sucesso!");
      } else {
        const errorMessage = result.message || "Erro desconhecido ao criar coluna.";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Erro ao criar coluna.";
      toast.error(errorMessage);
    } finally {
      setIsCreatingColumn(false);
      setShowCreateColumnModal(false); 
    }
  }; 

  const handleCreateCardClick = (colIndex) => {
    setColumnToAddCard(colIndex);

    const currentBoard = boards[selectedBoardIndex];
    if (!currentBoard) {
      return;
    }

    const currentColumn = currentBoard.columns[colIndex];
    if (!currentColumn) {
      return;
    }
    setCurrentModalColumnActualDate(currentColumn.actualDate); 

    const muscleGroupTasks = [];
    currentBoard.columns.forEach(column => {
        column.cards.forEach(card => {
            if (card.muscle_group) {
                muscleGroupTasks.push({
                    muscleGroup: card.muscle_group,
                    taskDate: card.createdAt, 
                    taskId: card.id 
                });
            }
        });
    });
    setExistingMuscleGroupCardsForValidation(muscleGroupTasks);

    setShowCreateCardModal(true);
  };

  const handleCreateCard = async (cardData) => {
    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];
  
    setIsSavingCard(true);

    try {
      if (!cardData.title || cardData.title.trim() === '') {
        toast.error('O título do exercício é obrigatório');
        setIsSavingCard(false);
        return;
      }

      if (cardData.id) {
        let columnIndex = cardData.columnIndex;
        if (columnIndex === undefined || columnIndex === null) {
          columnIndex = board.columns.findIndex((col) =>
            col.cards.some((card) => card.id === cardData.id)
          );
        }
        
        if (columnIndex === -1) {
          toast.error("Coluna do exercício não encontrada.");
          return;
        }
        
        const payload = {
          task_id: Number(cardData.id.toString().replace('card-', '').replace('undefined', '')),
          board_id: Number(board.id.toString().replace('board-', '').replace('undefined', '')),
          column_id: Number(board.columns[columnIndex].id.replace('col-', '').replace('undefined', '')),
        };

        if (cardData.title !== cardToEdit.title) {
          payload.title = cardData.title;
        }

        const setStringFieldIfChanged = (fieldName) => {
          const originalValue = cardToEdit[fieldName] === null ? "" : String(cardToEdit[fieldName]);
          const newValue = cardData[fieldName] === null ? "" : String(cardData[fieldName]); 

          if (newValue !== originalValue) {
            payload[fieldName] = newValue.trim() === '' ? null : newValue.trim();
          }
        };

        setStringFieldIfChanged('sets_reps');
        setStringFieldIfChanged('muscle_group');
        setStringFieldIfChanged('distance_time');
        setStringFieldIfChanged('pace_speed');

        let newRpeValue = null;
        if (cardData.rpe_scale !== null && cardData.rpe_scale !== undefined && String(cardData.rpe_scale).trim() !== '') {
            newRpeValue = Number(cardData.rpe_scale);
        }

        const originalRpeValue = cardToEdit.rpe_scale === null || cardToEdit.rpe_scale === undefined || String(cardToEdit.rpe_scale).trim() === '' ? null : Number(cardToEdit.rpe_scale);
        if (newRpeValue !== originalRpeValue) {
            payload.rpe_scale = newRpeValue;
        }

        const originalScreenshot = cardToEdit.run_screenshot_base64 || null;
        const newScreenshot = cardData.run_screenshot_base64 || null;

        if (newScreenshot !== originalScreenshot) {
          payload.run_screenshot_base64 = newScreenshot;
        }


        if (Object.keys(payload).length <= 3 && payload.title === cardToEdit.title) {
            toast.info("Nenhuma alteração detectada para salvar.");
            setIsSavingCard(false);
            setShowCreateCardModal(false);
            setCardToEdit(null);
            return;
        }

        const result = await services.taskService.updateTask(payload);
  
        if (result.success) {
          const cards = board.columns[columnIndex].cards;
          const cardIndex = cards.findIndex((c) => c.id === cardData.id);
  
          if (cardIndex !== -1) {
            cards[cardIndex] = {
              ...cards[cardIndex], 
              ...cardData, 
              id: cardData.id 
            };
            toast.success("Exercício atualizado com sucesso!");
          } else {
            toast.warn("Exercício não encontrado para atualização.");
          }

        } else {
          toast.error(result.message || "Erro ao atualizar exercício.");
        }
  
      } else {
        const columnIndex = columnToAddCard;
        const boardId = Number(String(board.id).replace('board-', '').replace('undefined', ''));
        const columnId = Number(board.columns[columnIndex].id.replace('col-', '').replace('undefined', ''));
        
        if (isNaN(boardId) || isNaN(columnId)) {
          toast.error('Erro: IDs inválidos');
          setIsSavingCard(false);
          return;
        }

        const payload = {
          board_id: boardId,
          column_id: columnId,
          title: cardData.title,
          sets_reps: cardData.sets_reps,
          muscle_group: cardData.muscle_group,
          rpe_scale: cardData.rpe_scale,
          distance_time: cardData.distance_time,
          pace_speed: cardData.pace_speed,
          run_screenshot_base64: cardData.run_screenshot_base64,
        };
  
        const result = await services.taskService.createTask(payload);
  
        if (result.success) {
          const newCard = {
            id: `card-${String(result.id || '').replace("undefined", '')}`,
            title: result.title,
            sets_reps: cardData.sets_reps || null,
            muscle_group: cardData.muscle_group || null,
            rpe_scale: cardData.rpe_scale || null,
            distance_time: cardData.distance_time || null,
            pace_speed: cardData.pace_speed || null,
            run_screenshot_base64: cardData.run_screenshot_base64 || null,
            createdAt: result.created_at ? new Date(new Date(result.created_at).setHours(0, 0, 0, 0)).getTime() : null, 
          };
  
          board.columns[columnIndex].cards.push(newCard);
          toast.success("Exercício criado com sucesso!");
        } else {
          toast.error(result.message || "Erro ao criar exercício.");
        }
      }
  
      setBoards(updatedBoards);
      updateMuscleGroupValidationData(updatedBoards); 
      setCardToEdit(null);
      setShowCreateCardModal(false);
    } catch (error) {
      console.error("Erro ao salvar o exercício:", error);
      const errorMessage = error.response?.data?.detail || "Erro ao salvar o exercício.";
      toast.error(errorMessage);
    } finally {
      setIsSavingCard(false);
      setShowCreateCardModal(false);
    }
  };
  


  const handleDeleteCard = (card) => {
    setCardToDelete(card);
    setShowDeleteCardConfirmModal(true);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete || cardToDelete.columnIndex === undefined || cardToDelete.id === undefined) {
        toast.error("Erro interno ao tentar excluir cartão. Por favor, tente novamente.");
        setCardToDelete(null);
        setShowDeleteCardConfirmModal(false);
        setShowCreateCardModal(false);
        setCardToEdit(null);
        return;
    }

    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];
    const columnIndex = cardToDelete.columnIndex;

     if (!board || !board.columns || !board.columns[columnIndex]) {
        toast.error("Erro interno ao tentar excluir cartão. Por favor, tente novamente.");
        setCardToDelete(null);
        setShowDeleteCardConfirmModal(false);
        setShowCreateCardModal(false);
        setCardToEdit(null); 
        return;
    }
  
    setIsDeletingCard(true);

    try {
      const payload = {
        board_id: Number(board.id.toString().replace('board-', '').replace('undefined', '')),
        task_id: Number(cardToDelete.id.toString().replace('card-', '').replace('undefined', '')),
      };
  
      await services.taskService.deleteTask(payload);
  
      board.columns[columnIndex].cards = board.columns[columnIndex].cards.filter(
        (c) => c.id !== cardToDelete.id
      );
  
      setBoards(updatedBoards);
      updateMuscleGroupValidationData(updatedBoards); 
      toast.success("Cartão excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o cartão:", error);
      toast.error("Erro ao excluir o cartão.");
    } finally {
      setCardToDelete(null);
      setShowDeleteCardConfirmModal(false);
      setShowCreateCardModal(false); 
      setCardToEdit(null); 
      setIsDeletingCard(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];

    const sourceColId = Number(source.droppableId.replace('col-', '').replace('undefined', ''));
    const destColId = Number(destination.droppableId.replace('col-', '').replace('undefined', ''));

    const sourceColIndex = board.columns.findIndex(
      (col) => Number(col.id.replace('col-', '').replace('undefined', '')) === sourceColId
    );
    const destColIndex = board.columns.findIndex(
      (col) => Number(col.id.replace('col-', '').replace('undefined', '')) === destColId
    );

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = board.columns[sourceColIndex];
    const destCol = board.columns[destColIndex];

    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    if (!movedCard) return;

    movedCard.column_id = Number(destColId); 

    destCol.cards.splice(destination.index, 0, movedCard);

    setBoards(updatedBoards);

    if (sourceColId !== destColId) {
      try {
        const cardId = Number(movedCard.id.replace('card-', '').replace('undefined', ''));
        const boardId = Number(board.id.replace('board-', '').replace('undefined', ''));

        await services.taskService.updateTask({
          task_id: cardId,
          board_id: boardId,
          column_id: destColId,
          title: movedCard.title,
        });
        updateMuscleGroupValidationData(updatedBoards); 
      } catch (error) {
        console.error("Erro ao mover o exercício:", error);
        const errorMessage = error.response?.data?.detail || 'Erro ao mover o exercício.';
        toast.error(`Não foi possível mover o exercício: ${errorMessage}`);
        const revertedBoards = structuredClone(boards);
        setBoards(revertedBoards);
      }
    }
  };

  const handleSelectBoard = async (index) => {
    setSelectedBoardIndex(index);
  
    const board = boards[index];
    if (!board || !board.id) {
      toast.error("Erro: Quadro selecionado inválido.");
      return;
    }

    const boardIdString = String(board.id);
    const cleanedBoardIdString = boardIdString.replace('board-', '').replace('undefined', '');
    const boardId = Number(cleanedBoardIdString);
    
    if (isNaN(boardId)) {
      toast.error("Erro: ID do quadro selecionado inválido.");
      return;
    }

    try {
      const columns = await services.columnService.getBoardColumns(boardId);
  
      let normalizedColumns = columns.map((col) => ({
        ...col,
        id: `col-${String(col.id || '').replace("undefined", '')}`,
        cards: (col.cards || []).map((card) => ({
          ...card,
          id: `card-${String(card.id || '').replace("undefined", '')}`,
          title: card.title,
          sets_reps: card.sets_reps || null,
          muscle_group: card.muscle_group || null,
          rpe_scale: card.rpe_scale || null,
          distance_time: card.distance_time || null,
          pace_speed: card.pace_speed || null,
          run_screenshot_base64: card.run_screenshot_base64 || null,
          createdAt: card.created_at ? new Date(new Date(card.created_at).setHours(0, 0, 0, 0)).getTime() : null
        })) || [],
      }));
  
      normalizedColumns = [...normalizedColumns].sort((a, b) => {
        const dayAIndex = DAYS_OF_WEEK.findIndex(day => day.name === a.title);
        const dayBIndex = DAYS_OF_WEEK.findIndex(day => day.name === b.title);
        return dayAIndex - dayBIndex;
      });

      const columnsWithActualDates = mapColumnsWithActualDates(normalizedColumns);

      setBoards((prevBoards) => {
        const updated = [...prevBoards];
        updated[index].columns = columnsWithActualDates;
        return updated;
      });
    } catch (error) {
        console.error("Erro ao carregar colunas do quadro:", error);
        toast.error("Erro ao carregar colunas do quadro.");
    }
  };  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        boardDropdownRef.current &&
        !boardDropdownRef.current.contains(event.target) &&
        activeMenuIndex !== null
      ) {
        const isToggleClick = event.target.closest(`.${styles.boardMenu}`) !== null;

        if (!boardDropdownRef.current.contains(event.target) && !isToggleClick) {
           setActiveMenuIndex(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownRef, userRef, boardDropdownRef, activeMenuIndex]);

  useEffect(() => {
    const handleClickOutsideColumnMenu = (e) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target)) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideColumnMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideColumnMenu);
  }, [columnDropdownRef]);

  const calculateAvailableDays = (columns) => {
    const usedDays = columns.map(col => col.title);
    return DAYS_OF_WEEK.filter(day => !usedDays.includes(day.name)).map(day => day.name);
  };

  useEffect(() => {
    if (selectedBoardIndex !== null) {
      const currentBoard = boards[selectedBoardIndex];
      if (currentBoard) {
        setAvailableDays(calculateAvailableDays(currentBoard.columns));
      }
    }
  }, [selectedBoardIndex, boards]);

  const handleCreateColumnsByDays = async (days) => {
    const board = boards[selectedBoardIndex];
    if (!board) {
      toast.error("Nenhum quadro selecionado para adicionar colunas.");
      return;
    }

    const boardId = Number(String(board.id).replace('board-', '').replace('undefined', ''));

    if (isNaN(boardId)) {
        toast.error("Erro: ID do quadro inválido para criação de colunas.");
        return;
    }

    setIsCreatingColumn(true); 
    let allSucceeded = true;
    let newColumnsData = [];

    try {
      for (const day of days) {
        const result = await services.columnService.createColumn(boardId, day);
        if (!result.success || !result.column) {
          allSucceeded = false;
          toast.error(`Erro ao criar coluna para ${day}: ${result.message || 'Erro desconhecido.'}`);
        } else {
          newColumnsData.push({
            ...result.column,
            id: `col-${String(result.column.id || '').replace("undefined", '')}`,
            cards: [],
          });
        }
      }

      if (allSucceeded) {
        setBoards(prevBoards => {
          const updatedBoards = structuredClone(prevBoards);
          const currentBoard = updatedBoards[selectedBoardIndex];
          
          currentBoard.columns = [...currentBoard.columns, ...newColumnsData].sort((a, b) => {
            const dayAIndex = DAYS_OF_WEEK.findIndex(day => day.name === a.title);
            const dayBIndex = DAYS_OF_WEEK.findIndex(day => day.name === b.title);
            return dayAIndex - dayBIndex;
          });

          return updatedBoards;
        });

        toast.success("Colunas criadas com sucesso!");
      } else {
        toast.warn("Algumas colunas não puderam ser criadas.");
      }
    } catch (error) {
      console.error("Erro ao criar colunas por dia:", error);
      toast.error("Erro ao criar colunas por dia.");
    } finally {
      setIsCreatingColumn(false);
      setShowCreateColumnsModal(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div
            className={`${styles.logo} ${!sidebarOpen ? styles.logoHidden : ""
              }`}
          >
            <img
              src={LogoIcon}
              alt="TaskFlow Logo"
              className={styles.logoImage}
            />
          </div>
          <h1 className={styles.appName}>TaskGym</h1>
        </div>

        <div className={styles.headerCenter}>
          {selectedBoardIndex !== null
            ? boards[selectedBoardIndex]?.name
            : "Nenhum quadro selecionado"}
        </div>

        <div className={styles.headerRight}>
          <div
            ref={userRef}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            <FaUserCircle size={29} color="#3a86ff" />
          </div>

          {userMenuOpen && (
            <MenuPortal>
              <div className={styles.userMenu} ref={userDropdownRef}>
                <div className={styles.userInfo}>
                  <span className={styles.userDisplayName}>{loggedInUserName}</span>
                </div>
                <div className={styles.menuDivider}></div>
                <button className={styles.userMenuItem} onClick={handleLogout}>
                  Fazer Logout
                </button>
              </div>
            </MenuPortal>
          )}
        </div>
      </header>

      <div className={styles.workspaceContainer}>
        <div
          className={`${styles.toggleContainer} ${sidebarOpen ? styles.open : styles.closed
            }`}
        >
          <button
            className={styles.toggleSidebarBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaChevronLeft size={16} />
            ) : (
              <FaChevronRight size={16} />
            )}
          </button>
        </div>

        <aside
          className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ""
            }`}
        >
          <h3 className={styles.sidebarTitle}>Task Workspace</h3>
          <div className={styles.sidebarSection}>
            <p className={styles.sectionLabel}>Meus Quadros</p>
            <ul className={styles.boardList}>
              {boards.map((board, index) => (
                <li
                  key={index}
                  className={`${styles.boardItem} ${selectedBoardIndex === index ? styles.activeBoard : ""
                    }`}
                >
<div
  className={styles.boardContent}
  onClick={() => handleSelectBoard(index)}
>
                    <span className={styles.pinIcon}>📌</span>
                    {board.name}
                  </div>
                  <div className={styles.boardMenu}>
                    <FaEllipsisH onClick={(e) => handleMenuToggle(index, e)} />
                  </div>
                  {activeMenuIndex === index && (
                    <MenuPortal>
                      <div
                        ref={boardDropdownRef}
                        className={styles.dropdownMenu}
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left,
                          position: "fixed",
                          zIndex: 9999,
                        }}
                      >
                        <button onClick={() => handleRename(index)}>
                          <FaPen size={12} /> Renomear
                        </button>
                        <button onClick={() => handleDelete(index)}>
                          <FaTrashAlt size={12} /> Excluir
                        </button>
                      </div>
                    </MenuPortal>
                  )}
                </li>
              ))}
            </ul>
            <button
              className={styles.addBoardBtn}
              onClick={() => setShowModal(true)}
            >
              <FaPlus size={12} style={{ marginRight: "6px" }} />
              Novo Quadro
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          {loading ? (
            <p>Carregando quadros...</p>
          ) : selectedBoardIndex === null ? (
            <h2>Selecione ou crie um quadro</h2>
          ) : (
            <div className={styles.boardView}>
              <h2 className={styles.boardTitle}>
                {boards[selectedBoardIndex]?.name}
              </h2>

              <DragDropContext onDragEnd={handleDragEnd}>
                <div className={styles.columnsArea}>
                  {boards[selectedBoardIndex]?.columns?.length > 0 ? (
                    <>
                      {boards[selectedBoardIndex].columns.map((column, colIndex) => {
                        return (
                          <Droppable droppableId={column.id} key={column.id}>
                            {(provided) => (
                              <div
                                className={styles.column}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                <div className={styles.columnHeader}>
                                  <h3 className={styles.columnTitle}>{column.title}</h3>
                                  <FaEllipsisH
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setColumnMenu({
                                        columnId: column.id,
                                        index: colIndex,
                                        top: rect.bottom,
                                        left: rect.left,
                                      });
                                    }}
                                    className={styles.columnMenuIcon}
                                  />
                                </div>

                                {columnMenu?.columnId === column.id && (
                                  <MenuPortal>
                                    <div
                                      ref={columnDropdownRef}
                                      className={styles.dropdownMenu}
                                      style={{
                                        top: columnMenu.top,
                                        left: columnMenu.left,
                                        position: "fixed",
                                        zIndex: 9999,
                                      }}
                                    >
                                      <button onClick={() => openRenameColumnModal(columnMenu.index)}>
                                        <FaPen size={12} style={{ marginRight: "6px" }} />
                                        Renomear
                                      </button>
                                      <button onClick={() => confirmDeleteColumn(columnMenu.index)}>
                                        <FaTrashAlt size={12} style={{ marginRight: "6px" }} />
                                        Excluir
                                      </button>
                                    </div>
                                  </MenuPortal>
                                )}

                                <div className={styles.columnContent}>
                                  {column.cards?.length > 0 ? (
                                    column.cards.map((card, cardIndex) => {
                                      if (!card) return null; 
                                      return (
                                        <Draggable draggableId={card.id} index={cardIndex} key={card.id}>
                                          {(provided) => (
                                            <div
                                              className={styles.card}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              onClick={() => {
                                                setCardToEdit({ ...card, columnIndex: colIndex });
                                                setShowCreateCardModal(true);
                                              }}
                                            >
                                              {card.title}
                                            </div>
                                          )}
                                        </Draggable>
                                      );
                                    })
                                  ) : (
                                    <span className={styles.placeholder}>Sem cartões</span>
                                  )}
                                  {provided.placeholder}
                                </div>

                                <button
                                  className={styles.addCardBtn}
                                  onClick={() => handleCreateCardClick(colIndex)}
                                >
                                  + Adicionar Cartão
                                </button>
                              </div>
                            )}
                          </Droppable>
                        );
                      })}

                      {availableDays.length > 0 && (
                        <button
                          className={styles.addColumnStyledBtn}
                          onClick={() => {
                            if (selectedBoardIndex !== null) {
                              setShowCreateColumnsModal(true);
                            } else {
                              alert("Selecione ou crie um quadro primeiro.");
                            }
                          }}
                        >
                          <FaPlus size={10} style={{ marginRight: "6px" }} />
                          Adicionar nova lista
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={styles.emptyBoard}>
                      <p className={styles.emptyText}>
                        Este quadro está vazio. <em>Comece criando as colunas por dias da semana.</em>
                      </p>
                      {availableDays.length > 0 && (
                        <button
                          className={styles.addColumnStyledBtn}
                          onClick={() => {
                            if (selectedBoardIndex !== null) {
                              setShowCreateColumnsModal(true);
                            } else {
                              alert("Selecione ou crie um quadro primeiro.");
                            }
                          }}
                        >
                          <FaPlus size={10} style={{ marginRight: "6px" }} />
                          Criar Colunas por Dia
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </DragDropContext>

            </div>
          )}

          {/* Modal de criação de coluna */}
          {showCreateColumnModal && (
            <CreateColumnModal
              onClose={() => setShowCreateColumnModal(false)}
              onCreate={handleCreateColumn}
              loading={isCreatingColumn}
            />
          )}

          {/* Novo Modal de criação de colunas por dia */}
          {showCreateColumnsModal && selectedBoardIndex !== null && (
            <CreateColumnsModal
              onClose={() => setShowCreateColumnsModal(false)}
              onCreate={handleCreateColumnsByDays}
              loading={isCreatingColumn}
              existingColumnNames={boards[selectedBoardIndex]?.columns.map(col => col.title) || []}
            />
          )}

        </main>

      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateBoard}
          loading={isCreatingBoard}
          boardTemplates={boardTemplates}
          existingBoardNames={boards.map(board => board.name)}
        />
      )}

      {showRenameModal && renameIndex !== null && (
        <RenameBoardModal
          boardName={boards[renameIndex].name}
          onClose={() => {
            setRenameIndex(null);
            setShowRenameModal(false);
          }}
          onConfirm={handleConfirmRename}
          loading={isRenamingBoard}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          boardName={boards[deleteIndex]?.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteBoard}
          loading={isDeletingBoard}
        />
      )}

      {showRenameColumnModal && selectedBoardIndex !== null && (
        <RenameColumnModal
          columnName={boards[selectedBoardIndex]?.columns[columnToRename]?.title || ''}
          onClose={() => setShowRenameColumnModal(false)}
          onConfirm={handleConfirmRenameColumn}
          loading={isRenamingColumn}
        />
      )}

      {showDeleteColumnModal && (
        <DeleteColumnConfirmModal
          columnName={boards[selectedBoardIndex].columns[columnToDeleteIndex].name}
          onCancel={() => setShowDeleteColumnModal(false)}
          onConfirm={handleConfirmDeleteColumn}
          loading={isDeletingColumn}
        />
      )}

      {showCreateCardModal && (
        <CreateCardModal
          onClose={() => {
            setShowCreateCardModal(false);
            setCardToEdit(null);
          }}
          onCreate={handleCreateCard}
          onDelete={handleDeleteCard}
          card={cardToEdit}
          isEditing={!!cardToEdit}
          loading={isSavingCard}
          isDeleting={isDeletingCard}
          cardType={(() => {
            const currentBoard = boards[selectedBoardIndex];
            if (!currentBoard) return 'default';

            const isGymBoard = currentBoard.columns.some(col => DAYS_OF_WEEK.some(day => day.name === col.title));

            if (cardToEdit) {
                if (cardToEdit.sets_reps !== null || cardToEdit.muscle_group !== null) {
                    return 'musculacao';
                }
                if (cardToEdit.distance_time !== null || cardToEdit.pace_speed !== null || cardToEdit.run_screenshot_base64 !== null) {
                    return 'cardio';
                }
                if (isGymBoard) {
                    return 'musculacao'; 
                }
            }
            return getCardConfigForBoard(currentBoard).cardType;
          })()}
          currentColumnActualDate={currentModalColumnActualDate}
          existingMuscleGroupCards={existingMuscleGroupCardsForValidation}
        />
      )}

      {showDeleteCardConfirmModal && (
        <DeleteCardConfirmModal
          cardTitle={cardToDelete?.title}
          onCancel={() => {
            setShowDeleteCardConfirmModal(false);
            setCardToDelete(null);
          }}
          onConfirm={confirmDeleteCard}
          loading={isDeletingCard}
        />
      )}

    </div>
  );
};

export default BoardWorkspace;