/**
 * # game-object-debug-draw.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [draw](http://diegomarquez.github.io/game-builder/game-builder-docs/src/draw.html)
 * [gb](http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is used in [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to call the **debug_draw** method
 * of all the components. It also draws the registration point of the the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
 * calling it's **debug_draw** method.
 */

/**
 * Visual aid
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {

	var DebugDraw = {}

	DebugDraw.drawModule = null;
	DebugDraw.gbModule = null;

	DebugDraw.draw = function() {
		if (!DebugDraw.drawModule) {
			DebugDraw.drawModule = require('draw');
		}

		return DebugDraw.drawModule;
	}

	DebugDraw.gb = function() {
		if (!DebugDraw.gbModule) {
			DebugDraw.gbModule = require('gb');
		}

		return DebugDraw.gbModule;
	}

	/**
	 * <p style='color:#AD071D'><strong>debugDraw</strong></p>
	 *
	 * Draw info about a <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html>game-object</a>.
	 *
	 * This method only does something if the **debug** property in [gb](http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html) is set to **true** and the
	 * property **skipDebug** of the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) making the call is set to **false**.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Object} viewport The [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) is drawn too
	 */
	DebugDraw.gameObject = function(go, context, viewport) {
		var gb = this.gb();
		var draw = this.draw();

		if (gb.debug && !go.skipDebug) {
			// Store current context
			context.save();
			// Reset transformation
			context.setTransform(1, 0, 0, 1, 0, 0);
			// Apply transformations for the current [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
			viewport.transformContext(context);

			// Draw what ever the [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html) wants to show in debug mode
			if (go.renderer) {
				go.renderer.debug_draw(context, viewport, draw, gb);
			}

			if (go.components) {
				// Draw whatever the [components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) wants to draw in debug mode
				for (var i = 0; i < go.components.length; i++) {
					go.components[i].debug_draw(context, viewport, draw, gb);
				}
			}

			// Draw what ever the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) wants to show in debug mode
			go.debug_draw(context, viewport, draw, gb);

			// Restore original context
			context.restore();
		}
	}
	/**
	 * --------------------------------
	 */

	return DebugDraw;
});
