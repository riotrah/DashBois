/* DashBois - A Multiplayer Dispute Settling Experience
 * 
 * This is the main client file. 
 * 
 * @author Rayat Rahman <github.com/riotrah>
*/

// First, grab the canvas context
const ctx_map = document.getElementById("cvs1").getContext("2d");
const ctx_ent = document.getElementById("cvs2").getContext("2d");

// Set some default level dimensions
let levelWidth = 500;
let levelHeight = 500;
let levelMap = [];
// let bg = "public/img/bg.png";

// Create socket
const socket = io();

/**
 * Draw map onto canvas
 */
function drawMap() {

	// Non future-proof way of loading dirt platform texture.
					// Create canvas Image Object
	const blockImg = new Image();
	blockImg.src = "public/img/textures/dirt.png";

	// Once the above img is loaded, render the tile map textures.
	blockImg.onload = function() {
		
		// Loop through 2d array and draw tiles based on type of block
		for (var i = 0; i < levelMap.length; i++) {

			for (var j = 0; j < levelMap[i].length; j++) {

				if(levelMap[i][j] !== "") { // Unless air, then skip drawing
															
					// Draw block
					ctx_map.drawImage(blockImg, j * 64, i * 64, 64, 64);
				}
			}
		}
	}
}

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
	ctx_ent.canvas.width = levelWidth;
	ctx_ent.canvas.height = levelHeight;
	ctx_map.canvas.width = levelWidth;
	ctx_map.canvas.height = levelHeight;
	ctx_ent.font = '30px Arial';

	// ctx_map.clearRect(0, 0, levelWidth, levelHeight);
	levelMap = data.map;

	// Draw map.
	drawMap();

	// Set background img
	// ctx.canvas.style.backgroundImage = "url('public/img/bg.png')";
});

/**
 * Per tick canvas redraw when given new positions of all character
 * 
 * @param 	String 		[Info flag]
 * @param  Function     [Callback to be called on reception]
 */
socket.on('newPos', function(data) {
	
	// Clear canvas of previous frame
	ctx_ent.clearRect(0,0, levelWidth, levelHeight);

	// For each entity in the given data object (just players for now) draw their sprite
	for(let i = 0; i < data.length; i++) {
		
		// Draw map
		// drawMap();

		// Current iteration holder
		const thisPlayer = data[i];
		// console.log(thisPlayer);

		// Create canvas Image Object, setting its source to given sprite
		const spriteImg = new Image();
		spriteImg.src = "public/" + thisPlayer.spritePath;
		
		// Determine current player direction
		const dir = thisPlayer.dir;
		
		// Save context cfg before flipping for leftwards animations as necessary
		ctx_ent.save();

		// Flip canvas depending on player facing value
		ctx_ent.scale(dir * 1, 1);

		// Draw the image, flipped if necessary!
		ctx_ent.drawImage(spriteImg, dir * thisPlayer.x, thisPlayer.y - 64, dir * 64, 64);
	
		// Restore ctx_ent cfg to pre-flipped stated.
		ctx_ent.restore();

	}


});

/**
 * Sending keyPresses.
 * Captures keyDown events sent to document and passes that event to callback.
 * 
 * @param  Event event [Object holding keyPress data]
 */
document.onkeydown = function(event) {
	
	// drawMap();
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