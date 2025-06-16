import React, { useState, useEffect } from 'react';
import styles from './styles/createColumnsModal.module.css';
import { toast } from 'react-toastify';

export const DAYS_OF_WEEK = [
  { id: 'segunda', name: 'Segunda-feira' },
  { id: 'terca', name: 'Terça-feira' },
  { id: 'quarta', name: 'Quarta-feira' },
  { id: 'quinta', name: 'Quinta-feira' },
  { id: 'sexta', name: 'Sexta-feira' },
  { id: 'sabado', name: 'Sábado' },
  { id: 'domingo', name: 'Domingo' },
];

const CreateColumnsModal = ({ onClose, onCreate, loading, existingColumnNames = [] }) => {
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    // Opcional: pré-selecionar alguns dias se desejar
    // setSelectedDays(['segunda', 'terca', 'quarta']);
  }, []);

  const handleDayChange = (dayId) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(dayId)) {
        return prevSelectedDays.filter((id) => id !== dayId);
      } else {
        return [...prevSelectedDays, dayId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error('Selecione ao menos um dia para criar as colunas.');
      return;
    }
    const sortedDays = DAYS_OF_WEEK
      .filter(day => selectedDays.includes(day.id))
      .map(day => day.name);

    onCreate(sortedDays);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Criar Colunas por Dia</h2>
        <form onSubmit={handleSubmit}>
          <p className={styles.description}>Selecione os dias da semana para criar as colunas do seu quadro.</p>
          <div className={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => {
              const isDayExisting = existingColumnNames.includes(day.name);
              return (
                <label
                  key={day.id}
                  className={`${styles.dayItem} ${isDayExisting ? styles.disabledDay : ''}`}
                >
                  <input
                    type="checkbox"
                    value={day.id}
                    checked={selectedDays.includes(day.id) || isDayExisting}
                    onChange={() => handleDayChange(day.id)}
                    disabled={isDayExisting}
                  />
                  {day.name}
                </label>
              );
            })}
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.createButton} disabled={loading || selectedDays.length === 0}>
              {loading ? 'Criando...' : 'Criar Colunas'}
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

export default CreateColumnsModal; 