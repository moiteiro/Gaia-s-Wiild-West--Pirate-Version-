/*globals window, document*/

"use strict";

/**
Creates a new array from an Object with #length.
*/

if (!window.$A) {
	var $A = function (obj) {
		var a = new Array(obj.length), 
			i;
		for (i = 0; i < obj.length; i++) {
			a[i] = obj[i];
		}
		return a;
	};
}

if (!window.$) {
	var $ = function (id) {
		return document.getElementById(id);
	};
}

if (!window.requestAnimFrame) {
	var requestAnimFrame = (function () {
		return window.resquestAnimationFrame		||
			   window.webkitRequestAnimationFrame 	||
			   window.mozRequestAnimationFrame		||
			   function(callback) {
			   	window.setTimeout(callback, 1000/ 60);
			   };
	})();
}

/**
Merges the src object's attributes with the dst object, ignoring errors.
*/


Object.forceExtend = function(dst, src) {
	var i;
	for (i in src) {
		if (src.hasOwnProperty(i)) {
			try {
				dst[i] = src[i];
			} catch (e) {}
		}
	}
};

// In case Object.extend isn't defined already, set it to Object.forceExtend
if (!Object.extend) {
	Object.extend = Object.forceExtend;
}


var klass = function () {
	var i;

	var c = function () {
		this.initialize.apply(this, arguments);
	};

	c.ancestors = $A(arguments);
	c.prototype = {};

	for (i = 0; i < arguments.length; i++) {
		var a = arguments[i];
		if (a.prototype) {
			Object.extend(c.prototype, a.prototype);
		} else {
			Object.extend(c.prototype, a);
		}
	}
	Object.extend(c, c.prototype);
	return c;
};


var Curves = {

	angularDistance : function(a, b) {
		var pi2 = Math.PI*2;
		var d = (b - a) % pi2;
		if (d > Math.PI) {
			d -= pi2;
		}
		if (d < -Math.PI) {
			d += pi2;
		}
		return d;
	},

	linePoint : function(a, b, t) {
		return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
	},

	quadraticPoint : function(a, b, c, t) {
		var dx = a[0]+(b[0]-a[0])*t,
			ex = b[0]+(c[0]-b[0])*t,
			x = dx+(ex-dx)*t,
			dy = a[1]+(b[1]-a[1])*t,
			ey = b[1]+(c[1]-b[1])*t,
			y = dy+(ey-dy)*t;
		return [x,y];
	},

	cubicPoint : function(a, b, c, d, t) {
		var ax3 = a[0]*3,
			bx3 = b[0]*3,
			cx3 = c[0]*3,
			ay3 = a[1]*3,
			by3 = b[1]*3,
			cy3 = c[1]*3;
		return [
		  a[0] + t*(bx3 - ax3 + t*(ax3-2*bx3+cx3 + t*(bx3-a[0]-cx3+d[0]))),
		  a[1] + t*(by3 - ay3 + t*(ay3-2*by3+cy3 + t*(by3-a[1]-cy3+d[1])))
		];
	},

	linearValue : function(a,b,t) {
		return a + (b-a)*t;
	},

	quadraticValue : function(a,b,c,t) {
		var d = a + (b-a)*t,
			e = b + (c-b)*t;
		return d + (e-d)*t;
	},

	cubicValue : function(a,b,c,d,t) {
		var a3 = a*3, b3 = b*3, c3 = c*3;
		return a + t*(b3 - a3 + t*(a3-2*b3+c3 + t*(b3-a-c3+d)));
	},

	catmullRomPoint : function (a,b,c,d, t) {
		var af = ((-t+2)*t-1)*t*0.5,
			bf = (((3*t-5)*t)*t+2)*0.5,
			cf = ((-3*t+4)*t+1)*t*0.5,
			df = ((t-1)*t*t)*0.5;
		return [
		  a[0]*af + b[0]*bf + c[0]*cf + d[0]*df,
		  a[1]*af + b[1]*bf + c[1]*cf + d[1]*df
		];
	},

	catmullRomAngle : function (a,b,c,d, t) {
		var dx = 0.5 * (c[0] - a[0] + 2*t*(2*a[0] - 5*b[0] + 4*c[0] - d[0]) +
				 3*t*t*(3*b[0] + d[0] - a[0] - 3*c[0]));
		var dy = 0.5 * (c[1] - a[1] + 2*t*(2*a[1] - 5*b[1] + 4*c[1] - d[1]) +
				 3*t*t*(3*b[1] + d[1] - a[1] - 3*c[1]));
		return Math.atan2(dy, dx);
	},

	catmullRomPointAngle : function (a,b,c,d, t) {
		var p = this.catmullRomPoint(a,b,c,d,t),
			A = this.catmullRomAngle(a,b,c,d,t);
		return {
			point:p, 
			angle:A
		};
	},

	lineAngle : function(a,b) {
		return Math.atan2(b[1]-a[1], b[0]-a[0]);
	},

	quadraticAngle : function(a,b,c,t) {
		var d = this.linePoint(a,b,t),
			e = this.linePoint(b,c,t);
		return this.lineAngle(d,e);
	},

	cubicAngle : function(a, b, c, d, t) {
		var e = this.quadraticPoint(a,b,c,t),
			f = this.quadraticPoint(b,c,d,t);
		return this.lineAngle(e,f);
	},

	lineLength : function(a,b) {
		var x = (b[0]-a[0]),
			y = (b[1]-a[1]);
		return Math.sqrt(x*x + y*y);
	},

	squareLineLength : function(a,b) {
		var x = (b[0]-a[0]),
			y = (b[1]-a[1]);
		return x*x + y*y;
	},

	quadraticLength : function(a,b,c, error) {
		var p1 = this.linePoint(a,b,2/3),
			p2 = this.linePoint(b,c,1/3);
		return this.cubicLength(a,p1,p2,c, error);
	},

	cubicLength : (function() {
		var bezsplit = function(v) {
			var vtemp = [v.slice(0)],
				left = [],
				right = [],
				i, 
				j;

			for (i = 1; i < 4; i++) {
				vtemp[i] = [[],[],[],[]];
				for (j = 0; j < 4-i; j++) {
					vtemp[i][j][0] = 0.5 * (vtemp[i-1][j][0] + vtemp[i-1][j+1][0]);
					vtemp[i][j][1] = 0.5 * (vtemp[i-1][j][1] + vtemp[i-1][j+1][1]);
				}
			}
			for (j = 0; j<4; j++) {
				left[j] = vtemp[j][0];
				right[j] = vtemp[3-j][j];
			}
			return [left, right];
		};

	    var addifclose = function(v, error) {
			var len = 0, chord, lr, i;
			for (i = 0; i < 3; i++) {
				len += Curves.lineLength(v[i], v[i+1]);
			}
			chord = Curves.lineLength(v[0], v[3]);
			if ((len - chord) > error) {
				lr = bezsplit(v);
				len = addifclose(lr[0], error) + addifclose(lr[1], error);
			}
			return len;
		};

		return function(a,b,c,d, error) {
			if (!error) {
				error = 1;
			}
			return addifclose([a,b,c,d], error);
		};
	}()),

	quadraticLengthPointAngle : function(a,b,c,lt,error) {
		var p1 = this.linePoint(a,b,2/3),
			p2 = this.linePoint(b,c,1/3);
		return this.cubicLengthPointAngle(a,p1,p2,c, error);
	},

	cubicLengthPointAngle : function(a,b,c,d,lt,error) {
		// this thing outright rapes the GC.
		// how about not creating a billion arrays, hmm?
		var len = this.cubicLength(a,b,c,d,error),
			point = a,
			prevpoint = a,
			lengths = [],
			prevlensum = 0,
			lensum = 0,
			tl = lt*len,
			segs = 20,
			fac = 1/segs,
			i;

	    for (i = 1; i<=segs; i++) { // FIXME get smarter
			prevpoint = point;
			point = this.cubicPoint(a,b,c,d, fac*i);
			prevlensum = lensum;
			lensum += this.lineLength(prevpoint, point);
			if (lensum >= tl) {
				if (lensum === prevlensum) {
					return {
						point: point, 
						angle: this.lineAngle(a,b)
					};
				}
				var dl = lensum - tl;
				var dt = dl / (lensum-prevlensum);
				return {
					point: this.linePoint(prevpoint, point, 1-dt),
					angle: this.cubicAngle(a,b,c,d, fac*(i-dt)) 
				};
			}
		}
		return {
			point: d.slice(0), 
			angle: this.lineAngle(c,d)
		};
	}
};


/**
Gradient is a linear or radial color gradient that can be used as a
strokeStyle or fillStyle.

Attributes:

type - Type of the gradient. 'linear' or 'radial'
startX, startY - Coordinates for the starting point of the gradient.
				 Center of the starting circle of a radial gradient.
				 Default is 0, 0.
endX, endY - Coordinates for the ending point of the gradient.
			 Center of the ending circle of a radial gradient.
			 Default is 0, 0.
startRadius - The radius of the starting circle of a radial gradient.
			  Default is 0.
endRadius - The radius of the ending circle of a radial gradient.
			Default is 100.
colorStops - The color stops for the gradient. The format for the color
			 stops is: [[position_1, color_1], [position_2, color_2], ...].
			 The possible color formats are: 'red', '#000', '#000000',
			 'rgba(0,0,0, 0.2)', [0,0,0] and [0,0,0, 0.2].
			 Default color stops are [[0, '#000000'], [1, '#FFFFFF']].

Example:

var g = new Gradient({
	type : 'radial',
	endRadius : 40,
	colorStops : [
		[0, '#000'],
		[0.2, '#ffffff'],
		[0.5, [255, 0, 0]],
		[0.8, [0, 255, 255, 0.5]],
		[1.0, 'rgba(255, 0, 255, 0.8)']
	]
})

@param config Optional config hash.
*/

var Gradient = klass({
	type: "linear",
	startX: 0,
	startY: 0,
	endX: 1,
	endY: 0,
	startRadius: 0,
	endRadius:1,
	colorStops: [],

	initialize: function (config) {
		this.colorStops = [[0, '#000000'], [1, '#ffffff']];
		if (config) {
			Object.extend(this, config);
		}
	},

	compile: function (ctx) {
		var go,
			cs,
			i;

		if (this.type === 'linear') {
			go = ctx.createLinearGradient(this.startX, this.startY, this.endX, this.endY);
		} else {
			go = ctx.createRadialGradient(this.startX, this.startY, this.startRadius, this.endX, this.endY, this.endRadius);
		}

		for (i = 0; i < this.colorStops.length; i++) {

			cs = this.colorStops[i];


			if (typeof(cs[1]) === 'string') {
				go.addColorStop(cs[0], cs[1]);

			} else {
				var ca = cs[1];
				var a = (ca.length === 3) ? 1 : ca[3];
				var g = 'rgba(' + ca.slice(0,3).map(Math.round).join(",") + ', ' + a + ')';
				go.addColorStop(cs[0], g); 
			}
		}
		return go;
	}
});



/**
Rectangle is used for creating rectangular paths.

Uses context.rect(...).

Attributes:
cx, cy, width, height, centered, rx, ry

If centered is set to true, centers the rectangle on the origin.
Otherwise the top-left corner of the rectangle is on the origin.

@param width Width of the rectangle.
@param height Height of the rectangle.
@param config Optional config hash.
*/
var Rectangle = klass({
	cx : 0,  // start corner X
	cy : 0,  // start corner Y
	x2 : 0,
	y2 : 0,
	width : 0,
	height : 0,
	rx : 0,
	ry : 0,
	centered : false,
	centerX: 0,
	centerY: 0, 

	initialize : function(width, height, config) {
		if (width !== null) {
			this.width = width;
			this.height = width;
		}
		if (height !== null) {
			this.height = height;
		}
		if (config) {
			Object.extend(this, config);
		}
	},

	/**
	Creates a rectangular path using ctx.rect(...).

	@param ctx Canvas drawing context.
	*/
	drawGeometry : function(ctx) {
		var x = this.cx;
		var y = this.cy;
		var w = (this.width || (this.x2 - x));
		var h = (this.height || (this.y2 - y));

		this.centerX = x + (0.5*w);
		this.centerY = y + (0.5*h);

		if (w === 0 || h === 0) {
			return;
		}

		if (this.centered) {
			x -= 0.5*w;
			y -= 0.5*h;
			this.centerX = this.cx;
			this.centerY = this.cy;
		}

		if (this.rx || this.ry) {
			var rx = Math.min(w * 0.5, this.rx || this.ry);
			var ry = Math.min(h * 0.5, this.ry || rx);
			var k = 0.5522847498;
			var krx = k*rx;
			var kry = k*ry;
			ctx.moveTo(x+rx, y);
			ctx.lineTo(x-rx+w, y);
			ctx.bezierCurveTo(x-rx+w + krx, y, x+w, y+ry-kry, x+w, y+ry);
			ctx.lineTo(x+w, y+h-ry);
			ctx.bezierCurveTo(x+w, y+h-ry+kry, x-rx+w+krx, y+h, x-rx+w, y+h);
			ctx.lineTo(x+rx, y+h);
			ctx.bezierCurveTo(x+rx-krx, y+h, x, y+h-ry+kry, x, y+h-ry);
			ctx.lineTo(x, y+ry);
			ctx.bezierCurveTo(x, y+ry-kry, x+rx-krx, y, x+rx, y);
			ctx.closePath();
		} else {
			if (w < 0) {
				x += w;
			}
			if (h < 0) {
				y += h;	
			} 
			ctx.rect(x, y, Math.abs(w), Math.abs(h));
		}
	},

	/**
	Returns true if the point x,y is inside this rectangle.

	The x,y point is in user-space coordinates, meaning that e.g. the point
	5,5 will always be inside the rectangle [0, 0, 10, 10], regardless of the
	transform on the rectangle.

	@param x X-coordinate of the point.
	@param y Y-coordinate of the point.
	@return Whether the point is inside this rectangle.
	@type boolean
	*/
	isPointInPath : function(x,y) {
		x -= this.cx;
		y -= this.cy;
		if (this.centered) {
			x += this.width/2;
			y += this.height/2;
		}
		return (x >= 0 && x <= this.width && y >= 0 && y <= this.height);
	},


	/**
	Returns the central point of rectangle
	*/
	getCentralPoint: function () {
		return {
			x: this.centerX,
			y: this.centerY
		};
	},

	getBoundingBox : function() {
		var x = this.cx;
		var y = this.cy;
		if (this.centered) {
			x -= this.width/2;
			y -= this.height/2;
		}
		return [x,y,this.width,this.height];
	}
});


/**
Circle is used for creating circular paths.

Uses context.arc(...).

Attributes:
cx, cy, radius, startAngle, endAngle, clockwise, closePath, includeCenter

@param radius Radius of the circle.
@param config Optional config hash.
*/
var Circle = klass({
	cx : 0,
	cy : 0,
	radius : 10,
	startAngle : 0,
	endAngle : Math.PI * 2,
	clockwise : false,
	closePath : true,
	includeCenter : false,

	initialize : function(radius, config) {
		if (radius !== null) {
			this.radius = radius;	
		} 
		if (config) {
			Object.extend(this, config);
		}
	},

	/**
	Creates a circular path using ctx.arc(...).

	@param ctx Canvas drawing context.
	*/
	drawGeometry : function(ctx) {
		if (this.radius === 0) {
			return;
		}
		
		if (this.includeCenter) {
			ctx.moveTo(this.cx, this.cy);
		}
			
		ctx.arc(this.cx, this.cy, this.radius, this.startAngle, this.endAngle, this.clockwise);
		if (this.closePath) {
			// firefox 2 is buggy without the endpoint
			var x2 = Math.cos(this.endAngle);
			var y2 = Math.sin(this.endAngle);
			ctx.moveTo(this.cx + x2*this.radius, this.cy + y2 * this.radius);
			ctx.closePath();
		}
	},

	/**
	Returns true if the point x,y is inside the radius of the circle.

	The x,y point is in user-space coordinates, meaning that e.g. the point
	5,0 will always be inside a circle with radius of 10 and center at origin,
	regardless of the transform on the circle.

	@param x X-coordinate of the point.
	@param y Y-coordinate of the point.
	@return Whether the point is inside the radius of this circle.
	@type boolean
	*/
	isPointInPath : function(x,y) {
		x -= this.cx;
		y -= this.cy;
		return (x*x + y*y) <= (this.radius*this.radius);
	},

	getBoundingBox : function() {
		return [this.cx-this.radius, this.cy-this.radius, 2*this.radius, 2*this.radius];
	}
});


/**
Ellipse is a scaled circle. Except it isn't. Because that wouldn't work in
Opera.
*/
var Ellipse = klass(Circle, {
	radiusX : 0,
	radiusY : 0,

	initialize : function(radiusX, radiusY, config) {
		this.radiusX = radiusX;
		this.radiusY = radiusY;
		Circle.initialize.call(this, 1, config);
	},

	drawGeometry : function(ctx) {
		if (this.radiusX === 0 || this.radiusY === 0) {
			return;
		}
		var k = 0.5522847498;
		var x = this.cx;
		var y = this.cy;
		var krx = k*this.radiusX;
		var kry = k*this.radiusY;
		ctx.moveTo(x+this.radiusX, y);
		ctx.bezierCurveTo(x+this.radiusX, y-kry, x+krx, y-this.radiusY, x, y-this.radiusY);
		ctx.bezierCurveTo(x-krx, y-this.radiusY, x-this.radiusX, y-kry, x-this.radiusX, y);
		ctx.bezierCurveTo(x-this.radiusX, y+kry, x-krx, y+this.radiusY, x, y+this.radiusY);
		ctx.bezierCurveTo(x+krx, y+this.radiusY, x+this.radiusX, y+kry, x+this.radiusX, y);
	},

	isPointInPath : function(x, y) {
		x -= this.cx;
		y -= this.cy;
		x /= this.radiusX;
		y /= this.radiusY;
		return (x*x + y*y) <= 1;
	},

	getBoundingBox : function() {
		return [this.cx-this.radiusX, this.cy-this.radiusY, this.radiusX*2, this.radiusY*2];
	}
});


/**
CatmullRomSpline draws a Catmull-Rom spline, with optional looping and
path closing. Handy for motion paths.

@param segments Control points for the spline, as [[x,y], [x,y], ...]
@param config Optional config hash.
*/
var CatmullRomSpline = klass({
	segments : [],
	loop : false,
	closePath : false,

	initialize : function(segments, config) {
		this.segments = segments;
		if (config) {
			Object.extend(this, config);
		}
	},

	drawGeometry : function(ctx) {
		var x1 = this.currentMatrix[0],
			x2 = this.currentMatrix[1],
			y1 = this.currentMatrix[2],
			y2 = this.currentMatrix[3],
			xs = x1*x1 + x2*x2,
			ys = y1*y1 + y2*y2,
			s = Math.floor(Math.sqrt(Math.max(xs, ys))),
			i,
			cmp = this.compiled;

		if (!cmp || cmp.scale !== s) {
			cmp = this.compile(s);
		}
		for (i = 0; i<cmp.length; i++) {
			var cmd = cmp[i];
			ctx[cmd[0]].apply(ctx, cmd[1]);
		}
		if (this.closePath) {
			ctx.closePath();
		}
	},

	compile : function(scale) {
		var compiled = [];

		if (!scale) {
			scale = 1;
		}

		if (this.segments && this.segments.length >= (this.loop ? 1 : 4)) {
			var segs = this.segments,
				j,
				i;

			if (this.loop) {
				segs = segs.slice(0);
				segs.unshift(segs[segs.length-1]);
				segs.push(segs[1]);
				segs.push(segs[2]);
			}
			// FIXME don't be stupid
			var point_spacing = 1 / (15 * (scale+0.5));
			var a,b,c,d,p,pp;
			compiled.push(['moveTo', segs[1].slice(0)]);
			p = segs[1];
			for (j = 1; j<segs.length-2; j++) {
				a = segs[j-1];
				b = segs[j];
				c = segs[j+1];
				d = segs[j+2];
				for ( i = 0; i<1; i+=point_spacing) {
					pp = p;
					p = Curves.catmullRomPoint(a,b,c,d,i);
					compiled.push(['lineTo', p]);
				}
			}
			p = Curves.catmullRomPoint(a,b,c,d,1);
			compiled.push(['lineTo', p]);
		}
		compiled.scale = scale;
		this.compiled = compiled;
		return compiled;
	},

	getBoundingBox : function() {
		var minX = Infinity, 
			minY = Infinity, 
			maxX = -Infinity, 
			maxY = -Infinity,
			// segments = (this.compiled ? this.compiled : this.compile());
			segments = this.compiled || this.compile(),
			i,
			j;

		for (i = 0; i<segments.length; i++) {
			var seg = segments[i][1];
			for (j = 0; j<seg.length; j+=2) {
				var x = seg[j], y = seg[j+1];
				if (x < minX) {
					minX = x;
				}
				if (x > maxX) {
					maxX = x;
				}
				if (y < minY) {
					minY = y;
				}
				if (y > maxY) {
					maxY = y;
				}
			}
		}
		return [minX, minY, maxX-minX, maxY-minY];
	},

	pointAt : function(t) {
		if (!this.segments) {
			return [0,0];
		}

		if (this.segments.length >= (this.loop ? 1 : 4)) {
			var segs = this.segments;
			if (this.loop) {
				segs = segs.slice(0);
				segs.unshift(segs[segs.length-1]);
				segs.push(segs[1]);
				segs.push(segs[2]);
			}
			// turn t into segment_index.segment_t
			var rt = t * (segs.length - 3),
				j = Math.floor(rt),
				st = rt-j,
				a = segs[j],
				b = segs[j+1],
				c = segs[j+2],
				d = segs[j+3];
			return Curves.catmullRomPoint(a,b,c,d,st);
		}
		return this.segments[0];
		
	},

	pointAngleAt : function(t) {
		if (!this.segments) {
			return {
				point: [0,0], 
				angle: 0
			};
		}
		if (this.segments.length >= (this.loop ? 1 : 4)) {
			var segs = this.segments;
			if (this.loop) {
				segs = segs.slice(0);
				segs.unshift(segs[segs.length-1]);
				segs.push(segs[1]);
				segs.push(segs[2]);
			}
			// turn t into segment_index.segment_t
			var rt = t * (segs.length - 3),
				j = Math.floor(rt),
				st = rt-j,
				a = segs[j],
				b = segs[j+1],
				c = segs[j+2],
				d = segs[j+3];
			return Curves.catmullRomPointAngle(a,b,c,d,st);
		}
		return {
			point: this.segments[0] || [0,0], 
			angle: 0
		};
		
	}
});