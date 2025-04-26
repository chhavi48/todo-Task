/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import * as React from 'react';
import { Checkbox } from '../checkbox';
import { TodosContext } from '../../todo-context';
import './todo-list.scss';

export const TodoList = () => {
  const { todos, setTodos } = React.useContext(TodosContext);
  const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [animateId, setAnimateId] = React.useState(null);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [searchText, setSearchText] = React.useState('');
  const tasksPerPage = 10;
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const flag = window.localStorage.getItem('todo_confirm_delete');
      if (flag === 'false') {
        setShowConfirm(false);
      }
    }
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchText]);

  const toggleCheck = (id) => {
    setAnimateId(id);
    setTimeout(() => {
      const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, checked: !todo.checked } : todo));
      setTodos(updatedTodos);
      setAnimateId(null);
    }, 300);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    setPendingDeleteId(null);
  };

  const confirmDelete = (id) => {
    if (showConfirm) {
      setPendingDeleteId(id);
    } else {
      deleteTodo(id);
    }
  };

  const handleConfirmYes = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      window.localStorage.setItem('todo_confirm_delete', 'false');
      setShowConfirm(false);
    }
    deleteTodo(pendingDeleteId);
  };

  const handleConfirmNo = () => {
    setPendingDeleteId(null);
  };

  const handleDontAskAgainChange = (e) => {
    setDontShowAgain(e.target.checked);
  };

  const handleKeyUp = (e, id) => {
    if (e.keyCode === 13) {
      toggleCheck(id);
    }
  };

  const handleSearchKeyUp = (e) => {
    if (e.keyCode === 27) {
      setSearchText('');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === 'active' && todo.checked) { return false; }
    if (filterStatus === 'completed' && !todo.checked) { return false; }

    if (searchText.trim() !== '') {
      return todo.label.toLowerCase().includes(searchText.toLowerCase());
    }

    return true;
  });

  const indexOfLastTodo = currentPage * tasksPerPage;
  const indexOfFirstTodo = indexOfLastTodo - tasksPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const pageNumbers = [];
  const maxPageButtons = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.checked).length;
  const activeCount = totalCount - completedCount;
  const filteredCount = filteredTodos.length;

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <h1 className="todo-list-title">My Tasks</h1>
        <div className="todo-list-subtitle">
          {todos.length ? `${totalCount} tasks, ${completedCount} completed` : 'No tasks yet'}
        </div>
      </div>

      <div className="todo-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={handleSearchKeyUp}
          />
          {searchText && (
            <button className="search-clear" onClick={() => setSearchText('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <div className="filter-controls">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {(searchText || filterStatus !== 'all') && (
        <div className="filter-summary">
          Showing {filteredCount} {filterStatus !== 'all' ? filterStatus : ''}
          {searchText ? ` tasks matching "${searchText}"` : ' tasks'}
        </div>
      )}

      {filteredTodos.length ? (
        <div className="todo-list-content">
          <div className="todo-items">
            {currentTodos.map((todoItem) => (
              <div
                key={todoItem.id}
                className={`todo-item ${todoItem.checked ? 'checked' : ''} ${animateId === todoItem.id ? 'animate' : ''}`}
              >
                <Checkbox
                  label={todoItem.label}
                  checked={todoItem.checked}
                  onClick={() => toggleCheck(todoItem.id)}
                  onKeyUp={(e) => handleKeyUp(e, todoItem.id)}
                  onDelete={() => confirmDelete(todoItem.id)}
                />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <span>«</span>
              </button>
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span>‹</span>
              </button>

              <div className="pagination-numbers">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={currentPage === number ? 'active' : ''}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? 'page' : null}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span>›</span>
              </button>
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
              >
                <span>»</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="no-todos">
          <div className="no-todos-icon">{searchText ? '🔍' : filterStatus !== 'all' ? '📋' : '📝'}</div>
          <p>
            {searchText
              ? `No tasks matching "${searchText}"`
              : filterStatus !== 'all'
                ? `No ${filterStatus} tasks found`
                : 'Your task list is empty!'}
          </p>
          <p className="no-todos-subtitle">
            {searchText || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Add your first task to get started'}
          </p>
        </div>
      )}

      {pendingDeleteId !== null && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-icon">🗑️</div>
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-checkbox">
              <label>
                <input type="checkbox" checked={dontShowAgain} onChange={handleDontAskAgainChange} />
                <span>Don't show this confirmation again</span>
              </label>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={handleConfirmNo}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleConfirmYes}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
