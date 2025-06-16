import { useState, useEffect, useRef } from "react";
import styles from "./styles/createCardModal.module.css";
import { FaEdit } from "react-icons/fa";

const CreateCardModal = ({
    onClose,
    onCreate,
    onDelete,
    card = null,
    isEditing = false,
    loading = false,
    isDeleting = false,
    cardType = 'default',
}) => {
    const [title, setTitle] = useState(card?.title || "");
    const [titleError, setTitleError] = useState("");

    // Campos específicos para musculação
    const [setsReps, setSetsReps] = useState(card?.sets_reps || "");
    const [muscleGroup, setMuscleGroup] = useState(card?.muscle_group || "");
    const [rpeScale, setRpeScale] = useState(card?.rpe_scale || "");

    // Campos específicos para cardio
    const [distanceTime, setDistanceTime] = useState(card?.distance_time || "");
    const [paceSpeed, setPaceSpeed] = useState(card?.pace_speed || "");
    const [runScreenshotBase64, setRunScreenshotBase64] = useState(card?.run_screenshot_base64 || "");

    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target === modalRef.current) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const validateTitle = (value) => {
        if (!value || value.trim() === '') {
            setTitleError("O título é obrigatório");
            return false;
        }
        setTitleError("");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateTitle(title)) {
            return;
        }

        const cardData = {
            id: card?.id || undefined,
            title: title.trim(),
        };

        if (cardType === 'musculacao') {
            cardData.sets_reps = setsReps.trim() || null;
            cardData.muscle_group = muscleGroup.trim() || null;
            cardData.rpe_scale = rpeScale ? Number(rpeScale) : null;
            // Campos de cardio são explicitamente null
            cardData.distance_time = null;
            cardData.pace_speed = null;
            cardData.run_screenshot_base64 = null;
        } else if (cardType === 'cardio') {
            cardData.distance_time = distanceTime.trim() || null;
            cardData.pace_speed = paceSpeed.trim() || null;
            cardData.run_screenshot_base64 = runScreenshotBase64 || null;
            cardData.rpe_scale = rpeScale ? Number(rpeScale) : null;
            // Campos de musculação são explicitamente null
            cardData.sets_reps = null;
            cardData.muscle_group = null;
        }

        onCreate(cardData);
    };

    const handleDelete = () => {
        if (onDelete && card) {
            onDelete(card);
        }
    };

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {isEditing ? "Editar Exercício" : "Novo Exercício"} <FaEdit />
                </h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.label}>Título*</label>
                        <input
                            type="text"
                            className={`${styles.input} ${titleError ? styles.inputError : ''}`}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (e.target.value.trim()) setTitleError("");
                            }}
                            onBlur={(e) => validateTitle(e.target.value)}
                            placeholder="Nome do Exercício"
                            required
                        />
                        {titleError && <span className={styles.errorMessage}>{titleError}</span>}
                    </div>

                    {cardType === 'musculacao' && (
                        <>
                            <div>
                                <label className={styles.label}>Séries x Repetições</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={setsReps}
                                    onChange={(e) => setSetsReps(e.target.value)}
                                    placeholder="Ex: 4x10"
                                />
                            </div>

                            <div>
                                <label className={styles.label}>Grupo Muscular</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={muscleGroup}
                                    onChange={(e) => setMuscleGroup(e.target.value)}
                                    placeholder="Ex: Peito"
                                />
                            </div>
                        </>
                    )}

                    {cardType === 'cardio' && (
                        <>
                            <div className={styles.cardioFieldsContainer}>
                                <div>
                                    <label className={styles.label}>Distância/Tempo</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={distanceTime}
                                        onChange={(e) => setDistanceTime(e.target.value)}
                                        placeholder="Ex: 5km ou 30min"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Pace/Velocidade</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={paceSpeed}
                                        onChange={(e) => setPaceSpeed(e.target.value)}
                                        placeholder="Ex: 5:00 min/km ou 12 km/h"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={styles.label}>Upload de Print</label>
                                <input
                                    type="file"
                                    className={styles.input}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setRunScreenshotBase64(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        } else {
                                            setRunScreenshotBase64(null);
                                        }
                                    }}
                                    accept="image/*"
                                />
                                {runScreenshotBase64 && (
                                    <div className={styles.imagePreviewContainer}>
                                        <img src={runScreenshotBase64} alt="Pré-visualização do Print" className={styles.imagePreview} />
                                        <div className={styles.imageActionButtons}>
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={() => setRunScreenshotBase64(null)}
                                            >
                                                Remover Print
                                            </button>
                                            <a
                                                href={runScreenshotBase64}
                                                download={`print_corrida_${card?.id || Date.now()}.jpeg`}
                                                className={styles.downloadImageBtn}
                                            >
                                                Baixar Print
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div>
                        <label className={styles.label}>Sensação (RPE 1-10)</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={rpeScale}
                            onChange={(e) => setRpeScale(e.target.value)}
                            placeholder="Ex: 8"
                            min="1"
                            max="10"
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        {isEditing ? (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Excluindo..." : "Excluir"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={loading || !title.trim() || isDeleting}
                        >
                            {loading ? "Salvando..." : (isEditing ? "Salvar alterações" : "Salvar")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCardModal;
