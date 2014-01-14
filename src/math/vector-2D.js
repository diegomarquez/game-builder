/**
 * # vector-2D.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *  
 * Another module made of [stolen code](https://github.com/jriecken/sat-js)!
 * In the original you can see that the [sat](@@sat@@) and this module where originally
 * a single file, but I though It woulf be a good idea to make a standalone module
 * out of the Vector implementation, as it is a very usefull thing to have laying around.
 * 
 * The code does basically the same thing, define a 2d vector with x and y coordinates,
 * and several methods to apply different transformations to those coordinates.
 */

define(function() {
	var vector_2D = function(x, y) {
		this['x'] = this.x = x || 0;
		this['y'] = this.y = y || 0;
	}

	vector_2D.prototype.copy = function(other) {
		this.x = other.x;
		this.y = other.y;
		return this;
	};

	vector_2D.prototype.perp = function() {
		var x = this.x;
		this.x = this.y;
		this.y = -x;
		return this;
	};

	vector_2D.prototype.reverse = function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	};

	vector_2D.prototype.normalize = function() {
		var d = this.len();
		if (d > 0) {
			this.x = this.x / d;
			this.y = this.y / d;
		}
		return this;
	};

	vector_2D.prototype.add = function(other) {
		this.x += other.x;
		this.y += other.y;
		return this;
	};

	vector_2D.prototype.sub = function(other) {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	};

	vector_2D.prototype.scale = function(x, y) {
		this.x *= x;
		this.y *= y || x;
		return this;
	};

	vector_2D.prototype.project = function(other) {
		var amt = this.dot(other) / other.len2();
		this.x = amt * other.x;
		this.y = amt * other.y;
		return this;
	};

	vector_2D.prototype.projectN = function(other) {
		var amt = this.dot(other);
		this.x = amt * other.x;
		this.y = amt * other.y;
		return this;
	};

	vector_2D.prototype.reflect = function(axis) {
		var x = this.x;
		var y = this.y;
		this.project(axis).scale(2);
		this.x -= x;
		this.y -= y;
		return this;
	};

	vector_2D.prototype.reflectN = function(axis) {
		var x = this.x;
		var y = this.y;
		this.projectN(axis).scale(2);
		this.x -= x;
		this.y -= y;
		return this;
	};

	vector_2D.prototype.dot = function(other) {
		return this.x * other.x + this.y * other.y;
	};

	vector_2D.prototype.len2 = function() {
		return this.dot(this);
	};

	vector_2D.prototype.len = function() {
		return Math.sqrt(this.len2());
	};

	return vector_2D
});