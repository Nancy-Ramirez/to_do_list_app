import React, { useState, useEffect, useCallback } from "react";
import Alert from "../components/common/Alert";
import TaskList from "../components/TaskList/TaskList.jsx";
import { fetchTasks, createTask } from "../services/api.js";
import { NavbarGeneral } from "../components/common/NavbarGeneral.jsx";
import { ArrowsUpDownIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  const [alert, setAlert] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const showAlert = (type, message) => setAlert({ type, message });
  const closeAlert = () => setAlert(null);


//! Modificación para agrupar de manera correcta
  const groupTasksByDeadline = useCallback((tasksToGroup) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
  
    // Formateamos fechas como YYYY-MM-DD para comparación simple
    const formatDate = (date) => date.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);
  
    console.log("Hoy (formato):", todayStr);
    console.log("Mañana (formato):", tomorrowStr);
  
    const grouped = { Hoy: [], Mañana: [], "Esta semana": [], "Más adelante": [] };
    tasksToGroup.forEach((task) => {
      // Aquí nos aseguramos de que task.deadline esté en formato YYYY-MM-DD
      const deadlineStr = task.deadline instanceof Date ? formatDate(task.deadline) : task.deadline.split("T")[0];
      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);
  
      console.log("Tarea:", task.title, "Deadline (original):", task.deadline, "Deadline (formato):", deadlineStr);
  
      if (deadlineStr === todayStr) {
        grouped["Hoy"].push(task);
        console.log(`Asignada a Hoy: ${task.title}`);
      } else if (deadlineStr === tomorrowStr) {
        grouped["Mañana"].push(task);
        console.log(`Asignada a Mañana: ${task.title}`);
      } else if (deadline > tomorrow && deadline <= endOfWeek) {
        grouped["Esta semana"].push(task);
        console.log(`Asignada a Esta semana: ${task.title}`);
      } else {
        grouped["Más adelante"].push(task);
        console.log(`Asignada a Más adelante: ${task.title}`);
      }
    });
  
    Object.keys(grouped).forEach((group) => {
      let updatedGroup = [...grouped[group]];
      if (sortOption === "completados-primero")
        updatedGroup.sort((a, b) => (b.completed ? 1 : -1) - (a.completed ? 1 : -1));
      else if (sortOption === "pendientes-primero")
        updatedGroup.sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1));
      else if (sortOption === "solo-completados")
        updatedGroup = updatedGroup.filter((task) => task.completed);
      else if (sortOption === "solo-pendientes")
        updatedGroup = updatedGroup.filter((task) => !task.completed);
      grouped[group] = updatedGroup;
    });
  
    console.log("Grupos finales:", grouped);
    return grouped;
  }, [sortOption]);
 //************************************************ */

  const updateTaskInList = (updatedTask) => 
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));

  const removeTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewTask({ title: "", description: "", deadline: "", completed: false });
    setAlert(null);
    setValidationErrors({});
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setAlert(null);
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      showAlert("success", "Tarea creada con éxito");
      setValidationErrors({});
      setTimeout(closeCreateModal, 500);
    } catch (error) {
      console.log("Error completo:", error.response);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors || {};
        console.log("Errores de validación:", errors);
        setValidationErrors(errors);
        showAlert("error", "Por favor, corrige los errores en el formulario");
      } else {
        showAlert("error", error.message || "Error al crear la tarea");
        console.error("Error al crear la tarea:", error);
      }
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar las tareas. Asegúrate de que el backend esté corriendo.");
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    let updatedTasks = [...tasks];
    if (searchTerm) 
      updatedTasks = updatedTasks.filter((task) => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const grouped = groupTasksByDeadline(updatedTasks);
    setGroupedTasks(grouped);
  }, [searchTerm, sortOption, tasks, groupTasksByDeadline]);

  if (loading) 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img src={Logotipo} alt="Logotipo" className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <NavbarGeneral />
      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar tarea"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800 text-sm sm:text-base"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="flex justify-end sm:justify-start items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowSortMenu(!showSortMenu)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <ArrowsUpDownIcon className="w-5 h-5" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button onClick={() => { setSortOption("completados-primero"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Completados primero</button>
                  <button onClick={() => { setSortOption("pendientes-primero"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Pendientes primero</button>
                  <button onClick={() => { setSortOption("solo-completados"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Solo completados</button>
                  <button onClick={() => { setSortOption("solo-pendientes"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Solo pendientes</button>
                  <button onClick={() => { setSortOption("mostrar-todos"); setShowSortMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Mostrar todos</button>
                </div>
              )}
            </div>
            <button onClick={openCreateModal} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700">
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : Object.keys(groupedTasks).every((group) => groupedTasks[group].length === 0) ? (
          <p className="text-center text-gray-500">No hay tareas para mostrar.</p>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedTasks).map((group) => 
              groupedTasks[group].length > 0 && (
                <div key={group}>
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">{group}</h2>
                  <TaskList tasks={groupedTasks[group]} onTaskUpdated={updateTaskInList} onTaskDeleted={removeTask} />
                </div>
              )
            )}
          </div>
        )}

        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Crear nueva tarea</h2>
                <button onClick={closeCreateModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {alert && (
                <div className="mb-4">
                  <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
                </div>
              )}

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de finalización</label>
                  <input
                    type="date"
                    name="deadline"
                    value={newTask.deadline}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.deadline ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {validationErrors.deadline && <p className="text-red-500 text-sm mt-1">{validationErrors.deadline[0]}</p>}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={newTask.completed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Marcar como completada</label>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={closeCreateModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-800">Crear</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;