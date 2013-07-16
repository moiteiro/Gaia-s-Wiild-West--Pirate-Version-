/*global klass, Image */

var Resource = klass({

	type: "",  // nature, civilization, space

	resourcesType: {
		name: "savanna",			// documentar todos os tipos de biomas
		nonWalkable: ['rock', 'rock1', 'tree', 'tree1', 'tree2'],
		walkable: [],
		terrain: ['grass1', 'grass2', 'grass3', 'grass4'],
		subsoil: ['subsoil-grass1', 'subsoil-grass2', 'subsoil-grass3', 'subsoil-grass4'],
		amount: 10					// total of resource that composes this environment
	},

	path: "",
	nonWalkableElems: [],
	walkableElems: [],
	terrainElems: [],
	subsoilElems: [],
	elems: [],

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
		var nonWalkable	= this.resourcesType.nonWalkable,
			walkable	= this.resourcesType.walkable,
			terrain		= this.resourcesType.terrain,
			subsoil		= this.resourcesType.subsoil,
			length,
			i;

		length = nonWalkable.length;

		for (i = 0; i < length; i++) {
			this.loadResource(nonWalkable[i], "nonWalkableElems");
		}

		length = walkable.length;
		for (i = 0; i < length; i++) {
			this.loadResource(walkable[i], "walkableElems");
		}

		length = terrain.length;
		for (i = 0; i < length; i++) {
			this.loadResource(terrain[i], "terrainElems");
		}

		length = subsoil.length;
		for (i = 0; i < length; i++) {
			this.loadResource(subsoil[i], "subsoilElems");
		}
	},

	loadResource: function (name, elemsArray) {
		var image = new Image();
		var callback = this.resourceLoaded;

		image.onload = function () {
			// once the image is loaded:
			this.width = this.naturalWidth;
			this.height = this.naturalHeight;

			callback();
		};

		image.src = this.path + name + ".png";
		this.elems[name] = image;
		this[elemsArray][name] = image;
	},

	resourceLoaded: function (callback) {

		this.totalResourcesLoaded++;

		if (this.totalResources === this.totalResourcesLoaded) {
			if (callback) {
				callback();
			}
		}
	}

});
