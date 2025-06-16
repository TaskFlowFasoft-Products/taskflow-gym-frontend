import { useState, useEffect } from "react";
import styles from "./styles/createBoardModal.module.css";

const CreateBoardModal = ({ onClose, onCreate, loading, boardTemplates = [] }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  useEffect(() => {
    if (boardTemplates.length > 0) {
      setSelectedTemplateId(boardTemplates[0].id);
    }
  }, [boardTemplates]);

  const validateName = (value) => {
    if (boardTemplates.length === 0 && (!value || value.trim() === '')) {
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
  
    if (boardTemplates.length > 0) {
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
              <select
                className={styles.input}
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                {boardTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
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
            <button type="submit" className={styles.createButton} disabled={loading || (boardTemplates.length === 0 && !name.trim())}>
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
