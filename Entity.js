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
		this.yPrev;

		// Dimensions
		this.width = 30;
		this.height = 30;

		// Axes speeds
		this.xSpeed = 0;
		this.ySpeed = 0;
		// this.yPrevSpeed = 0;

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
	checkXCollision(dir, coords) {

		// console.log("Xcollision", dir, coords);
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
		while(!hit) {

			// check for solid
			let curTile = this.map.pixelCoordsToTile(curCoords);

			// if hit 
			if((curTile.body === "solid") || (curTile.body === "oneWay" && this.yPrev === this.y)) {
				
				hit = true;
				break;
				
			}

			// 	if tile length multiple
			if(curCoords.x % this.map.tileLength !== 0) {
				// break;
				path++;
				curCoords.x += dir;
			} else {
				path += 		this.map.tileLength;
				curCoords.x +=	this.map.tileLength * dir;
			}
		}

		return path ;

	}

	/**
	 * [checkLeftCollision description]
	 * @param  {[type]} coord [description]
	 * @return {[type]} 	  [description]
	 */
	checkYCollision(dir, coords) {

		// console.log("Y collision", dir, coords);
		if(dir === 0) {
			return 0;
		}
		// const map = this.map;
		let hit = false;
		let path = 0;
		let curCoordsL = {
			x: coords.x + 1,
			y: coords.y + (1 + dir) * this.map.tileLength/2
		};
		let curCoordsR = {
			x: coords.x + this.width - 1,
			y: coords.y + (1 + dir) * this.map.tileLength/2
		};
		
		// pixel loop
			// One pixel at a time, move left until a tile.length num is reached
		while(!hit) {

			// check for solid
			let curTileL = this.map.pixelCoordsToTile(curCoordsL);
			let curTileR = this.map.pixelCoordsToTile(curCoordsR);

			// FIX FOR ONE WAY

			// if hit
			// if(curTile.body === "solid") {
			// console.log('curTile.y', curTile.y);
			if(curTileL.body === "solid" || curTileR.body === "solid") {

				hit = true;
				break;
			}
			
			else if ((curTileL.body === "oneWay" & this.yPrev < curTileL.y) || (curTileR.body === "oneWay" & this.yPrev < curTileR.y)) {

				// console.log('	One way!');
				hit = true;
				break;

			} 

			// 	if tile length multiple
			if(curCoordsL.y % this.map.tileLength !== 0) {
				// break;
				path++;
				curCoordsL.y += dir;
				curCoordsR.y += dir;
			} else {
				path += 		this.map.tileLength;
				curCoordsL.y +=	this.map.tileLength * dir;
				curCoordsR.y +=	this.map.tileLength * dir;
			}
		}

		return path;

	}

	/** 
	 * This method is called every tick. 
	 * Calls relevant methods integral to calculating new positions of this.
	 * Also enacts gravity upon the entity!
	 */
	update() {
		// this.xSpeed += this.xAccel;
		this.yPrev = this.y;
		// console.log('yPrev', this.yPrev);
		if(this.ySpeed <= Entity.TERMINAL_VELOCITY) {
			this.ySpeed += this.yAccel;
		}
		this.updatePos();
		// console.log('y:', this.y);
	}

	/**
	 * Updates entity position by moving current pos by axes speeds.
	 */
	updatePos() {

		let potentialPath;
		let minPath;

		// Collision X Check
		
		potentialPath = 	this.checkXCollision(Math.sign(this.xSpeed), this.coords);
		minPath = 			Math.min(Math.abs(this.xSpeed), Math.abs(potentialPath));
		minPath = 			Math.sign(this.xSpeed) * minPath;
		this.x += 			Math.floor(minPath);
		if(!minPath) {
			this.xSpeed = 0;
		}

		// Collision Y Check

		potentialPath = 	this.checkYCollision(Math.sign(this.ySpeed), this.coords);
		minPath = 			Math.min(Math.abs(this.ySpeed), Math.abs(potentialPath));
		minPath = 			Math.sign(this.ySpeed) * minPath;
		this.y += 			(minPath);

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
			
			// this.y = (this.map.tileLength * this.map.dimension);
			// this.ySpeed = -(Math.sqrtthis.ySpeed)); // Slight bounce effect. May remove.
			// this.ySpeed = 0; // Slight bounce effect. May remove.
		
		} else if(this.y <= 0) { // Top edge
			
			this.y = 0;
			this.ySpeed = 0;
		}

	}
}

Entity.TERMINAL_VELOCITY = 20;

module.exports = Entity;