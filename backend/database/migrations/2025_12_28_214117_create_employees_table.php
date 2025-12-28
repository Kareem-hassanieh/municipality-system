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
    Schema::create('employees', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
        $table->string('employee_id')->unique();
        $table->string('position');
        $table->enum('employment_type', ['full_time', 'part_time', 'contract']);
        $table->date('hire_date');
        $table->date('termination_date')->nullable();
        $table->decimal('salary', 10, 2);
        $table->string('bank_account')->nullable();
        $table->string('emergency_contact')->nullable();
        $table->string('emergency_phone')->nullable();
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
