/**
 * # box-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [renderer](@@renderer@@),
 *
 * Depends of:
 * [draw](@@draw@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * A very basic example on how to setup a renderer. This one just draws a rectangle with the options
 * specified when setting up the [component-pool](@@component-pool@@)
 */

/**
 * --------------------------------
 */
define(["renderer", "draw"], function(Renderer, Draw) {
	//Really basic renderer for the purpose of this examples.

	//context property is the context of the canvas we are using, somehow it becomes available here.
	var BoxRenderer = Renderer.extend({
		draw: function(context, viewport) {
			Draw.rectangle(context, this.offsetX, this.offsetY, this.width, this.height, this.color, this.color, 1);
		}
	});

	return BoxRenderer;
});