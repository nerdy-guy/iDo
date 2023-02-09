import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import "./App.css";
import Todo from "./components/Todo/Todo";
import TodoForm from "./components/TodoForm/TodoForm";
import { db } from "./Firebase/firebase";

function App() {
  const [todoList, setTodoList] = useState([]);

  const todoListRef = collection(db, "todoList");

  const addTodo = async (todo) => {
    await addDoc(todoListRef, {
      todo,
      completed: false,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    const queryTodoList = query(todoListRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(queryTodoList, (querySnapshot) => {
      let todoList = [];
      querySnapshot.forEach((doc) => {
        todoList.push({ ...doc.data(), id: doc.id });
      });
      setTodoList(todoList);
    });

    return () => unsubscribe();
  }, []);

  const toggleCompleted = async (todo) => {
    await updateDoc(doc(db, "todoList", todo.id), {
      completed: !todo.completed,
    });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todoList", id));
  };

  return (
    <div>
      <header>
        <h1>iDo</h1>
      </header>

      <TodoForm addTodo={addTodo} />

      <ul>
        {todoList.map((todo) => (
          <Todo
            todo={todo}
            key={todo.id}
            toggleCompleted={toggleCompleted}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>

      {todoList.length > 0 && (
        <p>
          You have{" "}
          {todoList.length === 1
            ? `${todoList.length} todo`
            : `${todoList.length} todos`}
        </p>
      )}
    </div>
  );
}

export default App;
