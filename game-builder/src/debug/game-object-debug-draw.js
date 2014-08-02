/**
 * # game-object-debug-draw.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [draw](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/draw.html)
 * [gb](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/gb.html)
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is  used in [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to call the **debug_draw** method
 * of all the components. It also draws the registration point of the the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html)
 * calling the **debugDraw** method.
 */

/**
 * Visual aid
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require){
	var r = {};

	var DebugDraw = {}

	/**
	 * <p style='color:#AD071D'><strong>debugDraw</strong></p>
	 *
	 * Draw info about <a href=file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html>game-object</a>.
	 * 
	 * This method only does something if the **debug** property is set to **true** in 
	 * the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) making the call.
	 * 
	 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	 * @param  {Object} viewport The [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) is drawn too
	 */
	DebugDraw.gameObject = function(context, viewport) {
		var gb = require('gb');
		
		if(gb.debug) {

			// Store current context
			context.save();
			// Reset transformation
			context.setTransform(1, 0, 0, 1, 0, 0);			
			// Translate to adjust for the current [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
			context.translate(viewport.x + viewport.offsetX, viewport.y + viewport.offsetY);
			// Scale to adjust for the current [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
	    	context.scale(viewport.scaleX, viewport.scaleY);
	    	// Translate to the center of the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html)
			
			// Draw what ever the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) wants to show in debug mode
	    	this.debug_draw(context, viewport, require('draw'))

	    	// Draw what ever the [renderer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/components/rendering/renderer.html) wants to show in debug mode
	    	if (this.renderer) {
	    		this.renderer.debug_draw(context, viewport, require('draw'));
	    	}

			if (this.components) {
				// Draw whatever the [components](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/components/component.html) want to draw in debug mode
				for(var i=0; i<this.components.length; i++) {
					this.components[i].debug_draw(context, viewport, require('draw'))
				}
			}

			// Restore original context
			context.restore();
		}
	}
	/**
	 * --------------------------------
	 */

	return DebugDraw;
});