/* DashBois - A Multiplayer Dispute Settling Experience
 * 
 * This is the main server file. 
 * Probably should split into different files for more modularity, 
 * but this is it for now.
 * 
 * @author Rayat Rahman <github.com/riotrah>
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

    	// Setting dimensions
    	this.width = 64;
    	this.height = 64;

    	// Holding keyPresses
 		this.pressingRight = false;
    	this.pressingLeft = false;
    	this.pressingUp = false;
    	this.pressingDown = false;
    	this.pressingJump = false;

    	// Holding current facing direction, > 0 for right, < 0 for left
    	this.facing = 1;

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

    	// Dodging speed
		this.dodgeSpeed = 30;
		// Total time of dodge in frames
    	this.maxDodgeTime = 5;
    	// Holding current dodge time
    	this.dodgeTimer = 0;

		// Sprites Object
		this.spritePaths = {
			idle: "default_char/idle.png",
			walk: "default_char/walk.png",
			jump: "default_char/jump.png",
			dash: "default_char/dash.png",
			dodge: "default_char/dodge.png",
			fall: "default_char/fall.png",
		}

		// Current sprite
		this.currentSprite = "idle";

		// Current sprite path
		this.currentSpritePath = "img/" + this.spritePaths[this.currentSprite];

		// Adding to static Player.list
	    Player.list[id] = this;

	}

	/**
	 * Determines the direction this is face based on current keyPresses.
	 * Also performs important task of updating this's facing direction.
	 * 
	 * @return Object [An object pair with x and y properties holding either 1, 0 or -1 for whether a direction is pressed]
	 */
	direction() {

		let dir = {x: 0, y: 0};

		if(this.pressingLeft) {
			dir.x = -1;
			
			if(!this.inDash)
				this.facing = -1;
		}
		if(this.pressingRight) {
			dir.x = 1;
			
			if(!this.inDash)
				this.facing = 1;
		}
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

		// Get direction of keyPresses
		const dir = this.direction();
		console.log(dir);

		// If both axes are activated, reduce dash time 
		if(dir.x && dir.y){

			this.xSpeed = dir.x * this.dashSpeed;
			this.ySpeed = dir.y * this.dashSpeed;

			// Start dash timer 
			this.dashTimer = this.maxDashTime * .5;

		} else { // Otherwise behave as normal

			this.xSpeed = dir.x * this.dashSpeed;
			this.ySpeed = dir.y * this.dashSpeed;
			
			// Start dash timer 
			this.dashTimer = this.maxDashTime;
		
		}

		// Reset any acceleration so as to prevent effects of Gravity during dash duration
		this.yAccel = 0;
		this.xAccel = 0;

	}

	/**
	 * Dodge method.
	 * Pushes this along ground for shorter but faster movement.
	 * MAY REMOVE
	 */
	dodge() {

		// Set movement state
		this.inDodge = true;

		// Get direction of keyPresses
		const dir = this.direction();
		console.log(dir);

		// Set x speed to dodgeSpeed
		this.xSpeed = dir.x * this.dodgeSpeed;

		// Start dodge timer
		this.dodgeTimer = this.maxDodgeTime;
	}

	/**
	 * Jump method.
	 * Performs parabolic arc jump 
	 */
	jump() {

		// Set movement state
		this.inJump = true;

		// Get direction of keyPresses
		let dir = this.direction();

		// Set ySpeed to this's jumpSpeed
		this.ySpeed = this.jumpSpeed;

		// Set xSpeed to jump in the direction according to keyPresses
		this.xSpeed = dir.x * this.jumpSpeed;
	}

	/**
	 * Updates ground state.
	 * Currently checkes by seeing if this is at level bottom due to lack of platforms!
	 * Updates dash and jump states accordingly.
	 * 
	 * @return Boolean [True if on ground]
	 */
	updateOnGround() {

		// If standing on ground (currently level bottom)
		if(this.y >= levelHeight - (this.height/2)) {
			
			// Set movement states
			this.onGround = true;
			this.inJump = false;
			this.inDash = false;

			// Reset dash timer to ground state (-1)
			this.dashTimer = -1;

			// Make sure gravity returns to normal on ground
			this.yAccel = GRAVITY;

			return true;
		}

		// Clearly isn't on the ground
		this.onGround = false;

		return false;
	}
   
    /**
     * Updates speed of this.
     * Sets axes speeds according to movement conditions and keyPresses
     */
    updateSpeed() {
  
  		// If no longer dashing
    	if(this.dashTimer === 0) {

    		// Set movement state
    		// this.inDash = false;

    		// Resume GRAVITY
    		this.yAccel = GRAVITY * 1; 

    		// this.ySpeed -= (-this.yAccel)/2;
    		
    		// Make drop a little harsher from dash
    		this.ySpeed += 10; 

    		// Reduce x axis momentum from jump
    		this.xSpeed /= 4.5;

    		// Reset dashTimer to -1
    		this.dashTimer--;

    		// Reset dash state
    		// this.inDash = false;
    	}
   	
   		// If simply on the ground
        if(this.onGround && !this.inDodge) {

        	// Set movement and direction based on keyPresses
        	if(this.pressingRight) 
        		this.xSpeed = this.walkSpeed;
        	else if(this.pressingLeft) 
        		this.xSpeed = -this.walkSpeed;
        	else 
        		this.xSpeed = 0;
        }

        // If jumping, influence x speed slightly only
        if(this.inJump && !this.inDash) {

        	// Get direction
        	const dir = this.direction();

        	this.xSpeed += dir.x * jumpSpeed;
        }
    }

    /**
     * Updates the current sprite to send to the client.
     */
    updateSprite() {

    	// Dashing
    	if(this.inDash && this.dashTimer > -1)
    		this.currentSprite = "dash";

    	// Jumping
    	else if(this.inJump && !this.inDash)
    		this.currentSprite = "jump";

    	// Post jump fall
    	else if(this.ySpeed > 0)
    		this.currentSprite = "fall";

    	// Post dash fall
    	else if(this.inDash && this.dashTimer >= 0)
    		this.currentSprite = "fall";
    	
    	// Dodging
    	else if(this.inDodge)
    		this.currentSprite = "dodge";

    	// Walking right
    	else if(this.xSpeed > 0 && this.onGround)
    		this.currentSprite = "walk";

    	// Walking left (haven't flipped sprite yet)
    	else if(this.xSpeed < 0 && this.onGround)
    		this.currentSprite = "walk";

    	// Idle/default
    	else if(this.xSpeed === 0 && this.onGround)
    		this.currentSprite = "idle";

    	this.currentSpritePath = "img/" + this.spritePaths[this.currentSprite];
    	// if(this.currentSprite !== "idle")
    		// console.log(this.currentSpritePath);
    }

    /**
     * Main update method.
     * Updates dash and dodge conditions and timers 
     * Calls appropriate update methods.
     */
    update() {
    	
    	// If still dashing, reduce dash timer
    	if(this.dashTimer > 0) { 
    		
    		this.dashTimer--;
    	
    	} 

    	// If still dodging, reduce dodge timer
    	if(this.dodgeTimer > 0) { 
    		
    		// console.log("dodge", this.dodgeTimer);
    		this.dodgeTimer--;
    	
    	} else if(!this.dodgeTimer) { // If not, reset dodge state
    		
    		this.inDodge = false;
    	}
    	
    	// Update facing direction
    	this.direction();

    	// Call other update methods, including super's position update
    	this.updateOnGround();
        this.updateSpeed();
    	this.updateSprite();
        super.update();
    }

}

// Static object listing of all players in id:Object pairs
Player.list = {};

/**
 * Static method for calling when sockets receive a new connection.
 * Creates and manages each player.
 * Sends keyPresses to each player.
 * 
 * @param Socket socket [The socket from the connected browser]
 */
Player.onConnect = function(socket) {

	// Create new player with given id property of socket.
	const player = new Player(socket.id);
	console.log(Player.list);

	// Handling keyPresses 
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
 * Static method for calling when the socket that created a player disconnects.
 * Deletes the player.
 * 
 * @param Socket socket [The socket from the connected browser]
 */
Player.onDisconnect = function(socket) {

	// Simply delete the property and its value from the Player.list object
	delete Player.list[socket.id];
}

/**
 * Static method for updating every player.
 * Called every tick.
 * 
 * @return Array        [An array holding objects. Each holds axes positions and an id for each player in Player.list]
 */
Player.update = function() {

	const pack = [];

	// Loop thru every player and update them before adding their new positions to the client.
	for (i in Player.list) {
		
		player = Player.list[i]

		player.update();
		pack.push({
			spritePath: player.currentSpritePath,
			x: player.x,
			y: player.y,
			id: player.id,
			dir: player.facing
		});

	}

	return pack;
}

// Level Specific Info.
// Will be made dynamic later!
// These are in pixels.

const levelWidth = 800;
const levelHeight = 800;

//// Express Functionality

const express = require('express');
const app = express();

// Handle home
app.get('/', function(req, res) {

	// Send client index.html
	res.sendFile(__dirname + "/public/html/index.html");
});

// Handle requests to specific files such as client.js and media
app.use('/public', express.static(__dirname + '/public'));

//// Socket.io Functionality

const http = require('http').Server(app);
const io = require('socket.io')(http);
const SOCKET_LIST = {}; // Socket holder


/**
 * Connection handler
 * Creates an ID for every new connection.
 * Makes a player from that ID by calling Player.onConnect().
 * 
 * 
 * @param  String 			[Condition flag. In this case, on connection]
 * @param  Function 		[Callback function. In this case, an anon function]
 */
io.sockets.on('connection', function(socket) {

	// Generate random id for socket from 0 to 10.
	socket.id = Math.floor(Math.random() * 10);
	
	// Add socket to global socket list.
	SOCKET_LIST[socket.id] = socket;

	// Create player from socket id.
	Player.onConnect(socket);
	console.log("Creating player", socket.id);

	// Send level size info to client.
	socket.emit('init', {
		width: levelWidth,
		height: levelHeight
	});

	// Once connected, set a handler for disconnects as well.
	socket.on('disconnect', function() {

		// Delete the socket from the list.
		delete SOCKET_LIST[socket.id];
		// Run player disconnect handler.
		Player.onDisconnect(socket);
	});
});

//// UPDATE FUNCTION

/**
 * Function that is called every tick defined in the engine consts section.
 * Updates every player (eventually every entity as well)
 * 
 * @param  Function 		[The function to call every tick]
 */
setInterval(function() {

	// Create array to send to socket from Player.update().
	const pack = Player.update();

	// Send that pack to every client so everyone is sync'd
	for (i in SOCKET_LIST) {
		
		socket = SOCKET_LIST[i];
		socket.emit('newPos', pack);
	}

}, TICK_INTERVAL);


// Starting server
http.listen(8083);
console.log('Magic happens on port 8083');