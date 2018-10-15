const express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || 3000);
console.log("server running");

app.get('/', (req, res) => {
	res.sendFile(__dirname +'/index.html');
}) 

io.sockets.on('connection', (socket) => {
	connections.push(socket);
	console.log('connected: %s socket connected', connections.length);

	//disconnect
	socket.on('disconnect', function(data){
		// if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket),1);
		console.log("Disconnected: %s sockets conected", connections.length)
	});

	//semd message
	socket.on('send message', (data) =>{
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	})

	socket.on('new user', (data, callback) => {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	})

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
})

