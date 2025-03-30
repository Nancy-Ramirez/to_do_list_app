import React, { useState, useCallback } from 'react';
import Alert from '../common/Alert';
import { toggleTaskComplete, deleteTask, updateTask } from '../../services/api';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedTask: null,
    isEditing: false,
    editedTask: null,
  });
  const [alert, setAlert] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // Estado para errores de validación

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const openModal = useCallback((task, isEditing = false) => {
    const formattedDeadline = task.deadline.includes('T') ? task.deadline.split('T')[0] : task.deadline;
    setModalState({
      isOpen: true,
      selectedTask: { ...task, deadline: formattedDeadline },
      isEditing,
      editedTask: { ...task, deadline: formattedDeadline },
    });
    setAlert(null);
    setValidationErrors({}); // Limpiar errores al abrir el modal
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      selectedTask: null,
      isEditing: false,
      editedTask: null,
    });
    setAlert(null);
    setValidationErrors({}); // Limpiar errores al cerrar el modal
  }, []);

  const toggleEditMode = useCallback(() => {
    const currentTask = modalState.selectedTask;
    closeModal();
    setTimeout(() => openModal(currentTask, true), 100);
  }, [modalState.selectedTask, closeModal, openModal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalState(prev => ({
      ...prev,
      editedTask: {
        ...prev.editedTask,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
    setValidationErrors(prev => ({ ...prev, [name]: null })); // Limpiar error del campo al editar
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const taskToUpdate = {
        title: modalState.editedTask.title,
        description: modalState.editedTask.description || '',
        deadline: modalState.editedTask.deadline,
        completed: modalState.editedTask.completed,
      };
      console.log('Datos enviados a updateTask:', taskToUpdate);
      const response = await updateTask(modalState.selectedTask.id, taskToUpdate);
      console.log('Respuesta de updateTask:', response);
  
      let updatedTask;
      if (response.task && !Array.isArray(response.task)) {
        const formattedDeadline = response.task.deadline.includes('T') ? response.task.deadline.split('T')[0] : response.task.deadline;
        updatedTask = { ...modalState.selectedTask, ...response.task, deadline: formattedDeadline };
      } else {
        updatedTask = { ...modalState.selectedTask, ...taskToUpdate };
        console.log('Usando datos locales porque task es inválido:', updatedTask);
      }
  
      onTaskUpdated(updatedTask);
      showAlert('success', 'Tarea actualizada con éxito');
      setValidationErrors({});
      setTimeout(closeModal, 2000);
    } catch (error) {
      console.log('Error completo:', error.response);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors || {};
        console.log('Errores de validación:', errors);
        setValidationErrors(errors);
        showAlert('error', 'Por favor, corrige los errores en el formulario');
      } else {
        showAlert('error', error.message || 'Error al actualizar la tarea');
        console.error('Error al actualizar:', error);
      }
    }
  };

  const handleDelete = async (id, fromModal = false) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta tarea?');
    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      onTaskDeleted(id);
      if (fromModal) {
        showAlert('success', 'Tarea eliminada con éxito');
        setTimeout(closeModal, 2000);
      } else {
        showAlert('success', 'Tarea eliminada con éxito');
      }
    } catch (error) {
      if (fromModal) showAlert('error', 'Error al eliminar la tarea');
      else showAlert('error', 'Error al eliminar la tarea');
      console.error('Error al eliminar:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await toggleTaskComplete(task.id);
      onTaskUpdated(updatedTask);
      showAlert('success', 'Estado actualizado con éxito');
    } catch (error) {
      showAlert('error', 'Error al cambiar estado');
      console.error('Error al alternar estado:', error);
    }
  };

  return (
    <div className="space-y-4">
      {alert && !modalState.isOpen && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
      )}
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <h3
              onClick={() => openModal(task)}
              className={`text-lg cursor-pointer hover:text-blue-500 transition-colors ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
            >
              {task.title}
            </h3>
          </div>
          <button
            onClick={() => handleDelete(task.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {modalState.isOpen && modalState.selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalState.isEditing ? 'Editar tarea' : 'Detalles de la tarea'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {alert && (
              <div className="mb-4">
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
              </div>
            )}

            {modalState.isEditing ? (
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    name="title"
                    value={modalState.editedTask.title}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="description"
                    value={modalState.editedTask.description || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha límite</label>
                  <input
                    type="date"
                    name="deadline"
                    value={modalState.editedTask.deadline}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.deadline ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {validationErrors.deadline && <p className="text-red-500 text-sm mt-1">{validationErrors.deadline[0]}</p>}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={modalState.editedTask.completed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Completada</label>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={toggleEditMode} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Guardar</button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p><span className="font-medium text-gray-700">Título:</span> {modalState.selectedTask.title}</p>
                <p><span className="font-medium text-gray-700">Descripción:</span> {modalState.selectedTask.description || 'Sin descripción'}</p>
                <p><span className="font-medium text-gray-700">Fecha límite:</span> {modalState.selectedTask.deadline}</p>
                <p><span className="font-medium text-gray-700">Estado:</span> {modalState.selectedTask.completed ? 'Completada' : 'Pendiente'}</p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button onClick={() => handleDelete(modalState.selectedTask.id, true)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Eliminar</button>
                  <button onClick={toggleEditMode} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Editar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;