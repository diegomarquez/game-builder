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
define(["delegate"], function(Delegate) {
	var r = {};

  var Layer = Delegate.extend({

    /**
     * <p style='color:#AD071D'><strong>init</strong></p>
     *
     * Constructor
     *
     * @param {String} name The name of the layer
     * @param {Viewport} viewport The [viewport](@@viewport@@) the layer belongs to
     */
    init: function(name, viewport) {
      this.name = name;
      this.gameObjects = [];
      this.visible = true;
      this.viewport = viewport;
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
     *
     * @return {Object|null} The [game-object](@@game-object@@) that was just added or null if the [game-object](@@game-object@@) was already part of the layer
     */
    add: function(go) {
      var index = this.gameObjects.indexOf(go); 

      if (index == -1) {
        this.gameObjects.push(go);
        go.addToViewportList(this.viewport.name, this.name);

        return go;
      }

      return null;
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
     *
     * @return {Object|null} The [game-object](@@game-object@@) that was just removed or null if the [game-object](@@game-object@@) was not part of the layer
     */
    remove: function(go) {
      var index = this.gameObjects.indexOf(go);

      if (index != -1) {
        this.gameObjects.splice(index, 1);
        go.removeFromViewportList(this.viewport.name, this.name);

        return go;
      }

      return null;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>removeAll</strong></p>
     *
     * Removes all the [game-objects](@@game-object@@) from the layer
     *
     * @return {Array} All the [game-objects](@@game-object@@) that were just removed
     */
    removeAll: function() {
      var gos = [];

      for (var i = 0; i < this.gameObjects.length; i++) {
        gos.push(this.remove(this.gameObjects[i]));
      }

      return gos;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>draw</strong></p>
     *
     * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
     */
    draw: function(context) {
      if (!this.visible) return;

      for (var i = 0; i < this.gameObjects.length; i++) {
        var go = this.gameObjects[i];

        if (go.isContainer()) {
        	// If the game object is a container game object...
        	// Call draw method, it will figure out if it actually needs to be drawn, and do the same for it's children
					go.draw(context, this.viewport);	
        } else {
        	// If the game object is a regular game object...
        	// Try to skip drawing as soon as possible
        	
        	// Draw only if inside the viewport and is allowed to be drawn
					if (this.viewport.isGameObjectInside(go, context) && go.canDraw) {
						go.draw(context, this.viewport);	
					}
        }
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
