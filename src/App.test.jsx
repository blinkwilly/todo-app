import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import React from 'react';
expect.extend(matchers);
import App from './App';

beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
});

test("renders empty message when no tasks", () => {
    render(<App />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
});

test("typing and clicking Add creates a new task", () => {
    render(<App />);
    const input = screen.getByLabelText("task-input");
    const addBtn = screen.getByLabelText("add-button");

    fireEvent.change(input, { target: { value: "Buy milk" } });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Buy milk/i)).toBeInTheDocument();
});

test("pressing Enter adds a task", () => {
    render(<App />);
    const input = screen.getByLabelText("task-input");

    fireEvent.change(input, { target: { value: "Walk dog" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.getByText(/Walk dog/i)).toBeInTheDocument();
});

test("delete button removes a task", () => {
    render(<App />);
    const input = screen.getByLabelText("task-input");
    const addBtn = screen.getByLabelText("add-button");

    fireEvent.change(input, { target: { value: "Task to delete" } });
    fireEvent.click(addBtn);

    const task = screen.getByText(/Task to delete/i);
    expect(task).toBeInTheDocument();

    // delete button is next to it
    const deleteBtn = screen.getByRole("button", { name: /delete-/i });
    fireEvent.click(deleteBtn);

    expect(screen.queryByText(/Task to delete/i)).not.toBeInTheDocument();
});

test("items persist to localStorage", () => {
    // Pre-populate localStorage
    const stored = [{ id: "pre-1", text: "Stored task", done: false }];
    localStorage.setItem("todoApp.items", JSON.stringify(stored));

    render(<App />);
    expect(screen.getByText(/Stored task/i)).toBeInTheDocument();
});
