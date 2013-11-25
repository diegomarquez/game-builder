define(function() {
	var Vector_2D = function(x, y) {
		this['x'] = this.x = x || 0;
		this['y'] = this.y = y || 0;
	}

	Vector_2D.prototype.copy = function(other) {
		this.x = other.x;
		this.y = other.y;
		return this;
	};

	Vector_2D.prototype.perp = function() {
		var x = this.x;
		this.x = this.y;
		this.y = -x;
		return this;
	};

	Vector_2D.prototype.reverse = function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	};

	Vector_2D.prototype.normalize = function() {
		var d = this.len();
		if (d > 0) {
			this.x = this.x / d;
			this.y = this.y / d;
		}
		return this;
	};

	Vector_2D.prototype.add = function(other) {
		this.x += other.x;
		this.y += other.y;
		return this;
	};

	Vector_2D.prototype.sub = function(other) {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	};

	Vector_2D.prototype.scale = function(x, y) {
		this.x *= x;
		this.y *= y || x;
		return this;
	};

	Vector_2D.prototype.project = function(other) {
		var amt = this.dot(other) / other.len2();
		this.x = amt * other.x;
		this.y = amt * other.y;
		return this;
	};

	Vector_2D.prototype.projectN = function(other) {
		var amt = this.dot(other);
		this.x = amt * other.x;
		this.y = amt * other.y;
		return this;
	};

	Vector_2D.prototype.reflect = function(axis) {
		var x = this.x;
		var y = this.y;
		this.project(axis).scale(2);
		this.x -= x;
		this.y -= y;
		return this;
	};

	Vector_2D.prototype.reflectN = function(axis) {
		var x = this.x;
		var y = this.y;
		this.projectN(axis).scale(2);
		this.x -= x;
		this.y -= y;
		return this;
	};

	Vector_2D.prototype.dot = function(other) {
		return this.x * other.x + this.y * other.y;
	};

	Vector_2D.prototype.len2 = function() {
		return this.dot(this);
	};

	Vector_2D.prototype.len = function() {
		return Math.sqrt(this.len2());
	};

	return Vector_2D
});