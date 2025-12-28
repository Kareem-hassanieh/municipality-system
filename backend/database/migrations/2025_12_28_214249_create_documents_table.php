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
    Schema::create('documents', function (Blueprint $table) {
        $table->id();
        $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
        $table->string('title');
        $table->string('file_path');
        $table->string('file_type');
        $table->integer('file_size');
        $table->string('documentable_type');
        $table->unsignedBigInteger('documentable_id');
        $table->text('description')->nullable();
        $table->timestamps();

        $table->index(['documentable_type', 'documentable_id']);
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
