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
 * [draw](@@draw@@)
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
define(['collision-component', 'sat', 'collision-resolver', 'vector-2D', 'draw'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D, draw){

	var p = {};
	var m = null;
	
	var Component = CollisionComponent.extend({
		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Set up the collider.
		 * 
		 * Creates a Circle object defined in the [sat](@@sat@@) module.
		 */
		start: function() {
			this._super();

			this.collider 	  = new SAT.Circle(new Vector2D(0, 0), this.radius);
			this.colliderType = CollisionResolver.circleCollider;
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
			this.parent.getTransform(p, m);

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
		 * This method is only executed if the **debug** property of the parent [game-object](@@game-object@@)
		 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
		 * 
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 */
		debug_draw: function(context) {
			this.parent.getTransform(p, m);

			context.save();
			context.setTransform(1, 0, 0, 1, 0, 0);			
			context.translate(p.x, p.y);

			draw.circle(context, 0, 0, this.radius, null, this.debugColor, 2);

			context.restore();

			this._super();
		} 
		/**
		 * --------------------------------
		 */

	});

	return Component;
});