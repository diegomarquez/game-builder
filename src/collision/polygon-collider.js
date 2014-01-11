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
 * This module defines a component mean to be attached to a [game-object](@@game-object@@), to give it
 * the ability to collide against other [game-object](@@game-object@@) with collider components.
 *
 * Polygon colliders are defined by a collection of [vector-2D](@@vector-2D@@) objects. They follow
 * not only the position of it's parent but also scale and rotation transformations.
 *
 * During the configuration of the [component-pool](@@component-pool@@) polygon colliders need to 
 * receive an object that looks similar to the following:
 * 
 * ``` javascript
 * gb.coPool.createConfiguration("Polygon_1", 'Polygon')
 	.args({
 		id:'polygon-collider_ID', 
 		points:[ 
 			new vector_2D(0, 0), 
 			new vector_2D(64, 0), 
 			new vector_2D(64, 64), 
 			new vector_2D(0, 64) 
 		]
 	});
 * ```
 * If it is not provided it will most likely fail in un expected ways.
 * 
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@component-pool@@>component-pool</a>
 * may vary</strong>
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
			 * Creates a FixedSizePolygon object defined in the [sat](@@sat@@) module.
			 * The polygon is said to be fixed of size becuase no more vertexes can be
			 * added to it after it is created.
			 * 
			 * @return {null}
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
			 * <p style='color:#AD071D'><strong>update</strong> Updates the transformation of the collider.</p>
			 *
			 * The collider follows it's parent along every matrix transformation.
			 * 
			 * @return {null}
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
			 * <p style='color:#AD071D'><strong>debug_draw</strong> Draw the circle collider</p>
			 *
			 * This method is only executed if the **debug** property of the parent [game-object](@@game-object@@)
			 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
			 * 
			 * @param  {Context 2D} context Context 2D property of the Canvas.
			 * @return {null}
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