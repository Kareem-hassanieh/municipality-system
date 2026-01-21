<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetNotification extends Notification
{
    use Queueable;

    protected $token;

    public function __construct(string $token)
    {
        $this->token = $token;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $resetUrl = url('/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email));

        return (new MailMessage)
            ->subject('Reset Your Password - Municipality Management System')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $resetUrl)
            ->line('This password reset link will expire in 60 minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->line('For security reasons, please do not share this link with anyone.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'password_reset',
            'message' => 'Password reset link sent to your email.',
        ];
    }
}