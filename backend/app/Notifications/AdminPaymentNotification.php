<?php

namespace App\Notifications;

use App\Models\Payment;
use App\Models\Citizen;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminPaymentNotification extends Notification
{
    use Queueable;

    protected $payment;
    protected $citizen;

    public function __construct(Payment $payment, Citizen $citizen)
    {
        $this->payment = $payment;
        $this->citizen = $citizen;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Received: ' . $this->payment->reference_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('A citizen has made a payment.')
            ->line('**Payment Details:**')
            ->line('Citizen: ' . $this->citizen->first_name . ' ' . $this->citizen->last_name)
            ->line('Reference: ' . $this->payment->reference_number)
            ->line('Type: ' . ucfirst($this->payment->type))
            ->line('Amount: $' . number_format($this->payment->amount, 2))
            ->line('Payment Method: ' . ucfirst($this->payment->payment_method))
            ->action('View Payments', url('/payments'))
            ->line('Thank you!');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'admin_payment_received',
            'payment_id' => $this->payment->id,
            'citizen_name' => $this->citizen->first_name . ' ' . $this->citizen->last_name,
            'amount' => $this->payment->amount,
            'reference_number' => $this->payment->reference_number,
            'message' => $this->citizen->first_name . ' ' . $this->citizen->last_name . ' paid $' . number_format($this->payment->amount, 2),
        ];
    }
}