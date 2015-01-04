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
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines a component meant to be attached to a [game-object](@@game-object@@), to give it
 * the ability to collide against other [game-objects](@@game-object@@) with collider components.
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
 		//Id used by the Collision Resolver
 		id:'polygon-collider_ID', 

 		//Array of points that define the polygon collider
 		points:[ 
 			{x: 0, y: 0},
 			{x: 64, y: 0},
 			{x: 64, y: 64},
 			{x: 0, y: 64}
 		]
 * });
 * ```
 * If it is not provided it will most likely fail in un-expected ways.
 *
 * <strong>Note 1: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@component-pool@@>component-pool</a>
 * may vary.</strong>
 *
 * <strong>Note 2: The points need to be specified in clockwise order.</strong>
 */

/**
 * Polygons colliding
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['collision-component', 'sat', 'collision-resolver', 'vector-2D'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D) {

		var p = {};
		var m = null;

		var PolygonCollider = CollisionComponent.extend({
			/**
			 * <p style='color:#AD071D'><strong>configure</strong></p>
			 *
			 * Configures properties
			 * set via the <a href=@@component-pool@@>component-pool</a>
			 * 
			 * This method is important as it applies all the configuration needed for 
			 * the component to work as expected.
			 *
			 * Overriden in this module to handle different types for the **points** argument
			 * 
			 * @param  {Object} args An object with all the properties to write into the component
			 */
			configure: function(args) {
				this._super(args);

				var copy = JSON.parse(JSON.stringify(this.points));
				var points = [];

				for (var i = 0; i < this.points.length; i++) {
					points.push(new Vector2D(copy[i].x, copy[i].y));
				}

				this.points = points;
			},
			/**
			 * --------------------------------
			 */
			
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
				this.pointsCopy = [];

				var copy = JSON.parse(JSON.stringify(this.points));
				var points = [];

				for (var i = 0; i < this.pointCount; i++) {
					this.pointsCopy.push(new Vector2D(copy[i].x, copy[i].y));
					points.push(new Vector2D(copy[i].x, copy[i].y));
				} 

				this.collider = new SAT.FixedSizePolygon(new Vector2D(0, 0), points);
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
				m = this.parent.matrix;

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
			 * This method is only executed if the **debug** property in [gb](@@gb@@)
		 	 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
			 * 
			 * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
			 * @param  {Object} viewport A reference to the current [viewport](@@viewport@@)
			 * @param  {Object} draw     A reference to the [draw](@@draw@@) module
			 * @param  {Object} gb     A reference to the [gb](@@gb@@) module
			 */
			debug_draw: function(context, viewport, draw, gb) {
				if (!gb.colliderDebug) return;

				m = this.parent.matrix;

				context.save();

				context.setTransform(1, 0, 0, 1, 0, 0);			
				context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
				draw.polygon(context, 0, 0, this.pointsCopy, null, this.debugColor, 2);
				
				context.restore();

				this._super();
			}
			/**
			 * --------------------------------
			 */
		});	

		return PolygonCollider;
	}
);