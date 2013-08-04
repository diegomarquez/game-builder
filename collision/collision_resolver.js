define(['sat'], function(SAT) {
	var CollisionResolver = function() {
		this.collisionLists = {};
		this.toCollideCache = {};
	};

	CollisionResolver.prototype.addToCollisionList = function(collision_component) {
		var indexes = this.toCollideCache[collision_component.collisionId];

		if (indexes != null && indexes.length > 0) {
			for (var i = 0; i < indexes.length; i++) {
				this.collisionLists[indexes[i]].push(collision_component);
			}
		}
	};

	CollisionResolver.prototype.removeFromCollisionList = function(collision_component) {
		var indexes = this.toCollideCache[collision_component.collisionId];

		if (indexes != null && indexes.length > 0) {
			for (m = indexes.length - 1; m >= 0; m--) {
				this.collisionLists[indexes[m]].splice(this.collisionLists[indexes[m]].indexOf(collision_component), 1);
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
		var firstColliderType = first.colliderType;
		var secondColliderType = second.colliderType;

		var first = first.getCollider();
		var second = second.getCollider();

		if (first == null || second == null) {
			return false;
		}

		//TODO: Revisar esto
		if (firstColliderType == secondColliderType) {
			if (firstColliderType == GameObject.CIRCLE_COLLIDER) {
				return SAT.testCircleCircle(first, second);
			}
			if (firstColliderType == GameObject.POLYGON_COLLIDER) {
				return SAT.testPolygonPolygon(first, second);
			}
		} else {
			if (firstColliderType == GameObject.CIRCLE_COLLIDER) {
				return SAT.testPolygonCircle(second, first);
			}
			if (firstColliderType == GameObject.POLYGON_COLLIDER) {
				return SAT.testPolygonCircle(first, second);
			}
		}

		return false;
	}

	return new CollisionResolver();
});