import { useState, useEffect, useMemo } from "react";
import styles from "./styles/createBoardModal.module.css";

const CreateBoardModal = ({ onClose, onCreate, loading, boardTemplates = [], existingBoardNames = [] }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const availableTemplates = useMemo(() => {
    const filtered = boardTemplates.filter(
      (template) => !existingBoardNames.includes(template.name)
    );
    return filtered;
  }, [boardTemplates, existingBoardNames]);

  useEffect(() => {
    const currentSelectedExists = availableTemplates.some(template => String(template.id) === selectedTemplateId);
    if (availableTemplates.length > 0 && (!selectedTemplateId || !currentSelectedExists)) {
      const newSelection = String(availableTemplates[0].id);
      setSelectedTemplateId(newSelection);
    } else if (availableTemplates.length === 0 && selectedTemplateId !== "") {
      setSelectedTemplateId(""); 
    }
  }, [availableTemplates, selectedTemplateId]);

  const validateName = (value) => {
    if (availableTemplates.length === 0 && boardTemplates.length > 0) {
      setNameError("Todos os modelos de quadro já foram criados.");
      return false;
    } else if (boardTemplates.length === 0 && (!value || value.trim() === '')) {
      setNameError("O nome do quadro é obrigatório");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateName(name)) {
      return;
    }
  
    if (availableTemplates.length > 0) {
      onCreate({ templateId: selectedTemplateId });
    } else {
      onCreate({ 
        name: name.trim(),
        columns: [] 
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Novo Quadro</h2>
        <form onSubmit={handleSubmit}>
          {boardTemplates.length > 0 ? (
            <div className={styles.formGroup}>
              <label className={styles.label}>Escolha um Modelo*</label>
              {availableTemplates.length > 0 ? (
                <select
                  className={styles.input}
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                  }}
                >
                  {availableTemplates.map((template) => (
                    <option key={template.id} value={String(template.id)}>
                      {template.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={styles.errorMessage}>Todos os modelos de quadro já foram criados.</p>
              )}
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Quadro*</label>
              <input
                type="text"
                className={`${styles.input} ${nameError ? styles.inputError : ''}`}
                placeholder="Nome do quadro"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                }}
                onBlur={(e) => validateName(e.target.value)}
                required
                autoFocus
              />
              {nameError && <span className={styles.errorMessage}>{nameError}</span>}
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.createButton} disabled={loading || (availableTemplates.length === 0 && boardTemplates.length > 0) || (boardTemplates.length === 0 && !name.trim())}>
              {loading ? "Salvando..." : "Criar Quadro"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
