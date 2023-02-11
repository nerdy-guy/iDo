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
import Cookies from "universal-cookie";
import "./App.css";
import EditForm from "./components/EditForm/EditForm";
import Todo from "./components/Todo/Todo";
import TodoForm from "./components/TodoForm/TodoForm";
import Auth from "./Firebase/Auth/Auth";
import { db } from "./Firebase/firebase";
import { auth } from "../src/Firebase/firebase";
import { signOut } from "firebase/auth";
import Navbar from "./components/Navbar/Navbar";

const cookies = new Cookies();

function App() {
  const [todoList, setTodoList] = useState([]);
  const [editedTodo, setEditedTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

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

  const editTodo = async (todo) => {
    await updateDoc(doc(db, "todoList", todo.id), {
      todo: todo.todo,
    });

    closeEditMode();
  };

  const closeEditMode = () => {
    setIsEditing(false);
  };

  const enterEditMode = (todo) => {
    setEditedTodo(todo);
    setIsEditing(true);
  };

  return !isAuth ? (
    <div>
      <Auth setIsAuth={setIsAuth} cookies={cookies} />
    </div>
  ) : (
    <>
      {auth.currentUser && (
        <div>
          <Navbar setIsAuth={setIsAuth} cookies={cookies} isAuth={isAuth} />

          <TodoForm addTodo={addTodo} />

          <ul>
            {todoList.map((todo) => (
              <Todo
                todo={todo}
                key={todo.id}
                toggleCompleted={toggleCompleted}
                deleteTodo={deleteTodo}
                enterEditMode={enterEditMode}
              />
            ))}
          </ul>

          {isEditing && (
            <EditForm
              editedTodo={editedTodo}
              editTodo={editTodo}
              closeEditMode={closeEditMode}
            />
          )}

          {todoList.length > 0 && (
            <p>
              You have{" "}
              {todoList.length === 1
                ? `${todoList.length} todo`
                : `${todoList.length} todos`}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default App;
