<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    /**
     * @var Task
     */
    private $taskModel;

    public function __construct(Task $taskModel)
    {
        $this->taskModel = $taskModel;
    }

    /**
     * Recuperar todas las tareas de manera default
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $sort = $request->query('sort', 'created_at');
        $query = $this->taskModel::query();

        $this->applySorting($query, $sort);

        return $this->successResponse($query->get());
    }

    /**
     * Crear nueva tarea
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateTaskData($request);

        $task = $this->taskModel::create($validated);

        return $this->successResponse(['message' => 'Tarea creada con éxito!', 'task' => $task], 201);
    }

    /**
     * Mostrar una tarea especifica
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $task = $this->findTaskOrFail($id);

        return $this->successResponse($task);
    }

    /**
     * Editar una tarea especifica
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
{
    $task = $this->findTaskOrFail($id);
    $validated = $this->validateTaskData($request, false);
    $task->update($validated);
    return $this->successResponse([
        'message' => 'Tarea actualizada con éxito!',
        'task' => $task->only(['id', 'title', 'description', 'deadline', 'completed'])
    ]);
}
    /**
     * Completar una tarea
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function toggleComplete(Request $request, $id): JsonResponse
    {
        $task = $this->findTaskOrFail($id);

        $task->update(['completed' => !$task->completed]);

        return $this->successResponse(['message' => 'El estado de la tarea ha sido cambiado con éxito!', 'task' => $task]);
    }

    /**
     * Eliminar una tarea especifica
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $task = $this->findTaskOrFail($id);

        $task->delete();

        return $this->successResponse(['message' => 'La tarea ha sido eliminada con éxito!'], 204);
    }

    /**
     * Aplicar orden de tareas
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $sort
     * @return void
     */
    private function applySorting($query, string $sort): void
    {
        $sortingRules = [
            'deadline' => fn() => $query->orderBy('deadline', 'asc'),
            'completed-first' => fn() => $query->orderBy('completed', 'desc')->orderBy('deadline', 'asc'),
            'pending-first' => fn() => $query->orderBy('completed', 'asc')->orderBy('deadline', 'asc'),
            'only-completed' => fn() => $query->where('completed', true)->orderBy('deadline', 'asc'),
            'only-pendings' => fn() => $query->where('completed', false)->orderBy('deadline', 'asc'),
            'created_at' => fn() => $query->orderBy('created_at', 'asc'),
        ];

        $defaultSort = fn() => $query->orderBy('created_at', 'asc');
        $sortingRules[$sort] ? $sortingRules[$sort]() : $defaultSort();
    }

    /**
     * Validar datos de la tarea
     *
     * @param Request $request
     * @param bool $includeCompleted
     * @return array
     * @throws ValidationException
     */
    private function validateTaskData(Request $request, bool $includeCompleted = true): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date|after_or_equal:today',
        ];

        if ($includeCompleted) {
            $rules['completed'] = 'sometimes|boolean';
        }

        $messages = [
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'deadline.required' => 'La fecha límite es obligatoria.',
            'deadline.date' => 'La fecha límite debe ser una fecha válida.',
            'deadline.after_or_equal' => 'La fecha límite no puede ser anterior a hoy.',
            'completed.boolean' => 'El estado de completado debe ser verdadero o falso.',
        ];

        return $request->validate($rules, $messages);
    }

    /**
     * Encontrar una tarea por ID o fallar con una respuesta 404.
     *
     * @param int $id
     * @return Task
     */
    private function findTaskOrFail($id): Task
    {
        return $this->taskModel::findOrFail($id);
    }

    /**
     * Devuelve una respuesta JSON estandarizada de éxito.
     *
     * @param mixed $data
     * @param int $status
     * @return JsonResponse
     */
    private function successResponse($data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Devuelve una respuesta JSON de error estandarizada.
     *
     * @param string $message
     * @param int $status
     * @return JsonResponse
     */
    private function errorResponse(string $message, int $status): JsonResponse
    {
        return response()->json(['message' => $message], $status, [], JSON_UNESCAPED_UNICODE);
    }
}