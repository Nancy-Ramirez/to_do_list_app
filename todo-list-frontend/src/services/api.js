const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Obtener todas las tareas
export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al obtener las tareas: ${response.status}`);
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
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al obtener la tarea: ${response.status}`);
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
    const errorData = await response.json();
    const error = new Error(errorData.message || `Error al crear la tarea: ${response.status}`);
    error.response = { status: response.status, data: errorData }; // Adjuntamos la respuesta completa
    throw error;
  }
  const data = await response.json();
  return data.task;
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
    const errorData = await response.json();
    const error = new Error(errorData.message || `Error al actualizar la tarea: ${response.status}`);
    error.response = { status: response.status, data: errorData }; // Adjuntamos la respuesta completa
    throw error;
  }
  const data = await response.json();
  return data.task;
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
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al eliminar la tarea: ${response.status}`);
  }
  return true; // No hay cuerpo en la respuesta (204 No Content)
};

// Alternar el estado de completado
export const toggleTaskComplete = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}/toggle-complete`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al alternar el estado de la tarea: ${response.status}`);
  }
  const data = await response.json();
  return data.task;
};