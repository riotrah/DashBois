// Entity.js

// const this.map.gravity = 1; // Gravity constant: how many pixels per tick per tick to push entities downwards.

/**
 * Class representing Entities, which are any moving or physics-bound objects
 */
class Entity {

	/**
	 * Constructor.
	 */
	constructor(map) {
		
		// The map this entity belongs to
		this.map = map;

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
		this.yAccel = this.map.gravity;

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

	get coords() {
		return {
			x: this.x,
			y: this.y
		}
	}

	/**
	 * [checkLeftCollision description]
	 * @param  {[type]} coord [description]
	 * @return {[type]} 	  [description]
	 */
	checkLeftCollision(coords) {

		// const map = this.map;
		let hit = false;
		let path = 0;
		let curCoords = {
			x: coords.x,
			y: coords.y
		};
		
		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		while(!hit) {

			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if(curTile.body === "solid") {
				hit = true;
				break;
				
			} else {
			// 		if tile length multiple
				if(curCoords.x % this.map.tileLength === 0) {
					break;
				}
			}
			path++;
			curCoords.x--;
		}

		// tile length loop
			// tile length pixels at a time
		while(!hit) {
			

			//  check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);
			
			//  if hit
			if(curTile.body === "solid") {
				hit = true;
				break;
			
			}
			path += this.map.tileLength;
			curCoords.x -= this.map.tileLength;

		}

		return path;

	}

	/**
	 * [checkLeftCollision description]
	 * @param  {[type]} coord [description]
	 * @return {[type]} 	  [description]
	 */
	checkXCollision(dir, coords) {

		console.log(dir, coords);
		if(dir === 0) {
			return 0;
		}
		// const map = this.map;
		let hit = false;
		let path = 0;
		let curCoords = {
			x: coords.x + (1 + dir) * this.map.tileLength/2,
			y: coords.y
		};
		
		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		// while(!hit) {

		// 	// check for solid
		// 	let curTile = this.map.pixelCoordsToTile(curCoords);

		// 	// if hit 
		// 	if(curTile.body === "solid") {
		// 		hit = true;
		// 		break;
				
		// 	} else {
		// 	// 		if tile length multiple
		// 		if(curCoords.x % this.map.tileLength === 0) {
		// 			break;
		// 		}
		// 	}
		// 	path++;
		// 	// curCoords.x--;
		// 	curCoords.x += dir;
		// }

		// // tile length loop
		// 	// tile length pixels at a time
		// while(!hit) {
			

		// 	//  check for solid
		// 	let curTile = this.map.pixelCoordsToTile(curCoords);
			
		// 	//  if hit
		// 	if(curTile.body === "solid") {
		// 		hit = true;
		// 		break;
			
		// 	}
		// 	path += this.map.tileLength;
		// 	curCoords.x += dir * this.map.tileLength;

		// }

		while(!hit) {

			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if(curTile.body === "solid") {
				hit = true;
				break;
			}
			// pixel level
			
			if(curCoords.x % this.map.tileLength !== 0) {
				path++;
				curCoords.x += dir;
			} else {
				path += this.map.tileLength;
				curCoords.x += dir * this.map.tileLength;
			}
		}


		return path;

	}

	/**
	 * [checkLeftCollision description]
	 * @param  {[type]} coord [description]
	 * @return {[type]} 	  [description]
	 */
	checkYCollision(dir, coords) {

		console.log(dir, coords);
		if(dir === 0) {
			return 0;
		}
		// const map = this.map;
		let hit = false;
		let path = 0;
		let curCoords = {
			x: coords.x,
			y: coords.y + (1 + dir) * this.map.tileLength/2
		};
		
		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		// while(!hit) {

		// 	// check for solid
		// 	let curTile = this.map.pixelCoordsToTile(curCoords);

		// 	// if hit 
		// 	if(curTile.body === "solid") {
		// 		hit = true;
		// 		break;
				
		// 	} else {
		// 	// 		if tile length multiple
		// 		if(curCoords.y % this.map.tileLength === 0) {
		// 			break;
		// 		}
		// 	}
		// 	path++;
		// 	// curCoords.x--;
		// 	curCoords.y += dir;
		// }

		while(!hit) {

			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if(curTile.body !== "air") {
				hit = true;
				break;
			}
			// pixel level
			
			if(curCoords.y % this.map.tileLength !== 0) {
				path++;
				curCoords.y += dir;
			} else {
				path += this.map.tileLength;
				curCoords.y += dir * this.map.tileLength;
			}
		}

		// tile length loop
			// tile length pixels at a time
		// while(!hit) {
			

		// 	//  check for solid
		// 	let curTile = this.map.pixelCoordsToTile(curCoords);
			
		// 	//  if hit
		// 	if(curTile.body === "solid") {
		// 		hit = true;
		// 		break;
			
		// 	}
		// 	path += this.map.tileLength;
		// 	curCoords.y += dir * this.map.tileLength;

		// }

		return path;

	}

	/**
	 * [checkRightCollision description]
	 * @param  {[type]} coords [description]
	 * @return {[type]}       [description]
	 */
	checkRightCollision(coords) {
		// const map = this.map;
		let hit = false;
		let path = 0;
		let curCoords = {
			x: coords.x,
			y: coords.y
		};
		
		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		while(!hit) {

			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if(curTile.body === "solid") {
				hit = true;
				break;
				
			// 	else
			} else {
				if(curCoords.x % this.map.tileLength === 0) {
					break;
					
				}
			}
			path++;
			curCoords.x++;
		}

		// tile length loop
			// tile length pixels at a time
		while(!hit) {

			
			path += this.map.tileLength;
			curCoords.x += this.map.tileLength;

			//  check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);
			
			//  if hit
			if(curTile.body === "solid") {
				hit = true;
				break;
			
			}

		}

		return path;
	}

	/**
	 * [checkRightCollision description]
	 * @param  {[type]} coords [description]
	 * @return {[type]}       [description]
	 */
	checkTopCollision(coords) {

		let hit = false;
		let path = 0;
		let curCoords = {
			x: coords.x,
			y: coords.y
		};

		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		while(!hit) {

			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if(curTile.body === "solid") {
				hit = true;
				break;
				
			// 	else
			} else {
				if(curCoords.y % this.map.tileLength === 0) {
					break;
					
				}
			}
			path++;
			curCoords.y--;
		}

		// tile length loop
			// tile length pixels at a time
		while(!hit) {
			
			//  check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);
			
			//  if hit
			if(curTile.body === "solid") {
				hit = true;
				break;
			
			}
			path += this.map.tileLength;
			curCoords.y -= this.map.tileLength;

		}

		return path;
	}

	/**
	 * [checkRightCollision description]
	 * @param  {[type]} coords [description]
	 * @return {[type]}       [description]
	 */
	checkBottomCollision(coords) {

		let hit = false;
		let path = 0;
		let curCoords = {
			x: coords.x,
			y: coords.y
		};
		
		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		while(!hit) {


			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if(curTile.body !== "air") {
				hit = true;
				break;
				
			} else {
				if(curCoords.y % this.map.tileLength === 0) {
					break;
					
				}
			}
			path++;
			curCoords.y++;
		}

		// tile length loop
			// tile length pixels at a time
		while(!hit) {

			
			path += this.map.tileLength;
			curCoords.y += this.map.tileLength;

			//  check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);
			
			//  if hit
			if(curTile.body !== "air") {
			//  	return path
				hit = true;
				// return path;
				break;
			
			}
			//  else
			//  	loop again

		}

		// console.log("	path:", path);
		return path;
	}

	/** 
	 * This method is called every tick. 
	 * Calls relevant methods integral to calculating new positions of this.
	 * Also enacts gravity upon the entity!
	 */
	update() {
		// this.xSpeed += this.xAccel;
		if(this.ySpeed <= Entity.TERMINAL_VELOCITY) {
			this.ySpeed += this.yAccel;
		}
		this.updatePos();
	}

	/**
	 * Updates entity position by moving current pos by axes speeds.
	 */
	updatePos() {


		// Collision X Check
		let potentialPath;
		let minPath

		// if(this.xSpeed < 0) { // Moving left
		// 	xPotentialPath = this.checkLeftCollision({x: this.x, y: this.y});
		// 	// console.log('xPotentialPath:', xPotentialPath, 'xSpeed:', this.xSpeed);
		// 	this.x -= Math.floor(Math.min(Math.abs(this.xSpeed), Math.abs(xPotentialPath)));
		// 	if(xPotentialPath === 0)
		// 		this.xSpeed = 0;
		// } else if(this.xSpeed > 0) { // Moving right
		// 	xPotentialPath = this.checkRightCollision({x: this.x + this.width, y: this.y});
		// 	this.x += Math.floor(Math.min(Math.abs(this.xSpeed), Math.abs(xPotentialPath)));
		// 	if(xPotentialPath === 0)
		// 		this.xSpeed = 0;
		// }
		
		potentialPath = 	this.checkXCollision(Math.sign(this.xSpeed), this.coords);
		minPath = 			Math.min(Math.abs(this.xSpeed), Math.abs(potentialPath));
		minPath = 			Math.sign(this.xSpeed) * minPath;
		this.x += 			Math.floor(minPath);

		// Collision Y Check
		// let yPotentialPath;

		// if(this.ySpeed < 0) { // Moving up
			// yPotentialPath = this.checkTopCollision({x: this.x, y: this.y});
			// this.y -= Math.floor(Math.min(Math.abs(this.ySpeed), Math.abs(yPotentialPath)));
			// if(yPotentialPath === 0)
				// this.ySpeed = 0;
		// } else if(this.ySpeed > 0) { // Moving down
			// yPotentialPath = this.checkBottomCollision({x: this.x, y: this.y + this.height});
			// this.y += Math.floor(Math.min(Math.abs(this.ySpeed), Math.abs(yPotentialPath)));
			// if(yPotentialPath === 0)
				// this.ySpeed = 0;
		// }
		
		potentialPath = 	this.checkXCollision(Math.sign(this.ySpeed), this.coords);
		minPath = 			Math.min(Math.abs(this.ySpeed), Math.abs(potentialPath));
		minPath = 			Math.sign(this.ySpeed) * minPath;
		this.y += 			Math.floor(minPath);

		// X edge detection

		if (this.x + this.width > (this.map.tileLength * this.map.dimension)) { // Right edge
			// 
			this.x = (this.map.tileLength * this.map.dimension) - this.width;
			this.xSpeed = 0;
		// 
		} else if(this.x <= 0) { // Left edge
			// 
			this.x = 0;
			this.xSpeed = 0;
		// 
		}

		// Y edge detection
		if (this.y >= (this.map.tileLength * this.map.dimension)) { // Bottom edge
			
			this.y = (this.map.tileLength * this.map.dimension);
			// this.ySpeed = -(Math.sqrtthis.ySpeed)); // Slight bounce effect. May remove.
			this.ySpeed = 0; // Slight bounce effect. May remove.
		
		} else if(this.y <= 0) { // Top edge
			
			this.y = 0;
			this.ySpeed = 0;
		}

	}
}

Entity.TERMINAL_VELOCITY = 30;

module.exports = Entity;