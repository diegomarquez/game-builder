/**
 * # game-object-debug-draw.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: [draw](@@draw@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is  used in [game-object](@@game-object@@) to call the **debug_draw** method
 * of all the components. It also draws the registration point of the the [game-object](@@game-object@@)
 * calling the **debugDraw** method.
 */

/**
 * Visual aid
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['draw'], function(draw) {
	var p = null;
	var m = null;

	/**
	 * <p style='color:#AD071D'><strong>debugDraw</strong></p>
	 *
	 * Draw info about <a href=@@game-object@@>game-object</a>.
	 * 
	 * This method only does something if the **debug** property is set to **true** in 
	 * the [game-object](@@game-object@@) making the call.
	 * 
	 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	 */
	var debugDraw = function(context) {
		if(this.debug) {
			p = this.getTransform(p, m);

			context.save();
			context.setTransform(1, 0, 0, 1, 0, 0);			
			context.translate(p.x, p.y);

			// Draw the center of the object
			draw.circle(context, 0, 0, 3, null, "#FF00FF", 2);

			context.restore();

			if (!this.components) return;

			// Draw whatever the components want to draw
			for(var i=0; i<this.components.length; i++){
				this.components[i].debug_draw(context)
			}
		}
	}
	/**
	 * --------------------------------
	 */

	return debugDraw;
});