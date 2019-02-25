<?php

namespace App;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected $clients;
    private $activeUsers;
    private $activeConnections;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->activeUsers = [];
        $this->activeConnections = [];
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $jsonMsg = json_decode($msg);

        if ($jsonMsg->type == "login") {
            $onlineUsers = [];
            $onlineUsers['type'] = "onlineUsers";
            $this->activeUsers[$from->resourceId] = $jsonMsg->name;
            $onlineUsers['onlineUsers'] = $this->activeUsers;
            $this->sendMessageToAll(json_encode($onlineUsers));
        } elseif ($jsonMsg->type == "message") {
            $this->sendMessageToOthers($from, json_encode($jsonMsg));
        }
    }

    public function sendMessageToOthers($from, $msg)
    {
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                
                $client->send($msg);
            }
        }
    }

    public function sendMessageToAll($msg)
    {
        foreach ($this->clients as $client) {
            $client->send($msg);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);
        unset($this->activeUsers[$conn->resourceId]);
        $onlineUsers = [];
        $onlineUsers['type'] = "onlineUsers";
        $onlineUsers['onlineUsers'] = $this->activeUsers;
        $this->sendMessageToOthers($conn, json_encode($onlineUsers));
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
