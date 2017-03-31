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
		this.x += Math.floor(this.xSpeed);
		this.y += Math.floor(this.ySpeed);

		// X edge detection
		if (this.x + this.width > (this.map.tileLength * this.map.dimension)) { // Right edge
			
			this.x = (this.map.tileLength * this.map.dimension) - this.width;
			this.xSpeed = 0;
		
		} else if(this.x <= 0) { // Left edge
			
			this.x = 0;
			this.xSpeed = 0;
		
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

module.exports = Entity;