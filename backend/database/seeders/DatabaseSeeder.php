<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin Account
        User::create([
            'name' => 'Admin',
            'email' => 'admin@municipality.com',
            'password' => 'password123',
            'role' => 'admin',
        ]);
    }
}