<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
   //Nos ayuda a listar las tareas con las diferentes opciones requeridas
   public function index(Request $request)
   {
    //Ordena por fecha de creación
    $sort = $request->query('sort', 'created_at'); 

    $query = Task::query();

    switch($sort) {
        //Ascendente por fecha limite
        case 'deadline':
            $query->orderBy('deadline', 'asc');
            break;
        
        //Completados primero
        case 'completed-first':
            $query->orderBy('completed', 'desc')->orderBy('deadline', 'asc');
            break;
        
        //Pendientes primero
        case 'pending-first':
            $query->orderBy('completed', 'asc')->orderBy('deadline', 'asc' );
            break;
            
        //Solo completados
        case 'only-completed':
            $query->where('completed', true)->orderBy('deadline', 'asc');
            break;
        
        //Solo pendientes
        case 'only-pendings':
            $query->where('completed', false)->orderBy('deadline', 'asc');
            break;

        //Por fecha de creación
        case 'created_at':
            $query->orderBy('created_at', 'asc');
            break;
        
        default:
            $query->orderBy('created_at', 'asc');
            break;
    }
    return $query->get();
   }

   //Crear una nueva tarea
public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date|after_or_equal:today',
            'completed' => 'sometimes|boolean',
        ], [
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'deadline.required' => 'La fecha límite es obligatoria.',
            'deadline.date' => 'La fecha límite debe ser una fecha válida.',
            'deadline.after_or_equal' => 'La fecha límite no puede ser anterior a hoy.',
            'completed.boolean' => 'El estado de completado debe ser verdadero o falso.',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    }

    $task = Task::create($validated);
    return response()->json([
        'message' => 'Tarea creada con éxito!',
        'task' => $task
    ], 201);
}

   public function show(Task $task)
   {
       return response()->json($task);
   }

   //Editar los campos de una tarea 
   public function update(Request $request, Task $task)
   {
    $validated = $request->validate([
       'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'deadline' => 'required|date|after_or_equal:today',
    ],[
        'title.required' =>'El titulo es obligatorio.',
        'title.max' => 'El titulo no puede tener más de 255 caracteres.',
        'deadline.required' => 'La fecha límite es obligatoria.',
        'deadline.date' => 'La fecha límite debe ser una fecha válida',
        'deadline.after_or_equal' => 'La fecha límite no puede ser anterior a hoy.', 
    ]);

    $task->update($validated);
    return response()->json([
        'message' => 'Tarea actualizada con éxito!',
        'task' => $task
    ]);
   }

   //Alternar el estado de la tarea
   public function toggleComplete(Request $request, Task $task)
   {
     $task->update(['completed' => !$task->completed]);
     return response()->json([
        'message' =>'El estado de la tarea ha sido cambiado con éxito!',
        'task' => $task
     ]);
   }

   //Eliminar una tarea
   public function destroy(Task $task)
   {
    $task->delete();
    return response()->json([
        'message' => 'La tarea ha sido elimina con éxito!'
    ], 204);
   }
}