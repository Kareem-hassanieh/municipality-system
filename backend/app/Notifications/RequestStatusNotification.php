<?php

namespace App\Notifications;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequestStatusNotification extends Notification
{
    use Queueable;

    protected $request;
    protected $oldStatus;

    public function __construct(Request $request, string $oldStatus = null)
    {
        $this->request = $request;
        $this->oldStatus = $oldStatus;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $statusMessages = [
            'pending' => 'Your request has been received and is pending review.',
            'in_progress' => 'Good news! Your request is now being processed.',
            'completed' => 'Your request has been completed successfully!',
            'approved' => 'Congratulations! Your request has been approved.',
            'rejected' => 'Unfortunately, your request has been rejected.',
        ];

        $message = $statusMessages[$this->request->status] ?? 'Your request status has been updated.';

        return (new MailMessage)
            ->subject('Request Update: ' . $this->request->subject)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($message)
            ->line('**Request Details:**')
            ->line('Subject: ' . $this->request->subject)
            ->line('Type: ' . ucfirst($this->request->type))
            ->line('Status: ' . ucfirst(str_replace('_', ' ', $this->request->status)))
            ->action('View Request', url('/citizen/requests'))
            ->line('Thank you for using the Municipality Management System!');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'request_status',
            'request_id' => $this->request->id,
            'subject' => $this->request->subject,
            'old_status' => $this->oldStatus,
            'new_status' => $this->request->status,
            'message' => "Your request '{$this->request->subject}' status changed to " . ucfirst(str_replace('_', ' ', $this->request->status)),
        ];
    }
}