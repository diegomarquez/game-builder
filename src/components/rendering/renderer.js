/**
 * # renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [component](@@component@@)
 *
 * Depends of:
 * [error-printer](@@error-printer@@)
 * [draw](@@draw@@)
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
define(["component", "error-printer"], function(Component, ErrorPrinter) {
	var r = {}

	var Renderer = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.offsetX = 0;
			this.offsetY = 0;

			this.scaleX = 1;
			this.scaleY = 1;

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
		 * @throws {Error} Always
		 */
		draw: function(context, viewport) {
			ErrorPrinter.mustOverrideError('Renderer');
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

			return this.width * this.scaleX; 
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

			return this.height * this.scaleY; 
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
			return this.offsetX * this.scaleX; 
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
			return this.offsetY * this.scaleY; 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
		 *
		 * This method is only executed if the **debug** property of the parent [gb](@@gb@@)
		 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
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

			// Top Left 
			drawLineAndPoint.call(this, context, this.rendererOffsetX(), this.rendererOffsetY(), draw, 'moveTo');
			// Top Right
			drawLineAndPoint.call(this, context, this.rendererOffsetX() + this.rendererWidth(), this.rendererOffsetY(), draw, 'lineTo');
			// Bottom Right
			drawLineAndPoint.call(this, context, this.rendererOffsetX() + this.rendererWidth(), this.rendererOffsetY() + this.rendererHeight(), draw, 'lineTo');
			// Bottom Left
			drawLineAndPoint.call(this, context, this.rendererOffsetX(), this.rendererOffsetY() + this.rendererHeight(), draw, 'lineTo');

			context.closePath();

			context.stroke();
			context.restore();
		}
		/**
		 * --------------------------------
		 */
	});

	var drawLineAndPoint = function(context, offsetX, offsetY, draw, lineMethod) {
		r = this.parent.matrix.transformPoint(offsetX, offsetY, r); 
		context[lineMethod](r.x, r.y);
	}

	return Renderer;
});