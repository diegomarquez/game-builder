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
	var Renderer = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Drawing logic.
		 * 
		 * This is an abstract method and must be overriden.
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 * @throws {Error} Always
		 */
		draw: function(context) {
			ErrorPrinter.mustOverrideError('Renderer');
		}
		/**
		 * --------------------------------
		 */
	});

	return Renderer;
});