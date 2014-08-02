/**
 * # bitmap-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](@@renderer@@)
 *
 * Depends of: [image-cache](@@image-cache@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * Mainly this is a wrapper to the [Image Object](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement?redirectlocale=en-US&redirectslug=DOM%2FHTMLImageElement)
 * 
 * This renderer is used to draw still images and can receive a bunch of configuration options
 * when setting it up in the [component-pool](@@component-pool@@). ej.
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
		
		//Use these to override the dimentions of the loaded image.
		//These are optional
		scaleX: 1, 
		scaleY: 1
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@component-pool@@>component-pool</a>
 * may vary.</strong>
 */

/**
 * Draw Images
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", "image-cache"], function(Renderer, ImageCache) {

	var image;

	var BitmapRenderer = Renderer.extend({
		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It sends the path configured to the [image-cache](@@image-cache@@) module.
		 */
		start: function(parent) {	
			ImageCache.cache(this.path);
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
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 */
		draw: function(context) {
			image = ImageCache.get(this.path);
			context.drawImage(image, this.rendererOffsetX(), this.rendererOffsetY(), this.rendererWidth(), this.rendererHeight());	
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
				return -this.rendererWidth()/2 * this.scaleX;
			} else {
				return this.offsetX * this.scaleX; 
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
				return -this.rendererHeight()/2  * this.scaleY;
			} else {
				return this.offsetY * this.scaleY;  
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
		rendererWidth: function() { return ImageCache.get(this.path).width * this.scaleX; },
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererHeight</strong></p>
		 *
		 * @return {Number} The height of the renderer
		 */
		rendererHeight: function() { return ImageCache.get(this.path).height * this.scaleY; }
		/**
		 * --------------------------------
		 */
	});

	return BitmapRenderer;
});