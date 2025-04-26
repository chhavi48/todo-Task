/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import { TodosContext } from '../../todo-context';
import './todo-results.scss';

export const TodoResults = () => {
  const { todos } = React.useContext(TodosContext);

  const calculateChecked = () => todos.filter((todo) => todo.checked).length;

  return (
    <div className="todo-results">
      ✅ Done: <strong>{calculateChecked()}</strong>
    </div>
  );
};
