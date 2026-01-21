<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Municipality Management System!')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Thank you for registering with the Municipality Management System.')
            ->line('You can now:')
            ->line('• Submit requests for certificates and services')
            ->line('• Apply for permits and licenses')
            ->line('• Pay bills and taxes online')
            ->line('• Track all your applications in real-time')
            ->action('Go to Dashboard', url('/login'))
            ->line('If you have any questions, please contact your local municipality office.')
            ->line('Welcome aboard!');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'welcome',
            'message' => 'Welcome to Municipality Management System!',
        ];
    }
}