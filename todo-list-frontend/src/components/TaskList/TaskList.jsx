import React, { useState } from 'react';
import { toggleTaskComplete, deleteTask } from '../../services/api';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para abrir el modal al hacer clic en el título
    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // Función para marcar una tarea como completada o no completada
    const handleToggleComplete = async (task) => {
        try {
            const updatedTask = await toggleTaskComplete(task.id); // Llama al backend
            onTaskUpdated(updatedTask); // Actualiza el estado en el componente padre
        } catch (error) {
            console.error('Error al alternar el estado de la tarea:', error);
            alert('No se pudo cambiar el estado de la tarea. Intenta de nuevo.');
        }
    };

    // Función para eliminar una tarea
    const handleDelete = async (id) => {
        try {
            await deleteTask(id); // Llama al backend
            onTaskDeleted(id); // Actualiza el estado en el componente padre
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            alert('No se pudo eliminar la tarea. Intenta de nuevo.');
        }
    };

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
                >
                    <div className="flex items-center space-x-3">
                        {/* Checkbox para marcar como completada */}
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task)}
                            className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        {/* Título de la tarea (clickeable para abrir el modal) */}
                        <h3
                            onClick={() => openModal(task)}
                            className={`text-lg cursor-pointer hover:text-blue-500 ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}
                        >
                            {task.title}
                        </h3>
                    </div>
                    {/* Botón para eliminar */}
                    <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label="Eliminar tarea"
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
            ))}

            {/* Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                        {/* Encabezado del modal */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Detalles de la tarea
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Cerrar modal"
                            >
                                <svg
                                    className="w-6 h-6"
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

                        {/* Contenido del modal */}
                        <div className="space-y-3">
                            <p>
                                <span className="font-medium text-gray-700">Título:</span>{' '}
                                {selectedTask.title}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Descripción:</span>{' '}
                                {selectedTask.description || 'Sin descripción'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Fecha de finalización:</span>{' '}
                                {new Date(selectedTask.deadline).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Estado:</span>{' '}
                                {selectedTask.completed ? 'Completada' : 'Pendiente'}
                            </p>
                        </div>

                        {/* Botón para cerrar el modal */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;