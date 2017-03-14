//// Game server

const FPS = 1000/25;
const SOCKET_LIST = {};
// const PLAYER_LIST = {};

class Entity {
	constructor() {
		this.x = 250;
		this.y = 250;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.id = "";
	}

	update() {
		this.updatePos();
	}

	updatePos() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}
}

class Player extends Entity {

	constructor(id) {

		super();
		this.id = id;

 		this.pressingRight = false;
    	this.pressingLeft = false;
    	this.pressingUp = false;
    	this.pressingDown = false;
    	this.maxSpeed = 10;
    	this.score = 0;
	
	    Player.list[id] = this;

	}

    update() {

        this.updateSpeed();
        super.update();
    }
   
    updateSpeed() {

        if(this.pressingRight)
            this.xSpeed = this.maxSpeed;
        else if(this.pressingLeft)
            this.xSpeed = -this.maxSpeed;
        else
            this.xSpeed = 0;
       
        if(this.pressingUp)
            this.ySpeed = -this.maxSpeed;
        else if(this.pressingDown)
            this.ySpeed = this.maxSpeed;
        else
            this.ySpeed = 0;     
    }

}

Player.list = {};

Player.onConnect = function(socket) {

	const player = new Player(socket.id);
	console.log(Player.list);

	socket.on('keyPress', function(data) {
		if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;

	})
}

Player.onDisconnect = function(socket) {

	delete Player.list[socket.id];
}

Player.update = function() {

	const pack = [];

	for (i in Player.list) {
		
		player = Player.list[i]
		// console.log(Player.list[player]);
		player.update();
		pack.push({
			x: player.x,
			y: player.y,
			id: player.id
		});

	}

	return pack;
}

//// Express 

const express = require('express');
const app = express();

// Handle home
app.get('/', function(req, res) {

	res.sendFile(__dirname + "/public/html/index.html");
});

app.use('/client', express.static(__dirname + '/client'));

//// Socket.io

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.sockets.on('connection', function(socket) {

	socket.id = Math.floor(Math.random() * 10);
	SOCKET_LIST[socket.id] = socket;

	Player.onConnect(socket);
	console.log(socket.id);

	socket.on('disconnect', function() {

		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});
});

//// UPDATE FUNCTION

setInterval(function() {

	const pack = Player.update();

	for (i in SOCKET_LIST) {
		
		socket = SOCKET_LIST[i];
		socket.emit('newPos', pack);
	}

}, FPS);


// Starting server
http.listen(8083);
console.log('Magic happens on port 8083');