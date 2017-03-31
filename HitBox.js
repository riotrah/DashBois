// Hitbox.js

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

module.exports = HitBox;