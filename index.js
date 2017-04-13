/*globals __dirname:false,JSON:false */

// web part
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('client'));

http.listen(3000, function(){
	console.log('http server listening on *:3000');
	console.log("please browse: http://localhost:3000");
});

// socket part
var PORT = 5000;
var ws = require("nodejs-websocket");
var connections = [];

ws.createServer(function (conn) {
	connections.push(conn);
	conn.on("text", function (str) {
		var data = JSON.parse(str);

		var message, style;
		var user = data.user;
		switch (data.type) {
			case "open":
				message = "has been connected";
				style = "info";
				break;
			case "message":
				message = data.message;
				break;
			case "close":
				message =  "has beed disconnected";
				style = "info";
				break;
			case "typing":
				message = "is typing";
				style = "info";
				break;
		}

		message && broadcast(user, message, style);
	});
	conn.on("error", function() {
		console.log(arguments);
	});
	conn.on("close", function (/*code, reason*/) {
		var idx = connections.indexOf(conn);
		~idx && connections.splice(idx, 1);
		console.log("Connection closed");
		broadcast("client closed");
	});
}).listen(PORT);
console.log('websocket server listening on ' + PORT);

function broadcast(user, message, style) {
	connections.forEach(function(c) {
		c.sendText(JSON.stringify({
			message : message,
			user : user,
			style : style
		}));
	});
}