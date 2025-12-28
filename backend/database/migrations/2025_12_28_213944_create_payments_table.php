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
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('citizen_id')->constrained()->onDelete('cascade');
        $table->enum('type', ['property_tax', 'water_bill', 'electricity_bill', 'waste_fee', 'permit_fee', 'other']);
        $table->string('reference_number')->unique();
        $table->text('description')->nullable();
        $table->decimal('amount', 10, 2);
        $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
        $table->enum('payment_method', ['cash', 'card', 'bank_transfer', 'online'])->nullable();
        $table->date('due_date')->nullable();
        $table->date('payment_date')->nullable();
        $table->string('receipt_number')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
