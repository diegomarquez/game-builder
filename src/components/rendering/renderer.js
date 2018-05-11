/**
 * # renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [component](@@component@@)
 *
 * Depends of:
 * [vector-2D](@@vector-2D@@)
 * [error-printer](@@error-printer@@)
 * [rgb-canvas-cache](@@rgb-canvas-cache@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module only exists to make the interface for a renderer explicit.
 */

/**
 * An Interface for renderers
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["component", "vector-2D", "error-printer", "rgb-canvas-cache"], function(Component, Vector2D, ErrorPrinter, RgbCanvasCache) {

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	var Renderer = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.width = 0;
			this.height = 0;
			this.offsetX = 0;
			this.offsetY = 0;
			this.offset = "";
			this.tinted = false;
			this.tintRed = 0;
			this.tintGreen = 0;
			this.tintBlue = 0;
			this.debugColor = "#FFFF00";

			this.reset();

			this.workVector = new Vector2D();

			this.tmpCanvas = canvas;
			this.tmpContext = context;
			this.rgbCanvasCache = RgbCanvasCache;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>reset</strong></p>
		 *
		 * Reset for re-use
		 */
		reset: function() {
			this._super();

			this.offsetX = 0;
			this.offsetY = 0;
			this.offset = "";
			this.tinted = false;
			this.tintRed = 0;
			this.tintGreen = 0;
			this.tintBlue = 0;
			this.debugColor = "#FFFF00";
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 * 
		 * This is an abstract method and must be overriden.
		 *
		 * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport     The [viewport](@@viewport@@) this renderer is being drawn to
		 * 
		 * @throws {Error} Always
		 */
		draw: function(context, viewport) {
			ErrorPrinter.mustOverrideError('Renderer');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>tint</strong></p>
		 *
		 * Enable tinting
		 * 
		 * @param  {Number} r Red channel amount between 0 and 255
		 * @param  {Number} g Green channel amount between 0 and 255
		 * @param  {Number} b Blue channel amount between 0 and 255
		 */
		tint: function(r, g, b) {
			this.tinted = true;
			this.tintRed = r;
			this.tintGreen = g;
			this.tintBlue = b;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>disableTint</strong></p>
		 *
		 * Disable tinting
		 */
		disableTint: function() {
			this.tinted = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>tintImage</strong></p>
		 *
		 * Logic to tint an image and cache it
		 * 
		 * @param  {Drawable} source Source image to tint
		 * @param  {Number} r Red channel amount between 0 and 255
		 * @param  {Number} g Green channel amount between 0 and 255
		 * @param  {Number} b Blue channel amount between 0 and 255
		 *
		 * @return {Drawable} The tinted image
		 */
		tintImage: function(id, source) {
			this.rgbCanvasCache.cache(id, source);

			var channels = this.rgbCanvasCache.get(id);
			var canvas = this.tmpCanvas;
			var context = this.tmpContext;

			canvas.width = source.width;
			canvas.height = source.height;

			context.globalAlpha = 1;
			context.globalCompositeOperation = 'copy';
			context.drawImage(channels[3], 0, 0);

			context.globalCompositeOperation = 'lighter';

			if (this.tintRed > 0) {
				context.globalAlpha = this.tintRed / 255;
				context.drawImage(channels[0], 0, 0);
			}

			if (this.tintGreen > 0) {
				context.globalAlpha = this.tintGreen / 255;
				context.drawImage(channels[1], 0, 0);
			}

			if (this.tintBlue > 0) {
				context.globalAlpha = this.tintBlue / 255;
				context.drawImage(channels[2], 0, 0);
			}

			return canvas;
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
			if (!this.width) {
				ErrorPrinter.missingArgumentError('Renderer', 'width');
			}

			return this.width;
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
			if (!this.height) {
				ErrorPrinter.missingArgumentError('Renderer', 'height');
			}

			return this.height;
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
			return this.offsetX;
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
			return this.offsetY;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererLeft</strong></p>
		 *
		 * @return {Number} The left coordinate of the rectangle enclosing this renderer
		 */
		rendererLeft: function() {
			return this.rendererOffsetX();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererTop</strong></p>
		 *
		 * @return {Number} The top coordinate of the rectangle enclosing this renderer
		 */
		rendererTop: function() {
			return this.rendererOffsetY();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererRight</strong></p>
		 *
		 * @return {Number} The right coordinate of the rectangle enclosing this renderer
		 */
		rendererRight: function() {
			return this.rendererOffsetX() + this.rendererWidth();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererBottom</strong></p>
		 *
		 * @return {Number} The bottom coordinate of the rectangle enclosing this renderer
		 */
		rendererBottom: function() {
			return this.rendererOffsetY() + this.rendererHeight();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
		 *
		 * This method is only executed if the **debug** property in [gb](@@gb@@)
		 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
		 * 
		 * @param  {Context 2D} context     [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport A reference to the current [viewport](@@viewport@@)
		 * @param  {Object} draw     A reference to the [draw](@@draw@@) module
		 * @param  {Object} gb     A reference to the [gb](@@gb@@) module
		 */
		debug_draw: function(context, viewport, draw, gb) {
			if (!gb.rendererDebug) return;

			context.save();
			context.beginPath();

			context.strokeStyle = this.debugColor;
			context.lineWidth = 1;

			context.translate(-0.5, -0.5);

			var m = this.parent.getMatrix();

			// Top Left 
			this.workVector = m.transformPoint(this.rendererLeft(), this.rendererTop(), this.workVector);
			context.moveTo(Math.round(this.workVector.x), Math.round(this.workVector.y));

			// Top Right
			this.workVector = m.transformPoint(this.rendererRight(), this.rendererTop(), this.workVector);
			context.lineTo(Math.round(this.workVector.x), Math.round(this.workVector.y));

			// Bottom Right
			this.workVector = m.transformPoint(this.rendererRight(), this.rendererBottom(), this.workVector);
			context.lineTo(Math.round(this.workVector.x), Math.round(this.workVector.y));

			// Bottom Left
			this.workVector = m.transformPoint(this.rendererLeft(), this.rendererBottom(), this.workVector);
			context.lineTo(Math.round(this.workVector.x), Math.round(this.workVector.y));

			context.closePath();

			context.stroke();
			context.restore();
		}
		/**
		 * --------------------------------
		 */
	});

	return Renderer;
});
