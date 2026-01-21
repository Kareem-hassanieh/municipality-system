<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentNotification extends Notification
{
    use Queueable;

    protected $payment;
    protected $notificationType;

    public function __construct(Payment $payment, string $notificationType = 'status')
    {
        $this->payment = $payment;
        $this->notificationType = $notificationType; // 'status', 'reminder', 'receipt'
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        if ($this->notificationType === 'reminder') {
            return $this->reminderMail($notifiable);
        }

        if ($this->notificationType === 'receipt') {
            return $this->receiptMail($notifiable);
        }

        return $this->statusMail($notifiable);
    }

    protected function statusMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Update: ' . $this->payment->reference_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your payment status has been updated.')
            ->line('**Payment Details:**')
            ->line('Reference: ' . $this->payment->reference_number)
            ->line('Type: ' . ucfirst($this->payment->type))
            ->line('Amount: $' . number_format($this->payment->amount, 2))
            ->line('Status: ' . ucfirst($this->payment->status))
            ->action('View Payments', url('/citizen/payments'))
            ->line('Thank you for using the Municipality Management System!');
    }

    protected function reminderMail($notifiable): MailMessage
    {
        $dueDate = $this->payment->due_date ? $this->payment->due_date->format('M d, Y') : 'N/A';
        
        return (new MailMessage)
            ->subject('Payment Reminder: ' . $this->payment->type)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a friendly reminder that you have a pending payment.')
            ->line('**Payment Details:**')
            ->line('Type: ' . ucfirst($this->payment->type))
            ->line('Amount Due: $' . number_format($this->payment->amount, 2))
            ->line('Due Date: ' . $dueDate)
            ->line('Reference: ' . $this->payment->reference_number)
            ->action('Pay Now', url('/citizen/payments'))
            ->line('Please ensure timely payment to avoid any late fees.');
    }

    protected function receiptMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Receipt: ' . $this->payment->receipt_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Thank you for your payment! Here is your receipt.')
            ->line('**Receipt Details:**')
            ->line('Receipt Number: ' . $this->payment->receipt_number)
            ->line('Reference: ' . $this->payment->reference_number)
            ->line('Type: ' . ucfirst($this->payment->type))
            ->line('Amount Paid: $' . number_format($this->payment->amount, 2))
            ->line('Payment Method: ' . ucfirst($this->payment->payment_method ?? 'N/A'))
            ->action('View Payment History', url('/citizen/payments'))
            ->line('Thank you for using the Municipality Management System!');
    }

    public function toArray($notifiable): array
    {
        $messages = [
            'status' => "Payment {$this->payment->reference_number} status: " . ucfirst($this->payment->status),
            'reminder' => "Payment reminder: {$this->payment->type} - $" . number_format($this->payment->amount, 2) . " due",
            'receipt' => "Payment confirmed! Receipt: {$this->payment->receipt_number}",
        ];

        return [
            'type' => 'payment_' . $this->notificationType,
            'payment_id' => $this->payment->id,
            'reference_number' => $this->payment->reference_number,
            'amount' => $this->payment->amount,
            'status' => $this->payment->status,
            'message' => $messages[$this->notificationType] ?? 'Payment notification',
        ];
    }
}