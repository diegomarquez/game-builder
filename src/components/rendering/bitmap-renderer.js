/**
 * # bitmap-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [component](@@component@@)
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
		width: 20, 
		height: 20
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
define(["component", "image-cache"], function(Component, ImageCache) {

	var image = null;

	var BitmapRenderer = Component.extend({
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
			var w, h;

			image = ImageCache.get(this.path);

			if (this.width && this.height) {
				w = this.width;
				h = this.height;
			} else {
				w = image.width;
				h = image.height;
			}

			if (this.offset == 'center'){
				context.drawImage(image, -w/2, -h/2, w, h);	
			} else{
				context.drawImage(image, this.offsetX, this.offsetY, w, h);		
			}
		}
		/**
		 * --------------------------------
		 */
	});

	return BitmapRenderer;
});