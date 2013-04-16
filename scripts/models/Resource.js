/*global klass, Image */

var Resource = klass({

	context: null,

	type: "",  // nature, civilization, space

	resourcesType: {
		name: "savanna", 			// documentar todos os tipos de biomas
		nonWalkable: ['rock', 'rock1','tree'],
		walkable: [],
		amount: 20  				// total of resource that composes this environment
	},

	path: "",
	resources: [],
	
	totalResources: 0,
	totalResourcesLoaded: 0,

	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		this.totalResources = this.resourcesType.nonWalkable.length + this.resourcesType.walkable.length;

		this.loadAllResources();
	},

	loadAllResources: function () {
		var nonWalkable = this.resourcesType.nonWalkable,
			walkable 	= this.resourcesType.walkable,
			length,
			i;

		length = nonWalkable.length;

		for (i = 0; i < length ; i++) {
			this.loadResource(nonWalkable[i]);
		}
		
		length = walkable.length;		
		for (i = 0; i < length ; i++) {
			this.loadResource(walkable[i]);
		}
	},

	loadResource: function(name) {
		var image = new Image();
		var callback = this.resourceLoaded;
			
		image.onload = function () {
			// once the image is loaded:
			this.width = this.naturalWidth;
			this.height = this.naturalHeight;

			callback();
		};

		image.src = this.path + name + ".png";
		this.resources[name] = image;
	},

	resourceLoaded: function(callback) {

		this.totalResourcesLoaded++;
		if (this.totalResources === this.totalResourcesLoaded) {

			if (callback) {
				callback();
			}
		}
	}

});