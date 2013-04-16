"use strict";

/********************
	Array
********************/
// isArray compatibility
if (!Array.isArray) {
	Array.isArray = function (vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	};
}

// indexOf compatibility
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement) {
		if (this === null) {
			throw new TypeError();
		}

		var t = Object.create(this),
			len = t.length >>> 0,
			n, 
			k;

		if (len === 0) {
			return -1;
		}

		if (arguments.length > 1) {
			n = Number(arguments[1]);

			if (isNaN(n)) {
				n = 0;
			} else if (n !== 0 && n !== Infinity && n !== -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}

		if (n >= len) {
			return -1;
		}

		k = (n >= 0) ? n : Math.max(len - Math.abs(n), 0);

		for ( k ; k < len; k++) {
			if (Object.hasOwnProperty.call(t, k) && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}

/********************
	Object
********************/

if (!Object.keys) {
	Object.keys = (function () {
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
			dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			var result = [],
				prop,
				i;

			if ((typeof obj !== 'object' && typeof obj !== 'function') || obj === null) {
				throw new TypeError("Object.keys called on non-object");
			}

			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++ ) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}