function CircleCollider() {}

CircleCollider.prototype.create = function(){
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 0);

	this.constructor.prototype.getColliderType = function(){
		return GameObject.CIRCLE_COLLIDER;
	}

	this.constructor.prototype.getCollider = function(){
		this.collider.pos.x = this.x + this.centerX;
		this.collider.pos.y = this.y + this.centerY;
		return this.collider;
	}
}

CircleCollider.prototype.init = function(radius){
	this.collider.r = radius;
}

function BoxCollider() {}

BoxCollider.prototype.create = function(){
	this.collider = new SAT.Box(new SAT.Vector(0,0), 0, 0);

	this.constructor.prototype.getColliderType = function(){
		return GameObject.POLYGON_COLLIDER;
	}

	this.constructor.prototype.getCollider = function(){
		this.collider.pos.x = this.x + this.centerX;
		this.collider.pos.y = this.y + this.centerY;

		return this.collider.toPolygon();
	}
}

BoxCollider.prototype.init = function(width, height){
	this.collider.w = width;
	this.collider.h = height;
}

function PolyCollider() {}

PolyCollider.prototype.create = function(points){
	this.collider = new SAT.Polygon(new SAT.Vector(), points);

	this.constructor.prototype.getColliderType = function(){
		return GameObject.POLYGON_COLLIDER;
	}

	this.constructor.prototype.getCollider = function(){
		this.collider.pos.x = this.x + this.centerX;
		this.collider.pos.y = this.y + this.centerY;

		return this.collider;
	}
}