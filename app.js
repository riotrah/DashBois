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
const TICK_INTERVAL = 1000 / FPS; // The length of each tick.

const Map = require('./Map.js');
// const Entity = require('./Entity.js');
// const HitBox = require('./HitBox.js');
const Player = require('./Player.js');
const TILE_LENGTH = 64; // Standard pixle length of tiles in tilemap.

// Level Specific Info.
// Will be made dynamic later as part of a level creation/reading/generating system.
// Units in pixels.

const levelWidth = 12 * TILE_LENGTH;
const levelHeight = 12 * TILE_LENGTH;
const levelBg = "public/img/bg.png";

// Hardcoding level design right now for a 12x12:
const a = Map.TILE_TYPES.air;
const s = Map.TILE_TYPES.floor_dirt;
const o = Map.TILE_TYPES.platform_dirt;

const tiles = [
a , a , a , a , a , a , a , a , a , a , a , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
a , a , a , a , a , a , o , o , a , a , a , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
a , a , a , a , a , a , a , o , o , o , o , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
a , o , o , o , o , o , a , a , a , a , a , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
a , a , a , a , a , a , a , a , a , a , a , a ,
s , a , a , a , s , a , a , a , s , a , s , a
];

const levelGravity = 1;

const levelMap = new Map(TILE_LENGTH, 12, tiles, levelGravity);
// console.log(levelMap);
// console.log(levelMap.tiles);

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
let SOCKET_COUNT = 0;


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
	socket.id = SOCKET_COUNT++;
	
	// Add socket to global socket list.
	SOCKET_LIST[socket.id] = socket;

	// Create player from socket id.
	Player.onConnect(socket, levelMap);
	console.log("Creating player", socket.id);

	// Send level size info to client.
	socket.emit('init', {
		width: levelWidth,
		height: levelHeight,
		bg: levelBg,
		map: levelMap.textureArray
	});

	// Once connected, set a handler for disconnects as well.
	socket.on('disconnect', function() {

		// Delete the socket from the list.
		delete SOCKET_LIST[socket.id];
		// Run player disconnect handler.
		Player.onDisconnect(socket);
		console.log("Deleting player", socket.id);
		SOCKET_COUNT = Math.max(Object.keys(SOCKET_LIST));
	});
});

//// UPDATE FUNCTION

/**
 * Function that is called every tick defined in the engine consts section.
 * Updates every player (eventually every entity as well)
 * 
 * @param  Function 		[The function to call every tick]
 */
function updateLoop() {

	// Create array to send to socket from Player.update().
	const pack = Player.update();

	// Send that pack to every client so everyone is sync'd
	for (i in SOCKET_LIST) {
		
		socket = SOCKET_LIST[i];
		socket.emit('newPos', pack);
	}

}
// This polyfill is adapted from the MIT-licensed
// https://github.com/underscorediscovery/realtime-multiplayer-in-html5
// var requestAnimationFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (function() {
//     var lastTimestamp = Date.now(),
//         now,
//         timeout;
//     return function(callback) {
//         now = Date.now();
//         timeout = Math.max(0, TICK_INTERVAL - (now - lastTimestamp));
//         lastTimestamp = now + timeout;
//         return setTimeout(function() {
//             callback(now + timeout);
//         }, timeout);
//     };
// })(),

// cancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;

// requestAnimationFrame(updateLoop);

setInterval(updateLoop, TICK_INTERVAL);

// Starting server
http.listen(8083);
console.log('Magic happens on port 8083');
