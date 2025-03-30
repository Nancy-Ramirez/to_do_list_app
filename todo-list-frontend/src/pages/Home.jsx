import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList/TaskList.jsx";
import { fetchTasks, createTask } from "../services/api.js";
import { NavbarGeneral } from "../components/common/NavbarGeneral.jsx";
import {
  ArrowsUpDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Logotipo from "../assets/images/Logotipo-nombre.png";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("mostrar-todos");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    completed: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Función para agrupar tareas por fecha de finalización
  const groupTasksByDeadline = (tasksToGroup) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const grouped = {
      Hoy: [],
      Mañana: [],
      "Esta semana": [],
      "Más adelante": [],
    };

    tasksToGroup.forEach((task) => {
      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);

      if (deadline.getTime() === today.getTime()) {
        grouped["Hoy"].push(task);
      } else if (deadline.getTime() === tomorrow.getTime()) {
        grouped["Mañana"].push(task);
      } else if (deadline > tomorrow && deadline <= endOfWeek) {
        grouped["Esta semana"].push(task);
      } else {
        grouped["Más adelante"].push(task);
      }
    });

    Object.keys(grouped).forEach((group) => {
      let updatedGroup = [...grouped[group]];

      switch (sortOption) {
        case "completados-primero":
          updatedGroup.sort(
            (a, b) => (b.completed ? 1 : -1) - (a.completed ? 1 : -1)
          );
          break;
        case "pendientes-primero":
          updatedGroup.sort(
            (a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1)
          );
          break;
        case "solo-completados":
          updatedGroup = updatedGroup.filter((task) => task.completed);
          break;
        case "solo-pendientes":
          updatedGroup = updatedGroup.filter((task) => !task.completed);
          break;
        default:
          break;
      }

      grouped[group] = updatedGroup;
    });

    return grouped;
  };

  // Cargar las tareas al montar el componente
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError(
          "No se pudieron cargar las tareas. Asegúrate de que el backend esté corriendo."
        );
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Filtrar y agrupar las tareas cuando cambian el término de búsqueda, la opción de ordenamiento o las tareas
  useEffect(() => {
    let updatedTasks = [...tasks];

    if (searchTerm) {
      updatedTasks = updatedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const grouped = groupTasksByDeadline(updatedTasks);
    setGroupedTasks(grouped);
  }, [searchTerm, sortOption, tasks]);

  // Función para actualizar una tarea en la lista
  const updateTaskInList = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // Función para eliminar una tarea de la lista
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Abrir el modal de creación
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
    setNewTask({
      title: "",
      description: "",
      deadline: "",
      completed: false,
    });
  };

  // Cerrar el modal de creación
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Crear una nueva tarea
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      setSuccessMessage("Tarea creada exitosamente.");
      setErrorMessage("");
      setTimeout(() => {
        closeCreateModal();
      }, 1500); // Cierra el modal después de 1.5 segundos
    } catch (error) {
      setErrorMessage("Error al crear la tarea. Intenta de nuevo.");
      setSuccessMessage("");
      console.error("Error al crear la tarea:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src={Logotipo}
          alt="Logotipo"
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarGeneral />
      {/* Contenedor principal */}
      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Campo de búsqueda y botones */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Campo de búsqueda */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar tarea"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Botones de ordenamiento y agregar tarea */}
          <div className="flex items-center gap-3">
            {/* Botón de ordenamiento */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSortOption("completados-primero");
                      setShowSortMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Completados primero
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("pendientes-primero");
                      setShowSortMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Pendientes primero
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("solo-completados");
                      setShowSortMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Solo completados
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("solo-pendientes");
                      setShowSortMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Solo pendientes
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("mostrar-todos");
                      setShowSortMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Mostrar todos
                  </button>
                </div>
              )}
            </div>

            {/* Botón para agregar tarea */}
            <button
              onClick={openCreateModal}
              className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de tareas agrupadas por fecha */}
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : Object.keys(groupedTasks).every(
            (group) => groupedTasks[group].length === 0
          ) ? (
          <p className="text-center text-gray-500">
            No hay tareas para mostrar.
          </p>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedTasks).map(
              (group) =>
                groupedTasks[group].length > 0 && (
                  <div key={group}>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                      {group}
                    </h2>
                    <TaskList
                      tasks={groupedTasks[group]}
                      onTaskUpdated={updateTaskInList}
                      onTaskDeleted={removeTask}
                    />
                  </div>
                )
            )}
          </div>
        )}
      </div>

      {/* Modal para crear tarea */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            {/* Encabezado del modal */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Crear nueva tarea
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-500 hover:text-gray-700"
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

            {/* Formulario para crear tarea */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de finalización
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="completed"
                  checked={newTask.completed}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Marcar como completada
                </label>
              </div>

              {/* Mensajes de éxito o error */}
              {successMessage && (
                <p className="text-green-500 text-sm">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              {/* Botones del formulario */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
