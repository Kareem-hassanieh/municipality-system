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
    Schema::create('citizens', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('national_id')->unique();
        $table->string('first_name');
        $table->string('last_name');
        $table->date('date_of_birth');
        $table->enum('gender', ['male', 'female']);
        $table->string('phone')->nullable();
        $table->string('address');
        $table->string('city');
        $table->string('postal_code')->nullable();
        $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
        $table->string('occupation')->nullable();
        $table->string('profile_photo')->nullable();
        $table->boolean('is_verified')->default(false);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
