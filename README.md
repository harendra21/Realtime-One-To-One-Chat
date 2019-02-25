#Introduction to WebSockets
WebSockets is a bi-directional, full-duplex, persistent connection from a web browser to a server. Once a WebSocket connection is established the connection stays open until the client or server decides to close this connection. With this open connection, the client or server can send a message at any given time to the other. This makes web programming entirely event driven, not (just) user initiated. It is stateful. As well, at this time, a single running server application is aware of all connections, allowing you to communicate with any number of open connections at any given time.

#Installation
1. Clone the repository from Github using — “git clone https://github.com/harendra21/Realtime-One-To-One-Chat.git”
2. Place the cloned folder to your local server.
3. Now open cmd in this in the cloned directory and run — “composer install”
4. Then change directory to bin folder by — “cd bin”
5. Stat-server by — “php chat-server.php”
6. Now hit public folder of the project by your browser — “localhost/path_to_your_folder/public”
7. Enjoy!
