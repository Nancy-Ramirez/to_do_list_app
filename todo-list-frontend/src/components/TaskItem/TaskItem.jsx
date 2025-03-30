import React from 'react';
import { deleteTask, toggleTaskComplete } from '../../services/api';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const handleToggleComplete = async () => {
    try {
      const updatedTask = await toggleTaskComplete(task.id);
      onTaskUpdated(updatedTask.task);
    } catch (err) {
      console.error('Error al alternar el estado:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onTaskDeleted(task.id);
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="h-5 w-5 text-blue-500"
        />
        <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.title}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;