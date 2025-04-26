import * as React from 'react';
import { TodoForm } from './components/todo-form';
import { TodoList } from './components/todo-list';
import { TodoResults } from './components/todo-results';
import { TodosContext } from './todo-context';
import './index.scss';

export const App = () => {
  const [todos, setTodos] = React.useState([]);
  return (
    <div className="root">
      <TodosContext.Provider value={{ todos, setTodos }}>
        <TodoForm />
        <TodoList />
        <TodoResults />
      </TodosContext.Provider>
    </div>
  );
};
