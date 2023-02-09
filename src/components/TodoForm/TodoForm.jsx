import React, { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [todo, setTodo] = useState("");

  const handleUserInput = (e) => {
    setTodo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addTodo(todo);

    setTodo("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onInput={handleUserInput} value={todo} required />

        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            // Todo: Add css width

            width={20}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
