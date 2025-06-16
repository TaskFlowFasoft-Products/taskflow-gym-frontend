import { useState, useEffect, useRef } from "react";
import styles from "./styles/createCardModal.module.css";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";

const CreateCardModal = ({
    onClose,
    onCreate,
    onDelete,
    card = null,
    isEditing = false,
    loading = false,
    isDeleting = false,
    additionalFields = [],
    cardType = 'default',
}) => {
    const [title, setTitle] = useState(card?.title || "");
    const [dueDate, setDueDate] = useState(card?.dueDate || "");
    const [description, setDescription] = useState(card?.description || "");
    const [titleError, setTitleError] = useState("");
    const modalRef = useRef();

    const [setsReps, setSetsReps] = useState(card?.sets_reps || "");
    const [distanceTime, setDistanceTime] = useState(card?.distance_time || "");
    const [paceSpeed, setPaceSpeed] = useState(card?.pace_speed || "");
    const [rpeScale, setRpeScale] = useState(card?.rpe_scale || "");
    const [muscleGroup, setMuscleGroup] = useState(card?.muscle_group || "");
    const [runScreenshotBase64, setRunScreenshotBase64] = useState(card?.run_screenshot_base64 || "");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target === modalRef.current) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },); 

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
            dueDate,
            description: description.trim(),
        };

        if (cardType === 'musculacao') {
          cardData.sets_reps = setsReps;
          cardData.muscle_group = muscleGroup;
          cardData.rpe_scale = rpeScale;
        } else if (cardType === 'cardio') {
          cardData.distance_time = distanceTime;
          cardData.pace_speed = paceSpeed;
          cardData.run_screenshot_base64 = runScreenshotBase64;
          cardData.rpe_scale = rpeScale;
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
                    {isEditing ? "Editar Cartão" : "Novo Cartão"} <FaEdit />
                </h2>

                <form className={styles.form} onSubmit={handleSubmit}>
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
                        placeholder="Nome do Cartão"
                        required
                    />
                    {titleError && <span className={styles.errorMessage}>{titleError}</span>}

                    <label className={styles.label}>Data de entrega</label>
                    <div style={{ position: "relative" }}>
                        <FaRegCalendarAlt
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                color: "#666",
                            }}
                        />
                        <input
                            type="date"
                            className={styles.input}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{ paddingLeft: "2.2rem" }}
                        />
                    </div>

                    <label className={styles.label}>Descrição</label>
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Escreva uma descrição..."
                    />

                    {additionalFields.map((field) => {
                        let value, onChangeHandler;
                        switch (field.name) {
                            case 'sets_reps':
                                value = setsReps;
                                onChangeHandler = (e) => setSetsReps(e.target.value);
                                break;
                            case 'distance_time':
                                value = distanceTime;
                                onChangeHandler = (e) => setDistanceTime(e.target.value);
                                break;
                            case 'pace_speed':
                                value = paceSpeed;
                                onChangeHandler = (e) => setPaceSpeed(e.target.value);
                                break;
                            case 'rpe_scale':
                                value = rpeScale;
                                onChangeHandler = (e) => setRpeScale(e.target.value);
                                break;
                            case 'muscle_group':
                                value = muscleGroup;
                                onChangeHandler = (e) => setMuscleGroup(e.target.value);
                                break;
                            case 'run_screenshot_base64':
                                value = runScreenshotBase64;
                                onChangeHandler = (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setRunScreenshotBase64(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    } else {
                                        setRunScreenshotBase64("");
                                    }
                                };
                                break;
                            default:
                                return null;
                        }

                        return (
                            <div key={field.name}>
                                <label className={styles.label}>{field.label}</label>
                                {
                                    field.type === 'textarea' ? (
                                        <textarea
                                            className={styles.textarea}
                                            value={value}
                                            onChange={onChangeHandler}
                                            placeholder={field.placeholder}
                                        />
                                    ) : field.type === 'file' ? (
                                        <input
                                            type="file"
                                            className={styles.input}
                                            onChange={onChangeHandler}
                                            accept={field.accept || '.png,.jpg,.jpeg'}
                                        />
                                    ) : (
                                        <input
                                            type={field.type || 'text'}
                                            className={styles.input}
                                            value={value}
                                            onChange={onChangeHandler}
                                            placeholder={field.placeholder}
                                            min={field.min}
                                            max={field.max}
                                        />
                                    )
                                }
                            </div>
                        );
                    })}

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
