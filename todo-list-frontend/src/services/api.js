const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Obtener todas las tareas
export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener las tareas');
  }
  return response.json();
};

// Obtener una tarea específica
export const fetchTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener la tarea');
  }
  return response.json();
};

// Crear una nueva tarea
export const createTask = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Error al crear la tarea');
  }
  const data = await response.json();
  return data.task; // Ajustar para devolver solo la tarea, si el backend lo permite
};

// Actualizar una tarea
export const updateTask = async (id, task) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar la tarea');
  }
  const data = await response.json();
  return data.task; // Ajustar para devolver solo la tarea
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la tarea');
  }
  return response.json();
};

// Alternar el estado de completado
export const toggleTaskComplete = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error al alternar el estado de la tarea');
  }
  const data = await response.json();
  return data.task; // Devolver solo la tarea actualizada
};