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
    Schema::create('events', function (Blueprint $table) {
        $table->id();
        $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('type', ['community', 'training', 'meeting', 'announcement', 'other']);
        $table->string('location')->nullable();
        $table->datetime('start_datetime');
        $table->datetime('end_datetime')->nullable();
        $table->enum('target_audience', ['public', 'staff', 'department', 'all'])->default('public');
        $table->boolean('is_published')->default(false);
        $table->string('image')->nullable();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
