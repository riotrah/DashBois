const ctx = document.getElementById("ctx").getContext("2d");
// ctx.font = '150px Arial';

let levelWidth = 500;
let levelHeight = 500;
const socket = io();

// Receive initialization info from server, setting canvas dimensions and font
socket.on('init', function(data) {
	
	levelWidth = data.width;
	levelHeight = data.height;
	ctx.canvas.width = levelWidth;
	ctx.canvas.height = levelHeight;
	ctx.font = '30px Arial';
});

// Per frame canvas redraw
socket.on('newPos', function(data) {
	
	ctx.clearRect(0,0, levelWidth, levelHeight);
	
	for(let i = 0; i < data.length; i++) {
		ctx.fillText(data[i].id, data[i].x, data[i].y);
	}
});

document.onkeydown = function(event) {

	console.log(event.which);
	
	let up, down, left, right, jump;
	
	if(event.keyCode === 39)      // right
		socket.emit('keyPress', {inputId: 'right', state: true});
        // socket.emit('keyPress',{inputId:'right',state:true});

    if(event.keyCode === 40) // down
    	socket.emit('keyPress', {inputId: 'down', state: true});
        // socket.emit('keyPress',{inputId:'down',state:true});

    if(event.keyCode === 37) // left
    	socket.emit('keyPress', {inputId: 'left', state: true});
        // socket.emit('keyPress',{inputId:'left',state:true});

    if(event.keyCode === 38) // up
    	socket.emit('keyPress', {inputId: 'up', state: true});
        // socket.emit('keyPress',{inputId:'up',state:true});

    if(event.keyCode === 32) // jump
    	socket.emit('keyPress', {inputId: 'jump', state: true});
    	// socket.emit('keyPress',{inputId:'jump', state:true});

    // socket.emit('keyPress', {
    // 	'up': up,
    // 	'down': down,
    // 	'right': right,
    // 	'left': left,
    // 	'jump': jump,
    // })
};

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