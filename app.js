/* DashBois - A Multiplayer Dispute Settling Experience
 * 
 * This is the main server file. 
 * Probably should split into different files for more modularity, 
 * but this is it for now.
 * 
 * #riotrah
*/


//// Game server

// Engine constants
const FPS = 60; // How many frames per second we're updating the game.
const TICK_INTERVAL = 1000 / FPS; // The length of each tick 
const GRAVITY = 1; // Gravity constant: how many pixels per tick per tick to push entities downwards

/**
 * Class representing Entities, which are any moving or physics-bound objects
 */
class Entity {

	/**
	 * Constructor.
	 */
	constructor() {
		
		// Axes positions (from top left as zero)
		this.x = 250;
		this.y = 250;

		// Dimensions
		this.width = 30;
		this.height = 30;

		// Axes speeds
		this.xSpeed = 0;
		this.ySpeed = 0;

    	// Axes accelerations
		this.xAccel = 0;
		this.yAccel = GRAVITY;

		// ID
		this.id = "";

		// Sprites Object
		this.spritePaths = {
			default: "/"
		}

		// Current sprite
		this.currentSprite = "default";

		// Current sprite path
		this.currentSpritePath = this.spritePaths[this.currentSprite];
	}

	/** 
	 * This method is called every tick. 
	 * Calls relevant methods integral to calculating new positions of this.
	 * Also enacts gravity upon the entity!
	 */
	update() {
		// this.xSpeed += this.xAccel;
		this.ySpeed += this.yAccel;
		this.updatePos();
	}

	/**
	 * Updates entity position by moving current pos by axes speeds.
	 */
	updatePos() {

		// Basic pos change by speed
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		if(this.xAccel >= 1)	
			console.log(this.xAccel);
		// console.log(this.yAccel);

		// X edge detection
		if (this.x + this.width/2 > levelWidth) { // Right edge
			
			this.x = levelWidth - this.width/2;
			this.xSpeed = 0;
		
		} else if(this.x <= 0) { // Left edge
			
			this.x = 0;
			this.xSpeed = 0;
		
		}

		// Y edge detection
		if (this.y >= levelHeight) { // Bottom edge
			
			this.y = levelHeight;
			// this.ySpeed = -(Math.sqrt(this.ySpeed)); // Slight bounce effect. May remove.
			this.ySpeed = 0; // Slight bounce effect. May remove.
		
		} else if(this.y <= 0) { // Top edge
			
			this.y = 0;
			this.ySpeed = 0;
		}
	}
}

/**
 * Defining the hitbox for each object that needs it.
 * Inspired by tutsplus.com's platformer tutorial series.
 * NOTE: Not currently in use.
 */
class HitBox {

	/**
	 * Constructor.
	 * 
	 * @param  Object center   [Object with properties 'x' and 'y' holding positions of the center of the hitbox]
	 * @param  Object halfSize [Same as above, holding half width and half height]
	 */
	constructor(center, halfSize) {

		this.center = center;
		this.halfSize = halfSize; 
	}

	/**
	 * Checks collisions.
	 * 
	 * @param  HitBox otherHitBox [The HitBox to check collisions with]
	 * @return Boolean            [If overlaps, returns true]
	 */
	overlaps(otherHitBox) {

		// Is there an overlap between centers and halfsizes of the two HitBoxes?
		if ( Math.Abs(center.x - other.center.x) > halfSize.x + other.halfSize.x ) return false;
	    if ( Math.Abs(center.y - other.center.y) > halfSize.y + other.halfSize.y ) return false;
	    
	    return true;
	}
}

/**
 * Class representing Players, which are children of Entities.
 */
class Player extends Entity {

	/**
	 * Constructor. Creates entity with player specific properties.
	 * Adds this to static Player.list
	 * 
	 * @param  String id [Takes id given by socket connection for engine reference purposes]
	 */
	constructor(id) {

		super();
		
		// Create HitBox for this. Curently not used.
		// this.hitBox = new HitBox({x: this.x, y: this.y}, {x: this.width/2, y: this.height/2});
		this.id = id; // Unique ID
    	this.score = 0; // Score

    	// Holding keyPresses
 		this.pressingRight = false;
    	this.pressingLeft = false;
    	this.pressingUp = false;
    	this.pressingDown = false;
    	this.pressingJump = false;

    	// Holding movement states
    	this.inJump = false;
    	this.inDash = false;
    	this.inDodge = false;
    	this.onGround = true;

    	// Walking and jumping speeds
    	this.walkSpeed = 10;
		this.jumpSpeed = -20;

		// Dashing speed
		this.dashSpeed = 20;
		// Total time of dash in frames
    	this.maxDashTime = 20;
    	// Holding current dash time
    	this.dashTimer = -1;
    	// Holding previous tick's dashTimer for physics purposes
    	this.prevDashTimer = 0;

    	// Dodging speed
		this.dodgeSpeed = 30;
		// Total time of dodge in frames
    	this.maxDodgeTime = 10;
    	// Holding current dodge time
    	this.dodgeTimer = 0;


		// Sprites Object
		this.spritePaths = {
			default: "/",
			walk: "/",
			jump: "/",
			dash: "/",
			dodge: "/",
			fall: "/",
		}

		// Current sprite
		this.currentSprite = "default";

		// Current sprite path
		this.currentSpritePath = this.spritePaths[this.currentSprite];

		// Adding to static Player.list
	    Player.list[id] = this;

	}

	/**
	 * Determines the direction the player is face based on current keyPresses
	 * 
	 * @return Object [An object pair with x and y properties holding either 1, 0 or -1 for whether a direction is pressed]
	 */
	direction() {

		let dir = {x: 0, y: 0};

		if(this.pressingLeft)
			dir.x = -1;
		if(this.pressingRight)
			dir.x = 1;
		if(this.pressingUp)
			dir.y = -1;
		if(this.pressingDown)
			dir.y = 1;

		return dir;
	}

	/**
	 * Handles user pressing Jump key.
	 * Sends to appropriate method based on current movement state of this.
	 */
	handleJump() {

		// Make sure to check movement state
		console.log(this.updateOnGround());			
		
		// Sending to proper method
		if(this.inDash) { // Already dashing

			return; // Do nothing and break

		} else if(!this.onGround) { // Already jumping / can dash
			
			this.dash();

		} else if(this.onGround && this.pressingDown) { // On the ground, attempting dodge
			
			this.dodge();

		} else if(this.onGround && !this.pressingDown) { // On ground, not holding keyDown / can jump
			
			this.jump();
		}

	}

	/**
	 * Dash method.
	 * Pushes this in a cardinal direction given by keyPresses.
	 * Dashes for amount of ticks specified in this.maxDashTime at this.dashSpeed pixels/tick
	 */
	dash() {

		// Sets movement state
		this.inDash = true;

		// Gets direction of keyPresses
		const dir = this.direction();
		console.log(dir);

		// If both axes are activated, reduce dash speed 
		if(dir.x && dir.y){

			this.xSpeed = dir.x * this.dashSpeed * .50;
			this.ySpeed = dir.y * this.dashSpeed * .50;

		} else { // Otherwise behave as normal

			this.xSpeed = dir.x * this.dashSpeed;
			this.ySpeed = dir.y * this.dashSpeed;
		}

		// Reset any acceleration so as to prevent effects of Gravity during dash duration
		this.yAccel = 0;
		this.xAccel = 0;

		// Start dash timer 
		this.dashTimer = this.maxDashTime;
	}

	/**
	 * Dodge method.
	 * Pushes this along ground for shorter but faster movement.
	 * MAY REMOVE
	 */
	dodge() {

		this.inDodge = true;
		const dir = this.direction();
		console.log(dir);

		this.xSpeed = dir.x * this.dodgeSpeed;

		this.dodgeTimer = this.maxDodgeTime;
	}

	/**
	 * [jump description]
	 * @return {[type]} [description]
	 */
	jump() {

		this.inJump = true;
		let dir = this.direction();
		this.ySpeed = this.jumpSpeed;
		this.xSpeed = dir.x * this.jumpSpeed;
	}

	/**
	 * [updateOnGround description]
	 * @return {[type]} [description]
	 */
	updateOnGround() {

		if(this.y >= levelHeight - (this.height/2)) {
			
			this.onGround = true;
			this.inJump = false;
			this.inDash = false;
			this.dashTimer = -1;
			return true;
		}

		this.onGround = false;
		return false;
	}
   
    /**
     * [updateOnGround description]
     * @return {[type]} [description]
     */
    updateSpeed() {
  
    	if(this.dashTimer === 0) { // If no longer dashing
    		
    		this.yAccel = GRAVITY * 1; // Harsher fall from dash
    		// this.ySpeed -= (-this.yAccel)/2;
    		this.ySpeed += 15;
    		this.xSpeed /= (this.yAccel * 1.5);
    		this.dashTimer--;
    		// console.log('Done!');
    	}

    	this.updateOnGround();
    	
        if (this.onGround) {

        	if(this.pressingRight)
        		this.xSpeed = this.walkSpeed;
        	else if(this.pressingLeft)
        		this.xSpeed = -this.walkSpeed;
        	else 
        		this.xSpeed = 0;
        }
    }

    /**
     * [updateOnGround description]
     * @return {[type]} [description]
     */
    update() {
    	
    	if(this.dashTimer >= 0) { // If still dashing, reduce dash timer
    		
    		// console.log("dash", this.dashTimer);
    		// console.log("prevdash", this.prevDashTimer);
    		this.dashTimer--;
    	
    	} else if(this.dashTimer === 0) {
    		
    		this.inDodge = false;
    	
    	}

    	if(this.dodgeTimer > 0) { // If still dodging, reduce dash timer
    		
    		console.log("dodge", this.dodgeTimer);
    		this.dodgeTimer--;
    	
    	} else if(!this.dodgeTimer) {
    		
    		this.inDodge = false;
    	}
    	
    	this.prevDashTimer = this.dashTimer;
    	this.updateOnGround();
        this.updateSpeed();
        super.update();
    }

}

Player.list = {};

/**
 * Creation and management of each player
 * @return {[type]} [description]
 */
Player.onConnect = function(socket) {

	const player = new Player(socket.id);
	console.log(Player.list);

	// Handling keypresses
	socket.on('keyPress', function(data) {
		if(data.inputId === 'left')
    		player.pressingLeft = data.state;
        else if(data.inputId === 'right')
    		player.pressingRight = data.state;
        else if(data.inputId === 'up')
    		player.pressingUp = data.state;
        else if(data.inputId === 'down')
    		player.pressingDown = data.state;
    	else if(data.inputId === 'jump') {
    		// player.pressingJump = data.state;
    		player.handleJump();
    	}
	})
}

/**
 * [onDisconnect description]
 * @param  {[type]} socket [description]
 * @return {[type]}        [description]
 */
Player.onDisconnect = function(socket) {

	delete Player.list[socket.id];
}

/**
 * [onDisconnect description]
 * @param  {[type]} socket [description]
 * @return {[type]}        [description]
 */
Player.update = function() {

	const pack = [];

	for (i in Player.list) {
		
		player = Player.list[i]

		player.update();
		pack.push({
			x: player.x,
			y: player.y,
			id: player.id
		});

	}

	return pack;
}

// Level Specific

const levelWidth = 800;
const levelHeight = 800;

//// Express 

const express = require('express');
const app = express();

// Handle home
app.get('/', function(req, res) {

	res.sendFile(__dirname + "/public/html/index.html");
});

app.use('/public', express.static(__dirname + '/public'));

//// Socket.io

const http = require('http').Server(app);
const io = require('socket.io')(http);
const SOCKET_LIST = {}; // Socket holder


/**
 * [description]
 * @param  {[type]} socket) {	socket.id  [description]
 * @return {[type]}         [description]
 */
io.sockets.on('connection', function(socket) {

	socket.id = Math.floor(Math.random() * 10);
	SOCKET_LIST[socket.id] = socket;

	Player.onConnect(socket);
	console.log(socket.id);

	socket.emit('init', {
		width: levelWidth,
		height: levelHeight
	});

	socket.on('disconnect', function() {

		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});
});

//// UPDATE FUNCTION

/**
 * [description]
 * @param  {[type]} socket) {	socket.id  [description]
 * @return {[type]}         [description]
 */
setInterval(function() {

	const pack = Player.update();

	for (i in SOCKET_LIST) {
		
		socket = SOCKET_LIST[i];
		socket.emit('newPos', pack);
	}

}, TICK_INTERVAL);


// Starting server
http.listen(8083);
console.log('Magic happens on port 8083');