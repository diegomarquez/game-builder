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
define(['component', 'collision-resolver', 'error-printer'], function(Component, CollisionResolver, ErrorPrinter) {

	var collisionList = null;
	var collisionOpponent = null;

	var CollisionComponent = Component.extend({
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

			CollisionResolver.addToCollisionList(this);

			if(!this.parent.onCollide) {
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
			collisionList = CollisionResolver.collisionLists[this.id];

			if (collisionList != null) {
				for (k = 0; k < collisionList.length; k++) {
					collisionOpponent = collisionList[k];

					if (!collisionOpponent.checkingCollisions) break;

					if (CollisionResolver.areColliding(this, collisionOpponent)) {
						if (!this.checkingCollisions) break;
		
						this.onCollide(collisionOpponent)
						this.parent.onCollide(collisionOpponent.parent);
						this.parent.execute('collide', collisionOpponent.parent);

						if (!this.checkingCollisions) break;

						collisionOpponent.onCollide(this);
						collisionOpponent.parent.onCollide(this.parent);
						collisionOpponent.parent.execute('collide', this.parent);
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
		 * @param  {Object} other The other [game-object](@@game-object@@) involved in the collision.
		 */
		onCollide: function(other) {
			this.debugColor = "#FF0000";
		},
		/**
		 * --------------------------------
		 */

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
		 * <p style='color:#AD071D'><strong>destroy</strong></p>
		 *
		 * Destroys the component.
		 * 
		 * Asides from resetting some properties the component removes itself
		 * from the [collision-resolver](@@collision-resolver@@)
		 */
		destroy: function() {
			this._super();

			this.checkingCollisions = false;

			CollisionResolver.removeFromCollisionList(this);
		}
		/**
		 * --------------------------------
		 */
	});

	return CollisionComponent;
});