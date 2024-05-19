<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // public $message;
    //codigo antiguo
    // public function __construct(public string  $mensajes, public string $user_id, public string $created_at, public string $nick)
    public function __construct(public string  $mensajes)
    {
        // $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return ['chat'];
    }

    public function broadcastAs()
    {
        return 'message';
    }

}
