/**
 * # layer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [delegate](@@delegate@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is the type of objects that [videport](@@videport@@) uses to determine the order in which [game-objects](@@game-object@@)
 * should be drawn. Each [viewport](@@viewport@@) has an array of this type of objects.
 */

/**
 * Visual organization
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate"], function(Delegate){
	var Layer = Delegate.extend({
		
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this.name = "";
			this.gameObjects = [];
			this.visible = true;
		},
		/**
		 * --------------------------------
		 */


		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Add a [game-obejct](@@game-obejct@@) to layer for rendering
		 * 
		 * @param {Object} go The [game-object](@@game-object@@) to add
		 */
		add: function(go) { 
			this.gameObjects.push(go); 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Remove a [game-object](@@game-object@@) from the layer
		 * 
		 * @param {Object} go The [game-object](@@game-object@@) to remove
		 */
		remove: function(go) { 
			this.gameObjects.splice(this.gameObjects.indexOf(go), 1); 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAll</strong></p>
		 *
		 * Removes all the [game-objects](@@game-object@@) from the layer
		 */
		removeAll: function() { 
			this.gameObjects = []; 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 * @param  {Number} x       X position of the [viewport](@@viewport@@) the layer belongs to
		 * @param  {Number} y       Y position of the [viewport](@@viewport@@) the layer belongs to
		 * @param  {Number} offsetX X offset of the [viewport](@@viewport@@) the layer belongs to
		 * @param  {Number} offsetY Y offset of the [viewport](@@viewport@@) the layer belongs to
		 * @param  {Number} width   Width of the [viewport](@@viewport@@) the layer belongs to
		 * @param  {Number} height  Height of the [viewport](@@viewport@@) the layer belongs to
		 */
		draw: function(context, x, y, offsetX, offsetY, width, height) {
			if (!this.visible) return;

			for (var i = 0; i < this.gameObjects.length; i++) {
				this.gameObjects[i].draw(context, x, y, offsetX, offsetY, width, height);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Make the layer visible
		 */
		show: function() { 
			this.visible = true; 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Make the layer invisible
		 */
		hide: function() { 
			this.visible = false; 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isVisible</strong></p>
		 *
		 * Wether the layer is visible or not
		 *
		 * @return {Boolean}
		 */
		isVisible: function() { 
			return this.visible; 
		}
		/**
		 * --------------------------------
		 */
	});

	return Layer;
});