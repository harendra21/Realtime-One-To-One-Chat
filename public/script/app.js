var app = angular.module("myApp", []);
var conn = new WebSocket('ws://localhost:8081');


app.controller('appCtrl', function($scope) {

    $scope.onlineUsers = [];
    $scope.loggedInUser = null;
    $scope.isUserLoggedIn = false;
    $scope.userName = null;
    $scope.toUser = null;
    $scope.messageModel = null;
    $scope.messages = [];
    $scope.newMessage = null;

    $scope.init = function(){
        var userLogedIn = localStorage.getItem('loggedInUser');
       
        if(userLogedIn != null || userLogedIn != undefined){
            $scope.loggedInUser = userLogedIn;
            $scope.isUserLoggedIn = true;
            setTimeout(() => {
                var data = {'type' : 'login', 'name': userLogedIn};
                conn.send(JSON.stringify(data));
            },100)
            
        }else{
            $scope.isUserLoggedIn = false;
            $scope.loggedInUser = null;
        }
    }
    $scope.logout = function(){
        localStorage.removeItem('loggedInUser')
        $scope.init();
        conn.close()
    }
    $scope.login = function(userName){
        var data = {'type' : 'login', 'name': userName};
        localStorage.setItem('loggedInUser',userName)
        $scope.init();
        conn.send(JSON.stringify(data));
    }
    conn.onmessage = function(e) {
        var data = JSON.parse(e.data);
        //console.log(data);
        if(data.type == "onlineUsers"){
            $scope.onlineUsers = data.onlineUsers;
            $scope.$apply();
        }else if (data.type == "message"){
            $scope.messages.push(data.data);
            $scope.newMessage = data.data.from;
            $scope.$apply();
            //$scope.playAudio();
            setTimeout(() => {
                $scope.newMessage = null;
                $scope.$apply();
            },2000)
        }
    };

    $scope.sendMsg = function(message){
        
        if ( message != null ){
            var data = {'type' : 'message', data : {
                from : $scope.loggedInUser,
                to : $scope.toUser,
                message : message
            }};
            $scope.messages.push(data.data)
            conn.send(JSON.stringify(data));
            setTimeout(() => {
                $scope.messageModel = null;
                $scope.$apply();
                console.log('Here');
            },100)
            
        }

       
        
       
    }

    $scope.selectUser = function(toUser){
        $scope.toUser = toUser;
    }

    $scope.playAudio = function() {
        var audio = new Audio('audio/beep.mp3');
        audio.play();
    };
    

});
