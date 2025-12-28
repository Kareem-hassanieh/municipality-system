<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('project_id')->constrained()->onDelete('cascade');
        $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['todo', 'in_progress', 'review', 'completed'])->default('todo');
        $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
        $table->date('start_date')->nullable();
        $table->date('due_date')->nullable();
        $table->integer('estimated_hours')->nullable();
        $table->integer('actual_hours')->nullable();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
