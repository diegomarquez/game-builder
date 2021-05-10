/**
 * # bitmap-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html)
 *
 * Depends of: 
 * [image-cache](http://diegomarquez.github.io/game-builder/game-builder-docs/src/cache/image-cache.html)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * Mainly this is a wrapper to the [Image Object](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement?redirectlocale=en-US&redirectslug=DOM%2FHTMLImageElement)
 * 
 * This renderer is used to draw still images and can receive a bunch of configuration options
 * when setting it up in the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html). ej.
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Bitmap", 'Bitmap_Renderer')
 	.args({ 
 		//Path to the image you want to draw.
 		//This is required
		path: 'some/path/to/image.jpg',

 		//Use this if you want the registration point of the image to be the center
 		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0, 
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html>component-pool</a>
 * found in the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html>gb</a> module. 
 * The way you get a hold to a reference to the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html>component-pool</a>
 * may vary.</strong>
 */

/**
 * Draw Images
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", "image-cache", "error-printer"], function(Renderer, ImageCache, ErrorPrinter) {

	var BitmapRenderer = Renderer.extend({
		init: function() {
			this._super();

			this.cache = ImageCache;
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) using this renderer.
		 * It sends the path configured to the [image-cache](http://diegomarquez.github.io/game-builder/game-builder-docs/src/cache/image-cache.html) module.
		 */
		start: function(parent) {
			if (!this.path) {
				ErrorPrinter.missingArgumentError('Bitmap Renderer', 'path');
			}

			this.cache.cache(this.path);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the image into the canvas, applying configured properties,
		 * like **width**, **height** and **offsets**
		 * 
		 * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport     The [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) this renderer is being drawn to
		 */
		draw: function(context, viewport) {
			var image = this.cache.get(this.path);

			if (!image)
				return;

			if (this.tinted) {
				var tintedCanvas = this.tintImage(this.path, image);

				context.drawImage(tintedCanvas,
					Math.floor(this.rendererOffsetX()),
					Math.floor(this.rendererOffsetY()),
					Math.floor(this.rendererWidth()),
					Math.floor(this.rendererHeight())
				);
			} else {
				context.drawImage(image,
					Math.floor(this.rendererOffsetX()),
					Math.floor(this.rendererOffsetY()),
					Math.floor(this.rendererWidth()),
					Math.floor(this.rendererHeight())
				);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererOffsetX</strong></p>
		 *
		 * @return {Number} The offset in the X axis of the renderer
		 */
		rendererOffsetX: function() {
			if (this.offset == 'center') {
				return -this.rendererWidth() / 2 + this.offsetX;
			} else {
				return this.offsetX;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererOffsetY</strong></p>
		 *
		 * @return {Number} The offset in the Y axis of the renderer
		 */
		rendererOffsetY: function() {
			if (this.offset == 'center') {
				return -this.rendererHeight() / 2 + this.offsetY;
			} else {
				return this.offsetY;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererWidth</strong></p>
		 *
		 * @return {Number} The width of the renderer
		 */
		rendererWidth: function() {
			return this.cache.get(this.path)
				.width;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererHeight</strong></p>
		 *
		 * @return {Number} The height of the renderer
		 */
		rendererHeight: function() {
			return this.cache.get(this.path)
				.height;
		}
		/**
		 * --------------------------------
		 */
	});

	return BitmapRenderer;
});
