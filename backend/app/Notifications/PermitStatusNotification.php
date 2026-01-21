<?php

namespace App\Notifications;

use App\Models\Permit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PermitStatusNotification extends Notification
{
    use Queueable;

    protected $permit;
    protected $oldStatus;

    public function __construct(Permit $permit, string $oldStatus = null)
    {
        $this->permit = $permit;
        $this->oldStatus = $oldStatus;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $statusMessages = [
            'pending' => 'Your permit application has been received and is pending review.',
            'under_review' => 'Your permit application is currently under review.',
            'approved' => 'Congratulations! Your permit has been approved!',
            'rejected' => 'Unfortunately, your permit application has been rejected.',
            'expired' => 'Your permit has expired. Please apply for renewal if needed.',
        ];

        $message = $statusMessages[$this->permit->status] ?? 'Your permit status has been updated.';

        $mail = (new MailMessage)
            ->subject('Permit Update: ' . $this->permit->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($message)
            ->line('**Permit Details:**')
            ->line('Title: ' . $this->permit->title)
            ->line('Type: ' . ucfirst($this->permit->type))
            ->line('Status: ' . ucfirst(str_replace('_', ' ', $this->permit->status)));

        if ($this->permit->status === 'rejected' && $this->permit->rejection_reason) {
            $mail->line('Reason: ' . $this->permit->rejection_reason);
        }

        return $mail
            ->action('View Permits', url('/citizen/permits'))
            ->line('Thank you for using the Municipality Management System!');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'permit_status',
            'permit_id' => $this->permit->id,
            'title' => $this->permit->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->permit->status,
            'message' => "Your permit '{$this->permit->title}' status changed to " . ucfirst(str_replace('_', ' ', $this->permit->status)),
        ];
    }
}