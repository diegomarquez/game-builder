/**
 * # circle-collider.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [collision-component](@@collision-component@@)
 *
 * Depends of:
 * [sat](@@sat@@)
 * [collision-resolver](@@collision-resolver@@)
 * [vector-2D](@@vector-2D@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a component meant to be attached to a [game-object](@@game-object@@), to give it
 * the ability to collide against other [game-objects](@@game-object@@) with collider components.
 *
 * Since this is a circle collider there is not much about it, other than a radius. Other than
 * that it follows it's [game-object](@@game-object@@) parent around.
 *
 * During the configuration of the [component-pool](@@component-pool@@) circle colliders need to
 * receive an object that looks similar to the following:
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Circle_1", 'Circle')
	.args({
		//Id used by the Collision Resolver
		id:'circle-collider_ID',

		//Radius of the collider
		radius:10
 * });
 * ```
 * If it is not provided it will most likely fail in un-expected ways.
 *
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module.
 * The way you get a hold to a reference to the <a href=@@component-pool@@>component-pool</a>
 * may vary.</strong>
 */

/**
 * Circles colliding
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['collision-component', 'sat', 'collision-resolver', 'vector-2D'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D) {

		var CircleCollider = CollisionComponent.extend({
			init: function() {
				this._super();

				this.p = new Vector2D();

				this.collider = new SAT.Circle(new Vector2D(0, 0), this.radius);
				this.colliderType = CollisionResolver.circleCollider;
			},

			/**
			 * <p style='color:#AD071D'><strong>start</strong></p>
			 *
			 * Set up the collider.
			 *
			 * Creates a Circle object defined in the [sat](@@sat@@) module.
			 */
			start: function() {
				this._super();

				this.collider.pos.x = 0;
				this.collider.pos.y = 0;
				this.collider.r = this.radius;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>update</strong></p>
			 *
			 * Updates the position of the collider.
			 *
			 * The collider follows the position of it's parent.
			 */
			update: function() {
				var p = this.parent.matrix.transformPoint(0, 0, this.p);

				this.collider.pos.x = p.x;
				this.collider.pos.y = p.y;

				this._super();
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
			 *
			 * Draw the circle collider.
			 *
			 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
			 * @param {Object} viewport A reference to the current [viewport](@@viewport@@)
			 * @param {Object} draw A reference to the [draw](@@draw@@) module
			 * @param {Object} gb A reference to the [gb](@@gb@@) module
			 */
			debug_draw: function(context, viewport, draw, gb) {
				if (!gb.colliderDebug) return;

				var p = this.parent.matrix.transformPoint(0, 0, this.p);
				draw.circle(context, p.x, p.y, this.collider.r, null, this.debugColor, 2);
				this._super();
			}
			/**
			 * --------------------------------
			 */
		});

		return CircleCollider;
	});
