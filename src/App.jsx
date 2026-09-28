import { useState, useRef } from "react";
import "./App.css";

let idCounter = 1;

function App() {
  const [addtask, setAddTask] = useState("");
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTask, setCompleteTask] = useState([]);
  const [error, setError] = useState("");
  const dragItem = useRef(null);

  const AddTask = () => {
    const text = addtask.trim();
    if (!text) {
      setError("Task not define..!");
      return;
    }
    setPendingTasks([...pendingTasks, { id: idCounter++, text }]);
    setAddTask("");
    setError("");
  };

  const deleteTask = (id, from) => {
    if (from === "pending") {
      setPendingTasks(pendingTasks.filter((t) => t.id !== id));
    } else {
      setCompleteTask(completedTask.filter((t) => t.id !== id));
    }
  };

  const onDragStart = (id, from) => () => {
    dragItem.current = { id, from };
  };

  const onDrop = (zone) => (e) => {
    e.preventDefault();
    const dragging = dragItem.current;
    if (!dragging || dragging.from === zone) return;
    const { id, from } = dragging;

    if (from === "pending" && zone === "completed") {
      const task = pendingTasks.find((t) => t.id === id);
      setPendingTasks(pendingTasks.filter((t) => t.id !== id));
      setCompleteTask([...completedTask, task]);
    } else if (from === "completed" && zone === "pending") {
      const task = completedTask.find((t) => t.id === id);
      setCompleteTask(completedTask.filter((t) => t.id !== id));
      setPendingTasks([...pendingTasks, task]);
    }
    dragItem.current = null;
  };

  return (
    <div className="container">
      <h1>To-Do App</h1>

      <div className="input">
        <input
          type="text"
          value={addtask}
          onChange={(e) => setAddTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={AddTask}>Add Task</button>
      </div>
      {error && <p className="error-text">{error}</p>}

      <div className="board">
        <div
          className="box pendingbox"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop("pending")}
        >
          <h2>Pending Tasks: {pendingTasks.length}</h2>
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="taskcard"
              draggable
              onDragStart={onDragStart(task.id, "pending")}
            >
              <span>{task.text}</span>
              <button className="deletebtn" onClick={() => deleteTask(task.id, "pending")}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <div
          className="box completedbox"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop("completed")}
        >
          <h2>Completed Tasks: {completedTask.length}</h2>
          {completedTask.map((task) => (
            <div
              key={task.id}
              className="taskcard completed"
              draggable
              onDragStart={onDragStart(task.id, "completed")}
            >
              <span>{task.text}</span>
              <button className="deletebtn" onClick={() => deleteTask(task.id, "completed")}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;








