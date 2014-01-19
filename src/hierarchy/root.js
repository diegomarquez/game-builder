/**
 * # root.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object-container](@@game-object-container@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines the root [game-object-container](@@game-object-container@@)
 *
 * In any given [Game-Builder](http://diegomarquez.github.io/game-builder) application
 * this is is the only [game-object-container](@@game-object-container@@) that is updated
 * explicitly in the main update loop. As it is updated and rendered, it will update and render all of its 
 * children, who will in turn update and render their childs, until everything has been updated
 * and renderer.
 *
 * If you where wondering, this is where the screen is cleared before each update cycle. 
 * It is possible to manipulate this object as any other [game-object](@@game-object@@), 
 * but that is probably not a good idea :P
 *
 * Asides from that, there isn't anything else noteworthy about this module, inspite of being at the
 * very begenning of the hierarchical structure.
 */

/**
 * The root of all things
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["game-object-container"], function(Container){
	var Root = Container.extend({
		/**
		 * <p style='color:#AD071D'><strong>transformAndDraw</strong></p>
		 *
		 * Clears the screen, and then proceeds to updat and render all of
		 * it's children, which will in turn do the same for their children.
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 */
		transformAndDraw: function(context) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			this._super(context);
		}
		/**
		 * --------------------------------
		 */
	});

	return new Root();
});