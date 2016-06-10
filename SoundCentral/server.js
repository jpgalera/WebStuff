//server side code
var WebSocketServer = require('ws').Server
	, wss = new WebSocketServer({port: 1234});

wss.broadcast = function(message)
{
	//broadcast a message to all connected clients
	var i;
	for(i=0; i < this.clients.length; i++)
	{
		this.clients[i].send(message);
	}
}

wss.on('connection'. function(ws){

	var room = [];
	
}