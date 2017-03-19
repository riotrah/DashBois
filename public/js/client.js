/* DashBois - A Multiplayer Dispute Settling Experience
 * 
 * This is the main client file. 
 * 
 * @author Rayat Rahman <github.com/riotrah>
*/

// First, grab the canvas context
const ctx = document.getElementById("ctx").getContext("2d");

// Set some default level dimensions
let levelWidth = 500;
let levelHeight = 500;
// let bg = "public/img/bg.png";

// Create socket
const socket = io();

/**
 * Receive initialization info from server, setting canvas dimensions and font
 * 
 * @param  String 		[Info flag]
 * @param  Function 	[Callback to be called on reception]
 */
socket.on('init', function(data) {
		
	// Set level/canvas dimensions and font
	levelWidth = data.width;
	levelHeight = data.height;
	ctx.canvas.width = levelWidth;
	ctx.canvas.height = levelHeight;
	ctx.font = '30px Arial';

	ctx.canvas.style.backgroundImage = "url('public/img/bg.png')";
});

/**
 * Per tick canvas redraw when given new positions of all character
 * 
 * @param 	String 		[Info flag]
 * @param  Function     [Callback to be called on reception]
 */
socket.on('newPos', function(data) {
	
	// Clear canvas of previous frame
	ctx.clearRect(0,0, levelWidth, levelHeight);

	// For each entity in the given data object (just players for now) draw their sprite
	for(let i = 0; i < data.length; i++) {
		// ctx.fillText(data[i].id, data[i].x, data[i].y);
		
		// Current iteration holder
		const thisPlayer = data[i];
		// console.log(thisPlayer);

		// Create canvas Image Object, setting its source to given sprite
		const spriteImg = new Image();
		spriteImg.src = "public/" + thisPlayer.spritePath;
		
		// Determine current player direction
		const dir = thisPlayer.dir;
		
		// Save context cfg before flipping if needed
		ctx.save();

		// Flip canvas depending on player facing value
		ctx.scale(dir * 1, 1);

		// Draw the image, flipped if necessary!
		ctx.drawImage(spriteImg, dir * thisPlayer.x, thisPlayer.y - 64, dir * 64, 64);
	
		// Restore ctx cfg
		ctx.restore();
	}

});

/**
 * Sending keyPresses.
 * Captures keyDown events sent to document and passes that event to callback.
 * 
 * @param  Event event [Object holding keyPress data]
 */
document.onkeydown = function(event) {
	
	// Send keyPress status and key according to key pressed.
	if(event.keyCode === 39) // right
		socket.emit('keyPress', {inputId: 'right', state: true});
    if(event.keyCode === 40) // down
    	socket.emit('keyPress', {inputId: 'down', state: true});
    if(event.keyCode === 37) // left
    	socket.emit('keyPress', {inputId: 'left', state: true});
    if(event.keyCode === 38) // up
    	socket.emit('keyPress', {inputId: 'up', state: true});
    if(event.keyCode === 32) // jump
    	socket.emit('keyPress', {inputId: 'jump', state: true});
};

/**
 * Send keyUp events.
 * Resetting the previous function basically.
 * 
 * @param  Event event [Object holding keyPress data]
 */
document.onkeyup = function(event) {

	if(event.keyCode === 39)    //d
        socket.emit('keyPress',{inputId:'right',state:false});
    else if(event.keyCode === 40)   //s
        socket.emit('keyPress',{inputId:'down',state:false});
    else if(event.keyCode === 37) //a
        socket.emit('keyPress',{inputId:'left',state:false});
    else if(event.keyCode === 38) // w
        socket.emit('keyPress',{inputId:'up',state:false});
};