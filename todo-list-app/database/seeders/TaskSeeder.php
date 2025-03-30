<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;

class TaskSeeder extends Seeder
{
    public function run()
    {
        Task::create([
            'title' => 'Activity 1',
            'description' => 'Description for Activity 1',
            'deadline' => '2025-04-01',
            'completed' => false,
        ]);

        Task::create([
            'title' => 'Activity 2',
            'description' => 'Description for Activity 2',
            'deadline' => '2025-04-02',
            'completed' => true,
        ]);

        Task::create([
            'title' => 'Activity 3',
            'description' => 'Description for Activity 3',
            'deadline' => '2025-04-03',
            'completed' => false,
        ]);

        Task::create([
            'title' => 'Activity 4',
            'description' => 'Description for Activity 4',
            'deadline' => '2025-04-04',
            'completed' => true,
        ]);
    }
}