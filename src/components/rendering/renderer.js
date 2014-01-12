/**
 * # renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [component](@@component@@)
 *
 * Depends of:
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
define(["component"], function(Component) {
	var Renderer = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>draw</strong> Drawing logic</p>
		 *
		 * This method is overriden my objects extending this one
		 * 
		 * @param  {Context 2D} context Context 2D property of the Canvas
		 * @throws {Error} If called
		 */
		draw: function(context) {
			throw new Error("Renderer is not meant to be instantiated directly")
		}
		/**
		 * --------------------------------
		 */
	});

	return Renderer;
});