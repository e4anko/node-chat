/*globals $:false,JSON:false,Vue:true */

var app = new Vue({
  el: '#app',
  data: {
    user : "",
    isLogged : false,
    isOnline : false,
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
                app.socket.close();
                app.isLogged = false;
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
                    if (evt.code == 1006) {
                        console.log("reconnect");
                    }
                };
                app.socket.onmessage = function(evt) {
                    var data = JSON.parse(evt.data);
                    app.messages.unshift(data);
                };
            }
        }
    }
});

function createSocket() {
    return new WebSocket("ws://"+window.location.hostname+":5000");
}
