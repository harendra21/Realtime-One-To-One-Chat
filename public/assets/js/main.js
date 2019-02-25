var conn = new WebSocket('ws://localhost:8080');
var name;
conn.onopen = function (e) {
    console.log("Connec tion established!");
};

function getTime() {
    var date = new Date();

    return date.toLocaleDateString()
};

function sendMessage(e,msgFor) {
    var code = (e.keyCode ? e.keyCode : e.which);

    if (code !== 13) {
        return;
    }

    var message = document.getElementById('message').value;

    if (message.length === 0) {
        return;
    }

    var msg = {};
    msg["type"] = "message";
    msg["name"] = name;
    msg["message"] = message;
    msg["msgFor"] = msgFor;
    msg["from"] = $('#mekey').text();
    conn.send(JSON.stringify(msg));

    var content = document.getElementById('tab_messages_'+msgFor).innerHTML;
    scrollBottom('tab_messages_'+msgFor);

    document.getElementById('tab_messages_'+msgFor).innerHTML = content+'<div class="sent-message">' + message + '</div>' ;
    document.getElementById('message').value = '';
};

function receiveMessage(e) {
    

    var jsonMessage = JSON.parse(e.data);
    
    console.log(jsonMessage);
    if (jsonMessage.type === "message") {
        var content = document.getElementById('tab_messages_'+jsonMessage.from).innerHTML;
        document.getElementById('tab_messages_'+jsonMessage.from).innerHTML = content+'<div class="received-message">' + jsonMessage.message + '</div>';
        scrollBottom('tab_messages_'+jsonMessage.from);
    } else if (jsonMessage.type === "onlineUsers") {
        var count = 0;
        var onlineUsers = "";
        var userChat = "";
        $.each(jsonMessage.onlineUsers, function (key, val) {
            var me = $('#me').text();
            if(me === val){
                $('#mekey').text(key);
            }
            if(me != val){
                if (count === 0) {
                    onlineUsers ='<li class="active"><a href="#tab_'+key+'" data-toggle="pill">'+val+'</a></li>';
                    userChat = '<div class="tab-pane active" id="tab_'+key+'"><h5>'+val+' is online</h5><div class="msg-container" id="tab_messages_'+key+'"></div><textarea id="message" class="form-control" onkeyup="sendMessage(event,'+key+')" placeholder="Type your message here..."></textarea></div>';
               } else {
                   onlineUsers = onlineUsers + '<li><a href="#tab_'+key+'" data-toggle="pill">'+val+'</a></li>';
                   userChat = userChat+'<div class="tab-pane" id="tab_'+key+'"><h5>'+val+'  is online</h5><div class="msg-container" id="tab_messages_'+key+'"></div><textarea id="message" class="form-control" onkeyup="sendMessage(event,'+key+')" placeholder="Type your message here..."></textarea></div>';
               }
               count++;
            }
        });
        //console.log(onlineUsers);
        document.getElementById('onlineUsers').innerHTML = onlineUsers;
        document.getElementById('userChat').innerHTML = userChat;
    }
};

conn.onmessage = function (e) {
    receiveMessage(e);
};

function hideChat() {
    var element = document.getElementById("chatHolder");
    element.style.display = "none";
}

function loginOnEnter(e) {
    var code = (e.keyCode ? e.keyCode : e.which);

    if (code === 13) {
        login();
    }
}

function login() {
    var chatHolder = document.getElementById("chatHolder");
    chatHolder.style.display = "block";
    var loginHolder = document.getElementById("loginHolder");
    loginHolder.style.display = "none";

    name = document.getElementById("text-name").value;
    $('#me').text(name);
    conn.send("{\"type\":\"login\",\"name\":\"" + name + "\"}")
}

$(document).ready(function () {
    hideChat();
});

function scrollBottom(divName){
    var objDiv = document.getElementById(divName);
    objDiv.scrollTop = objDiv.scrollHeight;
}