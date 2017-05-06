/*globals $:false,JSON:false,Vue:true */

var app = new Vue({
  el: '#app',
  data: {
    user : "",
    isLogged : false,
    isOnline : false,
	loginText: 'Login',
	logoutText: 'Logout',
    messages: [],
    message : "",
    socket : null
  },
  methods : 
    {
        onSubmit : function() {
            app.socket.send(JSON.stringify({
                type : "message",
                message : app.message,
                user : app.user
            }));
            app.message = "";
            
        },
        onLogin : function() {
            if (app.socket && app.socket.readyState == 1) {
                app.isOnline = false;
                app.socket.send(JSON.stringify({
	                type : "logout",
	                user : app.user
	            }));
            } else {
                app.socket = createSocket();
                app.socket.onopen = function() {
                    app.isLogged = true;
                    app.isOnline = true;
                    app.socket.send(JSON.stringify({
                        type : "open",
                        user : app.user
                    }));
                };
                app.socket.onclose = function(evt) {
                    app.isOnline = false;
                };
                app.socket.onmessage = function(evt) {
                    var data = JSON.parse(evt.data);
                    app.messages.unshift(data);
                };
            }
        },
        onClear : function() {
        	app.messages = [];
        	app.socket && app.socket.send(JSON.stringify({
                type : "clear",
                user : app.user
            }));
        }
    }
});

function createSocket() {
	console.log("WS ",window.location.hostname);
    return new WebSocket("ws://"+window.location.hostname+":5000");
}
