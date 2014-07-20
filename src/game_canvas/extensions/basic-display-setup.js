/**
 * # basic-layer-setup.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](@@extension@@)
 *
 * Depends of: 
 * [groups](@@groups@@)
 * [viewports](@@viewports@@)
 * [gb](@@gb@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an extension that adds a bunch of [group](@@group@@) objects to the 
 * [groups](@@groups@@) object which control the update. The [viewport](@@viewport@@) objects are also defined here through
 * the [viewports](@@viewports@@) object, these objects control the rendering.
 * 
 * To use a different layout, you can always define a new extension just like this one and replace the 
 * relevant bits.
 */

/**
 * Setup display
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["groups", "viewports", "gb", "extension"], function(Groups, Viewports, Gb, Extension) {
	var BasicLayerSetup = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			Groups.add("First");
			Groups.add("Second");
			Groups.add("Third");

			var viewport = Viewports.add("Main", Gb.canvas.width, Gb.canvas.height, 0, 0);

			viewport.addLayer("Back");
			viewport.addLayer("Middle");
			viewport.addLayer("Front");
		}
	});

	return BasicLayerSetup;
});