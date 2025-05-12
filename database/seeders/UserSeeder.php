<?php

namespace Database\Seeders;

use App\Models\User as ModelsUser;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        ModelsUser::updateOrCreate([
            'email' => 'admin@mail.com',
        ], [
            'name' => 'Admin',
            'email' => 'admin@mail.com',
            'password' => bcrypt('admin1234'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // User
        ModelsUser::updateOrCreate([
            'email' => 'user@mail.com',
        ], [
            'name' => 'User',
            'email' => 'user@mail.com',
            'password' => bcrypt('user1234'),
            'role' => 'user',
            'email_verified_at' => now(),
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
