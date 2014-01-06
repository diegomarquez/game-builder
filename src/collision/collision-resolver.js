define(['sat'], function(SAT) {
	var CollisionResolver = function() {
		this.collisionLists = {};
		this.toCollideCache = {};
	};

	CollisionResolver.prototype.addToCollisionList = function(collisionComponent) {
		var indexes = this.toCollideCache[collisionComponent.collisionId];

		if (indexes != null && indexes.length > 0) {
			for (var i = 0; i < indexes.length; i++) {
				this.collisionLists[indexes[i]].push(collisionComponent);
			}
		}
	};

	CollisionResolver.prototype.removeFromCollisionList = function(collisionComponent) {
		var indexes = this.toCollideCache[collisionComponent.collisionId];

		if (indexes != null && indexes.length > 0) {
			for (m = indexes.length - 1; m >= 0; m--) {
				this.collisionLists[indexes[m]].splice(this.collisionLists[indexes[m]].indexOf(collisionComponent), 1);
			}
		}
	};

	CollisionResolver.prototype.addCollisionPair = function(first, second) {
		if (this.collisionLists[first] == null) {
			this.collisionLists[first] = [];
		}

		if (this.toCollideCache[second] == null) {
			this.toCollideCache[second] = [];
		}

		this.toCollideCache[second].push(first);
	};

	CollisionResolver.prototype.areColliding = function(first, second) {
		if (first.collider == null || second.collider == null) {
			return false;
		}

		if (first.colliderType == second.colliderType) {
			if (first.colliderType == this.circleCollider) {
				return SAT.testCircleCircle(first.collider, second.collider);
			}
			if (first.colliderType == this.polygonCollider) {
				return SAT.testPolygonPolygon(first.collider, second.collider);
			}
		} else {
			if (first.colliderType == this.circleCollider) {
				return SAT.testPolygonCircle(second.collider, first.collider);
			}
			if (first.colliderType == this.polygonCollider) {
				return SAT.testPolygonCircle(first.collider, second.collider);
			}
		}

		return false;
	}

	CollisionResolver.prototype.circleCollider  = 0;
	CollisionResolver.prototype.polygonCollider = 1;

	return new CollisionResolver();
});