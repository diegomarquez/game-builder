/**
 * # polygon-collider.js
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
 * the ability to collide against other [game-object](@@game-object@@) with collider components.
 *
 * Fixed Polygon colliders are just like a [polygon-collider](@@polygon-collider@@), the 
 * difference is that they do no follow their parents along all the transformations, only translation.
 *
 * This make them considerably less expensive, but also less accurate. 
 * Often you can do without the precision.
 *
 * During the configuration of the [component-pool](@@component-pool@@) fixed polygon colliders need to 
 * receive an object that looks similar to the following:
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Fixed_Polygon", 'Fixed_Polygon_1')
	.args({
		//Id used by the Collision Resolver
		id:'fixed-polygon-collider_ID', 
		
		//Array of points that define the polygon collider
		points:[ 
			new vector_2D(-10, -10), 
			new vector_2D(10, -10), 
			new vector_2D(10, 10), 
			new vector_2D(-10, 10) 
		]
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
 * Polygons colliding
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['collision-component', 'sat', 'collision-resolver', 'vector-2D', 'draw'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D, Draw) {

		var p = {};
		var m = null;

		var Component = CollisionComponent.extend({
			/**
			 * <p style='color:#AD071D'><strong>start</strong></p>
			 *
			 * Set up the collider.
			 * 
			 * Creates a FixedSizePolygon object defined in the [sat](@@sat@@) module.
			 * The polygon is said to be fixed of size becuase no more vertexes can be
			 * added to it after it is created.
			 */
			start: function() {
				this._super();

				this.pointCount = this.points.length;
				this.pointsCopy = JSON.parse(JSON.stringify(this.points));

				this.collider = new SAT.FixedSizePolygon(new Vector2D(0, 0), this.points);
				this.colliderType = CollisionResolver.polygonCollider;
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
			 * Draw the fixed polygon collider
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

				Draw.polygon(context, 0, 0, this.pointsCopy, null, this.debugColor, 2);
				context.restore();

				this._super();
			}
			/**
			 * --------------------------------
			 */
		});

		return Component;
	}
);