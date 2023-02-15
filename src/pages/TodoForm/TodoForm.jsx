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
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/firebase";
import EditForm from "../../components/EditForm/EditForm";
import Todo from "../../components/Todo/Todo";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import styles from "./TodoForm.module.css";
import logo from "../../assets/logo.svg";

const TodoForm = ({ setIsAuth }) => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editedTodo, setEditedTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
    } catch (e) {
      console.error(e);
    }

    navigate("/");
  };

  const handleUserInput = (e) => {
    setTodo(e.target.value);
  };

  const todoLisCollectiontRef = collection(
    db,
    "users",
    auth.currentUser.uid,
    "todoList"
  );

  const addTodo = async (todo) => {
    await addDoc(todoLisCollectiontRef, {
      todo,
      completed: false,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    const queryTodoList = query(
      todoLisCollectiontRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(queryTodoList, (querySnapshot) => {
      let todoList = [];
      querySnapshot.forEach((doc) => {
        todoList.push({ ...doc.data(), id: doc.id });
      });
      setTodoList(todoList);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    addTodo(todo);

    setTodo("");
  };

  const toggleCompleted = async (todo) => {
    await updateDoc(
      doc(db, "users", auth.currentUser.uid, "todoList", todo.id),
      {
        completed: !todo.completed,
      }
    );
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "todoList", id));
  };

  const editTodo = async (todo) => {
    await updateDoc(
      doc(db, "users", auth.currentUser.uid, "todoList", todo.id),
      {
        todo: todo.todo,
      }
    );

    closeEditMode();
  };

  const closeEditMode = () => {
    setIsEditing(false);
  };

  const enterEditMode = (todo) => {
    setEditedTodo(todo);
    setIsEditing(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          <Link to="/todo" className={styles.header}>
            <img src={logo} alt="iDo logo" className={styles.logo} /> iDo
          </Link>
          <div className={styles.profile}>
            <img
              src={
                auth.currentUser.photoURL
                  ? auth.currentUser.photoURL
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
              }
              alt="Profile Picture"
            />
            <button onClick={handleSignOut}>Sign out</button>
          </div>
        </div>

        {todoList.length > 0 && (
          <p>
            You have{" "}
            {todoList.length === 1
              ? `${todoList.length} todo`
              : `${todoList.length} todos`}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            onInput={handleUserInput}
            value={todo}
            placeholder="Add todo"
            autoFocus
            required
          />

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

        {isEditing && (
          <EditForm
            editedTodo={editedTodo}
            editTodo={editTodo}
            closeEditMode={closeEditMode}
          />
        )}

        <ul className={styles.todo}>
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
      </div>
    </div>
  );
};

export default TodoForm;
