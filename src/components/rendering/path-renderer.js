/**
 * # path-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [component](@@component@@)
 *
 * Depends of: 
 * [path-cache](@@path-cache@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This renderer is similar to [bitmap-renderer](@@bitmap-renderer@@) but instead of drawing an external image
 * it receives a function that defines a path to draw on a [canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/).
 * 
 * The module will take care of caching the drawing into a separate canvas and drawing from there, instead of executing all the path instructions
 * each frame. 
 * 
 * This renderer can receive a bunch of configuration options
 * when setting it up in the [component-pool](@@component-pool@@). ej.
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Path", 'Path_Renderer')
 	.args({ 
 		//This name is used to identify the cached drawing
 		//This is required
		name: 'RendererName',

		//These set the total width and height of the path
		//This argument is only required if the renderer does not provide it. 
		pathWidth: 100,
		pathHeight: 100,

		//Use this to define the path this renderer will draw
		//This argument is only required if the renderer does not provide it. 
		drawPath: function(context) { 'path definition goes here' }

 		//Use this if you want the registration point of the image to be the center
 		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0, 
		
		//Use these to override the dimentions of the path.
		//These are optional
		width: 20, 
		height: 20,
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@csomponent-pool@@>component-pool</a>
 * may vary.</strong>
 */

/**
 * Cache Paths
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["component", "path-cache", "error-printer"], function(Component, PathCache, ErrorPrinter) {

	var canvas = null;

	var PathRenderer = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 */
		init: function() {
			this._super()

			this.offsetX = 0;
			this.offsetY = 0;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It caches the results of executing the **drawPath** method.
		 *
		 * @throws {Error} If pathWidth and pathHeight properties are not set
		 */
		start: function(parent) {	
			if (!this.pathWidth && !this.pathHeight) {
				ErrorPrinter.missingArgumentError('Path Renderer', 'pathWidth', 'pathHeight')
			}

			PathCache.cache(this.name, this.pathWidth, this.pathHeight, this.drawPath);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>drawPath</strong></p>
		 *
		 * This method must define the path that will be cached.
		 *
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 *
		 * @throws {Error} If it is not overriden by child classes
		 */
		drawPath: function(context) {
			ErrorPrinter.mustOverrideError('Path Renderer');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the cached path into the canvas, applying configured properties,
		 * like **width**, **height** and **offsets**
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 */
		draw: function(context) {
			var w, h;

			canvas = PathCache.get(this.name);

			if (this.width && this.height) {
				w = this.width;
				h = this.height;
			} else {
				w = canvas.width;
				h = canvas.height;
			}

			if (this.offset == 'center'){
				context.drawImage(canvas, -w/2, -h/2, w, h);	
			} else{
				context.drawImage(canvas, this.offsetX, this.offsetY, w, h);		
			}
		}
		/**
		 * --------------------------------
		 */
	});

	return PathRenderer;
});