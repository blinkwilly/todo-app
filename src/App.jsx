import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const STORAGE_KEY = "todoApp.items";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return; // dropped outside list

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore malformed data
      // console.warn("Failed to parse stored items", e);
    }
  }, []);

  // Persist whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore quota errors
    }
  }, [items]);

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handleAdd() {
    const trimmed = inputValue.trim();
    if (trimmed !== "") {
      const newItem = { id: makeId(), text: trimmed, done: false };
      setItems((prevItems) => [...prevItems, newItem]);
      setInputValue("");
    }
  }

  function handleDelete(id) {
    // Add removing class for animation
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
      element.classList.add('removing');
      // Wait for animation to finish before removing
      setTimeout(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }, 300); // matches animation duration
    } else {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  }

  function toggleDone(id) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleAdd();
    }
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>Taxky</h1>
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Enter a task..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="task-input"
        />
        <button onClick={handleAdd} aria-label="add-button">
          <span>Add</span>
        </button>
      </div>

      <div className="list-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todo-list">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="todo-list"
              >
                {items.length === 0 ? (
                  <li className="empty">No tasks yet — add one!</li>
                ) : (
                  items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`todo-item ${item.done ? "done" : ""} ${snapshot.isDragging ? "dragging" : ""
                            }`}
                          data-id={item.id}
                        >
                          <label className="task-row">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => toggleDone(item.id)}
                              aria-label={`toggle-${item.id}`}
                            />
                            <span className="task-text">{item.text}</span>
                          </label>

                          <button
                            className="delete"
                            onClick={() => handleDelete(item.id)}
                            aria-label={`delete-${item.id}`}
                          >
                            ❌
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
