/* eslint-disable react/jsx-indent */
// src/todo-provider.jsx
import React, { useState } from 'react';
import { TodosContext } from './todo-context';

export const TodosProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);

    return (
        <TodosContext.Provider value={{ todos, setTodos }}>
            {children}
        </TodosContext.Provider>
    );
};
