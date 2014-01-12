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
 * Not much going on in here. For the mean time this module only makes splicit that
 * a renderer extends [component](@@component@@) by adding a **draw** method.
 *
 * In the future if needed common logic to all renderer will be dropped in here.
 * 
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
		 */
		draw: function(context) {}
	});

	return Renderer;
});