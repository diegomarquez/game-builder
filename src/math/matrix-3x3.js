/**
 * # matrix-3x3.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * Similar [sat](@@sat@@) and [vector-2D](@@vector-2D@@) 
 * in that I took the code from somewhere else to make a requireJS module with it.
 * In this case the victim was [EaselJS](https://github.com/CreateJS/EaselJS/). Somewhere
 * in there is a javascript file that desribes a 3x3 matrix. Instead of implementing it myself,
 * I took the cowards way out and took that code and changed it to suit my needs.
 *
 * Anyway, this module is very important for everything that has to do with rendering,
 * because matrix transformations are used to each [game-object](@@game-object@@) 
 * to apply a transformation to the context 2D property 
 * of the [Canvas](http://www.w3schools.com/html/html5_canvas.asp)
 * modifying it's position and that of all sub-sequent rendering commands.
 *
 * If you want to know what all this methods do, you are better off going to the original code,
 * or better yet, reading up on 
 * [Matrix Transformations](https://www.google.co.uk/search?q=Matrix+Affine+Transformations&oq=Matrix+Affine+Transformations&aqs=chrome..69i57j0l3.6454j0j7&sourceid=chrome&espv=210&es_sm=91&ie=UTF-8)
 */

/**
 * Transformations
 * --------------------------------
 */

define(function() {
	var matrix_3x3 = function(a, b, c, d, tx, ty) {
		this.initialize(a, b, c, d, tx, ty);
	};

	var p = matrix_3x3.prototype;

	matrix_3x3.DEG_TO_RAD = Math.PI / 180;

	p.a = 1;
	p.b = 0;
	p.c = 0;
	p.d = 1;
	p.tx = 0;
	p.ty = 0;

	p.initialize = function(a, b, c, d, tx, ty) {
		if (a != null) {
			this.a = a;
		}
		this.b = b || 0;
		this.c = c || 0;
		if (d != null) {
			this.d = d;
		}
		this.tx = tx || 0;
		this.ty = ty || 0;
		return this;
	};

	p.prepend = function(a, b, c, d, tx, ty) {
		var tx1 = this.tx;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			var a1 = this.a;
			var c1 = this.c;
			this.a = a1 * a + this.b * c;
			this.b = a1 * b + this.b * d;
			this.c = c1 * a + this.d * c;
			this.d = c1 * b + this.d * d;
		}
		this.tx = tx1 * a + this.ty * c + tx;
		this.ty = tx1 * b + this.ty * d + ty;
		return this;
	};

	p.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;

		this.a = a * a1 + b * c1;
		this.b = a * b1 + b * d1;
		this.c = c * a1 + d * c1;
		this.d = c * b1 + d * d1;
		this.tx = tx * a1 + ty * c1 + this.tx;
		this.ty = tx * b1 + ty * d1 + this.ty;
		return this;
	};

	p.prependTransform = function(x, y, scaleX, scaleY, rotation, regX, regY) {
		if (rotation % 360) {
			var r = rotation * matrix_3x3.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			this.tx -= regX;
			this.ty -= regY;
		}

		this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);

		return this;
	};

	p.appendTransform = function(x, y, scaleX, scaleY, rotation, regX, regY) {
		if (rotation % 360) {
			var r = rotation * matrix_3x3.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);

		if (regX || regY) {
			this.tx -= regX * this.a + regY * this.c;
			this.ty -= regX * this.b + regY * this.d;
		}
		return this;
	};

	p.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a = a1 * cos - this.b * sin;
		this.b = a1 * sin + this.b * cos;
		this.c = c1 * cos - this.d * sin;
		this.d = c1 * sin + this.d * cos;
		this.tx = tx1 * cos - this.ty * sin;
		this.ty = tx1 * sin + this.ty * cos;
		return this;
	};

	p.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.c *= x;
		this.b *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	};

	p.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
		return this;
	};

	p.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	};

	p.decompose = function(target) {
		if (target == null) {
			target = {};
		}
	
		target.x = this.tx;
		target.y = this.ty;
		
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		if (skewX == skewY) {
			target.rotation = skewY / matrix_3x3.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
		}

		return target;
	};

	p.transformPoint = function(x, y, pt) {
		pt = pt || {};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	};

	p.clone = function() {
		return new matrix_3x3(this.a, this.b, this.c, this.d, this.tx, this.ty);
	};

	return matrix_3x3
});