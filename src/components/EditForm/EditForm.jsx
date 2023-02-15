import { useState, useEffect } from "react";
import styles from "./EditForm.module.css";

const EditForm = ({ editedTodo, editTodo, closeEditMode }) => {
  const [updatedTodo, setUpdatedTodo] = useState(editedTodo.todo);

  useEffect(() => {
    const closeEditOnEscape = (e) => {
      e.key === "Escape" && closeEditMode();
    };

    window.addEventListener("keydown", closeEditOnEscape);

    return () => {
      window.removeEventListener("keydown", closeEditOnEscape);
    };
  }, [closeEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    editTodo({ ...editedTodo, todo: updatedTodo });
  };

  const handleUserInput = (e) => {
    setUpdatedTodo(e.target.value);
  };

  return (
    <div
      role="dialog"
      onClick={(e) => e.target === e.currentTarget && closeEditMode()}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="wrapper">
          <input
            type="text"
            id="editTodo"
            className={styles.input}
            value={updatedTodo}
            onInput={handleUserInput}
            autoFocus
            required
            placeholder="Edit Todo"
          />
        </div>
        <button
          className={styles.edit}
          type="submit"
          aria-label={`Confrim edit todo to ${updatedTodo}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default EditForm;
