/**
 * # collision-component.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [component](@@component@@)
 *
 * Depends of:
 * [collision-resolver](@@collision-resolver@@)
 * [error-printer](@@error-printer@@)
 * [game-object](@@game-object@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * All colliders extend the object defined in this module. It's main responsibility
 * is checking if it is colliding against any of the objects the [collision-resolver](@@collision-resolver@@)
 * is saying it should collide against.
 *
 * When setting up the [component-pool](@@component-pool@@) with collider components, be sure
 * to checkout the documentation for [circle-collider](@@circle-collider@@), [polygon-collider](@@polygon-collider@@)
 * and [fixed-polygon-collider](@@fixed-polygon-collider@@) to see what kind of object they expect as an argument
 * to be properly configured.
 */

/**
 * Collisions
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['component', 'collision-resolver', 'error-printer', 'game-object'], function(Component, CollisionResolver, ErrorPrinter, GameObject) {

	var CollisionComponent = Component.extend({
		init: function() {
			this._super();

			this.collisionResolver = CollisionResolver;
			this.onCollideArguments = [null, null];
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Setup the component.
		 *
		 * The main thing here is that the component
		 * adds itself to the [collision-resolver](@@collision-resolver@@)
		 *
		 * @throws {Error} If the parent of the component does not define an **onCollide** method
		 */
		start: function() {
			this.debugColor = "#00FF00";

			this.checkingCollisions = true;

			this.collisionResolver.addToCollisionList(this);

			if (!this.parent.onCollide) {
				ErrorPrinter.printError('Collision Component', "GameObject with typeId: " + this.parent.typeId + ", needs to define an onCollide method, yo.");
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Here is where the magic happens.
		 *
		 * The [collision-resolver](@@collision-resolver@@) will test this collider against
		 * all other registered colliders that are supposed to collide against it. If there is a collision
		 * A bunch of callbacks will be executed notifying the objects involved.
		 */
		update: function() {
			var collisionList = this.collisionResolver.collisionLists[this.id];

			if (collisionList != null) {
				for (k = 0; k < collisionList.length; k++) {
					var collisionOpponent = collisionList[k];

					if (!collisionOpponent.checkingCollisions) continue;

					if (this.collisionResolver.areColliding(this, collisionOpponent)) {
						if (!this.checkingCollisions) break;

						var response, invertedResponse;

						if (collisionOpponent.getResponse || this.getResponse) {
							response = this.collisionResolver.getLastResponse();
							invertedResponse = this.collisionResolver.getLastInvertedResponse();
						} else {
							response = null;
							invertedResponse = null;
						}

						if (collisionOpponent.parent && this.parent) {
							this.onCollide(collisionOpponent, response);

							if (collisionOpponent.parent && this.parent) {
								this.onCollideArguments[0] = collisionOpponent.parent;
								this.onCollideArguments[1] = response;

								this.parent.execute('collide', this.onCollideArguments, 'apply');
							}

							if (collisionOpponent.parent && this.parent) {
								this.parent.onCollide(collisionOpponent.parent, response);
							}
						}

						if (!this.checkingCollisions) break;

						if (collisionOpponent.parent && this.parent) {
							collisionOpponent.onCollide(this, invertedResponse);

							if (collisionOpponent.parent && this.parent) {
								this.onCollideArguments[0] = this.parent;
								this.onCollideArguments[1] = invertedResponse;

								collisionOpponent.parent.execute('collide', this.onCollideArguments, 'apply');
							}

							if (collisionOpponent.parent && this.parent) {
								collisionOpponent.parent.onCollide(this.parent, invertedResponse);
							}
						}
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>onCollide</strong></p>
		 *
		 * This will be executed if there is a collision.
		 *
		 * @param {Object} other The other [game-object](@@game-object@@) involved in the collision.
		 */
		onCollide: function(other) {
			this.debugColor = "#FF0000";
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Asides from resetting some properties the component removes itself
		 * from the [collision-resolver](@@collision-resolver@@)
		 *
		 * @param {Object} parent [game-object](@@game-object@@) using this component
		 */
		removed: function(parent) {
			this.checkingCollisions = false;
			this.collisionResolver.removeFromCollisionList(this);
		},

		/**
		 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
		 *
		 * This is redifined by objects extending this one.
		 */
		debug_draw: function() {
			this.debugColor = "#00FF00";
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>enable</strong></p>
		 *
		 * An enabled component will execute it's update logic
		 */
		enable: function() {
			this._super();
			this.checkingCollisions = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>disable</strong></p>
		 *
		 * A disabled component will not execute it's update logic
		 */
		disable: function() {
			this._super();
			this.checkingCollisions = false;
		},
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(GameObject.prototype, "COLLIDE", {
		get: function() {
			return 'collide';
		}
	});

	return CollisionComponent;
});
