/**
 * # collision-resolver.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [sat](@@sat@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This organizes the colliders into pairs of groups. The first collection of each pair, is tested against
 * the second collection for collisions. There isn't much more to it.
 *
 * Worth noting is that the module only checks for overlaps, there is no projection. For the type
 * of projects [Game-Builder](http://diegomarquez.github.io/game-builder) attempts to tackle, it should
 * be more than enough. 
 *
 * Also important is the fact there is no 
 * [broad-phase](http://www.htmlgoodies.com/html5/client/broad-phase-collision-detection-using-spatial-partitioning.html#fbid=fsD5-BRjvS-) 
 * of any kind in this collision detection system.
 * Again this shouldn't be too much of a problem for simple stuff. 
 * 
 * You could always implement a better collision system if you know how to,
 * as all things regarding collision detection are not coupled in anyway to the core of [Game-Builder](http://diegomarquez.github.io/game-builder)
 * But I think that for prototypes is largely unnecessary.
 */

/**
 * Resolve collisions
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['sat'], function(SAT) {
	var CollisionResolver = function() {
		this.collisionLists = {};
		this.toCollideCache = {};
	};

	/**
	 * <p style='color:#AD071D'><strong>addToCollisionList</strong> Adds a component to a collision list.</p>
	 *
	 * The component is added to the correponding lists, depending on it's collision id.
	 * 
	 * @param {[collision-component](@@collision-component@@)} collisionComponent An object extending [collision-component](@@collision-component@@)
	 * @return {null}
	 */
	CollisionResolver.prototype.addToCollisionList = function(collisionComponent) {
		var indexes = this.toCollideCache[collisionComponent.collisionId];

		if (indexes != null && indexes.length > 0) {
			for (var i = 0; i < indexes.length; i++) {
				this.collisionLists[indexes[i]].push(collisionComponent);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>removeFromCollisionList</strong> Removes a component from a collision list.</p>
	 *
	 * The component is removed from the corresponding lists, depending on it's collision id.
	 * 
	 * @param {[collision-component](@@collision-component@@)} collisionComponent An object extending [collision-component](@@collision-component@@)
	 * @return {null}
	 */
	CollisionResolver.prototype.removeFromCollisionList = function(collisionComponent) {
		var indexes = this.toCollideCache[collisionComponent.collisionId];

		if (indexes != null && indexes.length > 0) {
			for (m = indexes.length - 1; m >= 0; m--) {
				this.collisionLists[indexes[m]].splice(this.collisionLists[indexes[m]].indexOf(collisionComponent), 1);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>addCollisionPair</strong> Use this method to setup collision pairs.</p>
	 * @param {String} first  The collidionId of the first group in the pair
	 * @param {String} second The collidionId of the first group in the pair
	 */
	CollisionResolver.prototype.addCollisionPair = function(first, second) {
		if (this.collisionLists[first] == null) {
			this.collisionLists[first] = [];
		}

		if (this.toCollideCache[second] == null) {
			this.toCollideCache[second] = [];
		}

		this.toCollideCache[second].push(first);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>areColliding</strong> This is the actual method that does the magic.</p>
	 *
	 * This method will make the appropiate tests according to the type of the colliders involved.
	 * 
	 * @param  {[collider-component](@@collider-component@@)} first  The first collider in the test
	 * @param  {[collider-component](@@collider-component@@)} second The second collider in the test
	 * @return {Boolean} Whether there was a collision or not.
	 */
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

	// These variables are used by the concrete implementations of colliders to decide what
	// type of collider they are, and hence, which method should be used when checking for collisions
	// on them.
	CollisionResolver.prototype.circleCollider  = 0;
	CollisionResolver.prototype.polygonCollider = 1;

	return new CollisionResolver();
});