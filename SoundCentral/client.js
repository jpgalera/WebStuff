/*client side code*/

var room = require('express')();
var http = require('http').Server(room);
var io = require('socket.io')(http);

room.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('A user has connected');
});

http.listen(7002, function(){
	console.log('listening on *:7002');
});