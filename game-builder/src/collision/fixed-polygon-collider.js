/**
 * # polygon-collider.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [collision-component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/collision-component.html)
 *
 * Depends of: 
 * [sat](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/sat.html)
 * [collision-resolver](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/collision-resolver.html)
 * [vector-2D](http://diegomarquez.github.io/game-builder/game-builder-docs/src/math/vector-2D.html)
 * [draw](http://diegomarquez.github.io/game-builder/game-builder-docs/src/draw.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines a component mean to be attached to a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html), to give it
 * the ability to collide against other [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) with collider components.
 *
 * Fixed Polygon colliders are just like a [polygon-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/polygon-collider.html), the 
 * difference is that they do no follow their parents along all the transformations, only translation.
 *
 * This make them considerably less expensive, but also less accurate. 
 * Often you can do without the precision.
 *
 * During the configuration of the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html) fixed polygon colliders need to 
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
 * If it is not provided it will most likely fail in un expected ways.
 * 
 * <strong>Note: The snippet uses the reference to the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html>component-pool</a>
 * found in the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html>gb</a> module. 
 * The way you get a hold to a reference to the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html>component-pool</a> 
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
	function(CollisionComponent, SAT, CollisionResolver, Vector2D, draw) {

		var p = {};
		var m = null;

		var Component = CollisionComponent.extend({
			/**
			 * <p style='color:#AD071D'><strong>start</strong> Set up the collider.</p>
			 *
			 * Creates a FixedSizePolygon object defined in the [sat](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/sat.html) module.
			 * The polygon is said to be fixed of size becuase no more vertexes can be
			 * added to it after it is created.
			 * 
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
			 * <p style='color:#AD071D'><strong>update</strong> Updates the position of the collider.</p>
			 *
			 * The collider follows the position of it's parent.
			 * 
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
			 * <p style='color:#AD071D'><strong>debug_draw</strong> Draw the circle collider</p>
			 *
			 * This method is only executed if the **debug** property of the parent [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 * is set to true. It is better to leave the drawing to the [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html) components.
			 * 
			 * @param  {Context 2D} context Context 2D property of the Canvas.
			 */
			debug_draw: function(context) {
				this.parent.getTransform(p, m);

				context.save();
				context.setTransform(1, 0, 0, 1, 0, 0);			
				context.translate(p.x, p.y);

				draw.polygon(context, 0, 0, this.pointsCopy, null, this.debugColor, 2);
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