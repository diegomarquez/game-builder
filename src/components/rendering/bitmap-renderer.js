/**
 * # bitmap-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [component](@@component@@)
 *
 * Depends of:
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
 		//Path to the image you want to draw. This is required
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
define(["component"], function(Component) {
	var Renderer = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 * 
		 * Constructor.
		 * 
		 * It create an Image object to be used later by the renderer.
		 */
		init: function() {
			this._super()

			this.image = new Image();

			this.offsetX = 0;
			this.offsetY = 0;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer
		 * and it will set the **src** property of the **image** to what
		 * was specified during configuration.
		 */
		start: function() {
			this.image.src = this.path;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the image into the canvas. Applying configured properties,
		 * like **width**, **height** and **offsets**
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 */
		draw: function(context) {
			var w, h;

			if(this.width && this.height) {
				w = this.width;
				h = this.height;
			}else {
				w = this.image.width;
				h = this.image.height;
			}

			if(this.offset == 'center'){
				context.drawImage(this.image, -w/2, -h/2, w, h);	
			}
			else{
				context.drawImage(this.image, this.offsetX, this.offsetY, w, h);		
			}
		}
		/**
		 * --------------------------------
		 */
	});

	return Renderer;
});