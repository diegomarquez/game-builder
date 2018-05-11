/**
 * # text-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: [renderer](@@renderer@@)
 *
 * Depends of: [text-cache](@@text-cache@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module takes care of the rendering of text. If the text you want to draw is not going to change too much, it is best to cache it.
 * If it is going to change, it is better not to cache it. Finally, if it is going to change alot, it might be better to display the text
 * through HTML, because this whole text rendering thing, is not the fastest thing in town.
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Text", 'Text_Renderer')
 	.args({ 
 		//This name is used to identify the cached text
 		//This is required
		name: 'some/path/to/image.jpg',

		//Font to use. 
		//Defaults to 'Arial'
		font: 'Arial',
		//Align of the text
		//Defaults to 'start'
		align: 'start',
		//Line width of the text
		//Defaults to 1
		lineWidth: 1,
		//Fill color of the text
		//Deafults to 'black'
		fillColor: 'black',
		//Stroke color of the text
		//Defaults to 'white'
		strokeColor: 'white',
		//Background color of the text
		//Defaults to transparent
		backgroundColor: 'rgba(100%, 100%, 100%, 0)',

 		//Use this if you want the registration point of the image to be the center
 		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0, 
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@component-pool@@>component-pool</a>
 * may vary.</strong>
 */

/**
 * Draw Text
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", 'text-cache'], function(Renderer, TextCache) {

	var TextRenderer = Renderer.extend({
		init: function() {
			this._super();

			this.cache = TextCache;
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It sends the text configured to the [text-cache](@@text-cache@@) module.
		 */
		start: function() {
			this.align = this.align || "start";
			this.lineWidth = this.lineWidth || 1;
			this.fill = this.fillColor || "#000000";
			this.stroke = this.strokeColor || "#FFFFFF";
			this.size = this.size || 10;
			this.fontFamily = this.font || 'Arial';
			this.background = this.backgroundColor || 'rgba(100%, 100%, 100%, 0)';

			this.cache.cache(this.name, this);
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
		 * @param  {Object} viewport     The [viewport](@@viewport@@) this renderer is being drawn to
		 */
		draw: function(context, viewport) {
			var canvas = this.cache.get(this.name);

			if (!canvas)
				return;

			if (this.tinted) {
				var tintedCanvas = this.tintImage(this.name, canvas);

				context.drawImage(tintedCanvas,
					Math.floor(this.rendererOffsetX()),
					Math.floor(this.rendererOffsetY()),
					Math.floor(this.rendererWidth()),
					Math.floor(this.rendererHeight())
				);
			} else {
				context.drawImage(canvas,
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
			return this.cache.get(this.name)
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
			return this.cache.get(this.name)
				.height;
		}
		/**
		 * --------------------------------
		 */
	});

	// ### Setters that will trigger a re-cache of the text.

	Object.defineProperty(TextRenderer.prototype, "Align", {
		set: function(value) {
			this.align = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "LineWidth", {
		set: function(value) {
			this.lineWidth = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "FillColor", {
		set: function(value) {
			this.fillColor = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "StrokeColor", {
		set: function(value) {
			this.strokeColor = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "Font", {
		set: function(value) {
			this.fontFamily = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "Size", {
		set: function(value) {
			this.size = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "Text", {
		set: function(value) {
			this.text = value;
			this.cache.cache(this.name, this);
		}
	});

	Object.defineProperty(TextRenderer.prototype, "Background", {
		set: function(value) {
			this.background = value;
			this.cache.cache(this.name, this);
		}
	});

	return TextRenderer;
});
