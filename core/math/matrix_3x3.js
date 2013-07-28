define(function() {
	var Matrix_3x3 = function(a, b, c, d, tx, ty) {
		this.initialize(a, b, c, d, tx, ty);
	};

	var p = Matrix_3x3.prototype;

	Matrix_3x3.DEG_TO_RAD = Math.PI / 180;

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
			var r = rotation * Matrix_3x3.DEG_TO_RAD;
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
			var r = rotation * Matrix_3x3.DEG_TO_RAD;
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
			target.rotation = skewY / Matrix_3x3.DEG_TO_RAD;
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
		return new Matrix_3x3(this.a, this.b, this.c, this.d, this.tx, this.ty);
	};

	return Matrix_3x3
});