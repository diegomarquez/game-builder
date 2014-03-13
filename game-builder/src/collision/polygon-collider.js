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
 * This module defines a component meant to be attached to a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html), to give it
 * the ability to collide against other [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) with collider components.
 *
 * Polygon colliders are defined by a collection of [vector-2D](http://diegomarquez.github.io/game-builder/game-builder-docs/src/math/vector-2D.html) objects. They follow
 * not only the position of it's parent but also scale and rotation transformations.
 *
 * During the configuration of the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html) polygon colliders need to 
 * receive an object that looks similar to the following:
 * 
 * ``` javascript
 * gb.coPool.createConfiguration("Polygon_1", 'Polygon')
 	.args({
 		//Id used by the Collision Resolver
 		id:'polygon-collider_ID', 

 		//Array of points that define the polygon collider
 		points:[ 
 			new vector_2D(0, 0), 
 			new vector_2D(64, 0), 
 			new vector_2D(64, 64), 
 			new vector_2D(0, 64) 
 		]
 * });
 * ```
 * If it is not provided it will most likely fail in un-expected ways.
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
			 * <p style='color:#AD071D'><strong>start</strong></p>
			 *
			 * Set up the collider.
			 * 
			 * Creates a FixedSizePolygon object defined in the [sat](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/sat.html) module.
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
			 * Updates the transformation of the collider.
			 * 
			 * The collider follows it's parent along every matrix transformation.
			 */
			update: function() {
				m = this.parent.getMatrix(m);

				for(var i=0; i<this.pointCount; i++) {
					p = m.transformPoint(this.pointsCopy[i].x, this.pointsCopy[i].y, p);

					this.collider.points[i].x = p.x;
					this.collider.points[i].y = p.y;	
				}

				this.collider.recalc();

				this._super();
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
			 *
			 * Draw the polygon collider.
			 * 
			 * This method is only executed if the **debug** property of the parent [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 * is set to true. It is better to leave the drawing to the [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html) components.
			 * 
			 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
			 */
			debug_draw: function(context) {
				draw.polygon(context, 0, 0, this.pointsCopy, null, this.debugColor, 2);

				this._super();
			}
			/**
			 * --------------------------------
			 */
		});

		return Component;
	}
);