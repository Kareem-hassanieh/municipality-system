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
    Schema::create('requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('citizen_id')->constrained()->onDelete('cascade');
        $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
        $table->enum('type', ['certificate', 'complaint', 'service', 'inquiry']);
        $table->string('subject');
        $table->text('description');
        $table->enum('status', ['pending', 'in_progress', 'approved', 'rejected', 'completed'])->default('pending');
        $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
        $table->text('admin_notes')->nullable();
        $table->date('submission_date');
        $table->date('completion_date')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
