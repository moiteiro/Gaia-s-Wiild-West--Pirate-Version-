/*global klass, Tile */

var BattleField = klass({

	tileSize: 0,
	scaledTileSize: 0,
	screenWidth: 0,
	screenHeight: 0,
	width: 10,               // amount of squares in X orientation
	height: 10,              // amout of squres in Y orientation
	maxSize: 14,			 // max size for width and height
	minSize: 9,				 // min size for width and height
	viewX: 430,			     // to store de original values
	viewY: 150,			     // to store de original values
	moveX: 0,				 // store the move on x-axis
	moveY: 0,				 // store the move on y-axis
	dx: 430,			     // translation x to start a draw the map 
	dy: 38,					 // translation y to start a draw the map 
	totalPlayableTiles: 0,
	objects: [],
	map: [],

	context: null,
	resources: null,
		
						
	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		this.generateArena();

	},

	render: function () {
		var width = this.width,
			height = this.height,
			tileSize = this.tileSize,
			context = this.context,
			dx = 0,
			dy = 0,
			x = 0,
			y = 0,
			i = 0,
			totalObjects = 0,
			titlesCount = 0;


		context.globalAlpha = 1;
		context.save();
		context.translate(this.dx, this.dy);

		context.scale(1, 0.5);
		context.rotate(45 * Math.PI /180);

		for (y = 0; y < height; y++) {
	    	for (x = 0; x < width; x++) {
	        	
				titlesCount++;
				context.strokeRect(dx, dy, tileSize, tileSize);

				if (this.map[y][x].type === 1) {
					context.fillStyle = "#989836"; //grass
				} else if (this.map[y][x].type === 5) {
					context.fillStyle = "rgba(155, 0, 0, 0.8)";
				} else if (this.map[y][x].type === 6) {
					context.fillStyle = "rgba(255, 0, 0, 0.4)";
				}
				
				context.fillRect(dx,dy,tileSize,tileSize);


				context.globalAlpha = 1;
				context.fillStyle = "black";
				context.font = "normal 14px helvetica";
				context.fillText("(" + x + "," + y + ")", (dx + tileSize/2) - 12, dy + tileSize/2);
				
				dx += tileSize;
	    	}
	    	dx = 0;
	    	dy += tileSize;
		}

		context.restore();

		this.placeResources();
		
	},

	generateArena: function () {

		var mapSize = this.width * this.height,
			minPlayableTiles = 60,
			i = true;

		minPlayableTiles = Math.floor( minPlayableTiles * mapSize / 100);

		this.dx += this.moveX;
		this.dy += this.moveY;

		while (i) {
			this.createMapDimensions();
			this.totalPlayableTiles = this.generatePlayableArena();

			if (this.totalPlayableTiles > minPlayableTiles) {
				i = false;
			}
		}

		this.setNonWalkableTiles();
	},

	createMapDimensions: function() {

		var maxSize = this.maxSize, // map max size
			minSize = this.minSize, // map min size
			y, x;
			
		this.width = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
		this.height = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);

		this.map = new Array(this.height);

		for (y = this.height - 1; y >= 0; y--) {
			this.map[y] = new Array(this.height);
			for (x = this.width - 1; x >= 0; x--) {
				this.map[y][x] = new Tile({
					x:x, 
					y:y, 
					type:0,
					scaledTileSize: this.scaledTileSize
				});
			}
		}


		this.viewX = (this.screenWidth / 2) + (this.height - this.width) *  (this.scaledTileSize / 2);
		this.viewY = (this.screenHeight / 2) - ((this.scaledTileSize / 2 * this.height) + (this.width - this.height) * this.scaledTileSize / 4); 

		this.dx = this.viewX;
		this.dy = this.viewY;
	},

	/**
	 * Defines tiles that can be walkable for characters.
	 * @return {integer} total of walkable tiles.
	 */
	generatePlayableArena: function() {

		var centerX = Math.floor((this.width - 1) / 2), // getting the central point in the arena
			centerY = Math.floor((this.height -1) / 2),
			TotalTiles = this.width * this.height,
			ArenaPerCent = Math.floor(80 * TotalTiles / 100),
			tilePos,
			totalNeighborTiles,
			maxLoop = 0,
			tiles = 9,
			i,
			j;

		// setting a starting point in the map to create a route of common terrain to escape.
		for (i = 2; i >= 0; i--) {
			for(j = 2; j >= 0; j--) {
				this.map[centerY + (i - 1)][centerX + (j - 1)].type = 1; // verificar se existe essa posicao
				ArenaPerCent--;
			}
		}

		i = ArenaPerCent;

		while(i && tiles <= ArenaPerCent) {

			tilePos = this.getARandomMapPosition();
			
			totalNeighborTiles = this.findTotalWalkableNeighbors(tilePos.x, tilePos.y);
			if (totalNeighborTiles === 3) {
				tiles++;
				i--;
				maxLoop = 0;
				this.map[tilePos.y][tilePos.x].type = 1;
			} else {
				maxLoop++;
			}

			if (maxLoop > 100) {
				i = 0;
			}
		}

		return tiles;
	},


	/**
	 * Returns a position that has three neighbor tiles with type = 1
	 */
	findTotalWalkableNeighbors: function(x, y) {
		var neighborAmount = 0,
			map = this.map,
			i,
			j;

		for (i = 2; i >= 0; i--) {
			for(j = 2; j >= 0; j--) {
				if (map[y + (i - 1)] && 
				    map[y + (i - 1)][x + (j - 1)] && 
				    map[y + (i - 1)][x + (j - 1)].type === 1) {
					neighborAmount++;
				}
			}
		}

		return neighborAmount;
	},


	/**
	 * Returns a random x and y position of the battlefield.
	 * @return {object} 
	 */
	getARandomMapPosition: function () {

		var x,
			y, 
			i = true,
			continueSearching = true,
			width = this.width,
			height = this.height;

		
		while (i) {
			x = Math.round(Math.random() * width);
			y = Math.round(Math.random() * height);

			x = x > (width - 1) ? x - 1: x;
			y = y > (height - 1) ? y - 1: y;


			if (this.map[y][x].type === 0 || this.map[y][x].type === null) {
				return {
					x: x,
					y: y
				};
			}
		}
	},


	/**
	 * Sets tiles that characters cannot walk.
	 * This tiles can be used to place Resources.
	 */
	setNonWalkableTiles: function () {
		var i,
		pos,
		index,
		totalResources = this.resources.totalResources,
		nonWalkable = this.resources.resourcesType.nonWalkable,
		amount = this.resources.resourcesType.amount;

		for (i =  amount - 1; i >= 0; i--) {

			index = Math.floor(Math.random() * totalResources);
			pos = this.getARandomMapPosition();

			
			this.objects.push({
				name: nonWalkable[index],
				x: pos.x,
				y: pos.y
			});
			

			this.map[pos.y][pos.x].type = 5;
		}

		this.setSpecialWalkableTiles();
	
		this.objects.sort(function(a, b) { return (a.x * 10 + a.y ) - (b.x * 10 + b.y );});
	},

	/**
	 * Sets tiles that characters walk affected by some type of effect.
	 * This tiles can be used to place that can coxists with characters.
	 */
	setSpecialWalkableTiles: function () {
		var map = this.map,
			width = this.width,
			height = this.height,
			x,
			y;

		for (y = height - 1; y >= 0; y--) {
			for (x = width - 1; x >= 0; x--) {
				if (map[y][x].type === 0) {
					map[y][x].type = 6;
				}
			}
		}
	},


	/**
	 * Place the resources images into the battleField
	 * @return {void}
	 */
	placeResources: function() {

		var objects = this.objects,
			context = this.context,
			resources = this.resources.resources,
			objectsAmount = objects.length,
			image,
			pos,
			i;

		for (i = 0; i < objectsAmount; i++) {
			pos = this.map[objects[i].y][objects[i].x].findTileCenter(this.dx,this.dy);
			image = resources[objects[i].name];
			context.drawImage(image,  pos.x - (image.width / 2),  pos.y - (image.height) + 16 );
		}
	}
});