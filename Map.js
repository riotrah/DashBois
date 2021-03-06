/**
 * Class representing tilemap.
 */
class Map {

	/**
	 * Constructor.
	 */
	constructor(tileLength, dimension, givenTiles, gravity) {

		// Set map's gravity
		this.gravity = gravity;

		// Set map tileLength
		this.tileLength = tileLength;

		// Set map dimensions
		this.dimension = dimension;

		// Array representing the tiles
		this.tiles = [];
		
		this.parse(givenTiles);

		this.textureArray = [];
		this.tilesToTextures();
	}

	/**
	 * Creates an array of Tile Objects from the given array of tile types.
	 * 
	 * @param  Array tiles [Tile type array to be converted]
	 */
	parse(tiles) {
		
		// Create a new Tile object from the given tile type for each element in the array.
		for(let i = 0; i < this.dimension * this.dimension; i++) {
			
			const tile = new Tile(tiles[i], {
				x: (i % this.dimension) * this.tileLength,
				y: (i / this.dimension) * this.tileLength
			})

			// Store in this's Tiles array.
			this.tiles[i] = tile;
		}
	}

	/**
	 * Converts this's Tile array into a texture filename array for passing to client.
	 */
	tilesToTextures() {

		// Convert 1d array to 2d.
		for (var i = 0; i < this.dimension; i++) {
			
			let tempArr = [];
			for (var j = 0; j < this.dimension; j++) {
				
				tempArr.push(this.tiles[i * this.dimension + j].texture);
			}

			this.textureArray.push(tempArr);
		}
		
		// console.log(this.textureArray);
	}

	/**
	 * Converts tile "coords" to the corresponding Tile in this.tiles.
	 * 
	 * @param  {[type]} tileCoords [description]
	 * @return {[type]}            [description]
	 */
	tileCoordsToTile(tileCoords) {

		// console.log("map.js:", tileCoords);
		// console.log("map.js:", Math.floor(tileCoords.y) * this.dimension + Math.floor(tileCoords.x));
		// console.log("map.js:", this.tiles[Math.floor(tileCoords.y) * this.dimension + Math.floor(tileCoords.x)]);
		
		if(tileCoords.x <= -1 || tileCoords.x >= 12 || tileCoords.y <= -1 || tileCoords.y >= 12) {
			// console.log('out of tile map bounds:', tileCoords);
			return new Tile(Map.TILE_TYPES.floor_dirt, {
				x: tileCoords.x,
				y: tileCoords.y
			});
		}

		return this.tiles[Math.floor(tileCoords.y) * this.dimension + Math.floor(tileCoords.x)];
	
	}

	/**
	 * Converts pixel coordinates to tile coords.
	 * 
	 * @param  Object coords [Pixel coords]
	 * @return Object        [Tile coords]
	 */
	pixelCoordsToTileCoords(pixelCoords) {

		// console.log("map.js", pixelCoords);
		const tileCoords = {};

		tileCoords.x = Math.floor(pixelCoords.x / this.tileLength);
		tileCoords.y = Math.floor(pixelCoords.y / this.tileLength) - 1;

		// console.log("map.js", tileCoords);
		return tileCoords;
	}

	/**
	 * Converts pixel coords to the Tile described by their Tile coord equivalent.
	 * 
	 * @param  {[type]} pixelCoords [description]
	 * @return {[type]}             [description]
	 */
	pixelCoordsToTile(pixelCoords) {

		return this.tileCoordsToTile(this.pixelCoordsToTileCoords(pixelCoords));
	}
}

// Static object enumerating different tile textures.
Map.TILE_TEXTURES = {
	
	// Dirt.
	dirt: "dirt.png"
}

// Static object enumerating different physical types for tiles.
Map.TILE_BODIES = {

	// Solid.
	solid: "solid",

	// One Way.
	oneWay: "oneWay",

	// Air.
	air: "air"
}

// Enumerating ombined object types.
Map.TILE_TYPES = {

	air: {body: Map.TILE_BODIES.air, texture : ""},
	floor_dirt: {body: Map.TILE_BODIES.solid, texture : Map.TILE_TEXTURES.dirt},
	platform_dirt: {body: Map.TILE_BODIES.oneWay, texture : Map.TILE_TEXTURES.dirt}
}

/**
 * Class representing the tiles in the tilemap.
 */
class Tile {

	/**
	 * Constructor
	 * @param  TileType  type   [The type of tile. From definitions in Map.TILE_TYPES]
	 * @param  Object    coords [The coordinates of the tile's position]
	 */
	constructor(type, coords) {

		this.body = type.body;
		this.texture = type.texture;
		this.x = coords.x;
		this.y = coords.y;
	}
}

module.exports = Map;
// module.exports.Tile = Tile;