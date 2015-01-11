/**
 * # basic-display-setup.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [extension](@@extension@@)
 *
 * Depends of: 
 * [groups](@@groups@@)
 * [viewports](@@viewports@@)
 * [gb](@@gb@@)
 * [world](@@world@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an extension that adds a bunch of [group](@@group@@) objects to the 
 * [groups](@@groups@@) object which control the update of [game-objects](@@game-object@@). 
 * The [viewport](@@viewport@@) objects are also defined here through 
 * the [viewports](@@viewports@@) object, these objects control the rendering of [game-objects](@@game-object@@).
 *
 * Also set here, are some shortcuts that are used when adding a [game-object](@@game-object@@) to a [viewport](@@viewport@@)
 * [layer](@@layer@@). 
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
define(["groups", "viewports", "gb", "world", "extension"], function(Groups, Viewports, Gb, World, Extension) {
	var BasicDisplaySetup = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			// Configure the [world](@@world@@) object. 
			// For simplicity's sake it is the same size as the canvas
			World.create(Gb.canvas.width, Gb.canvas.height);

			// Set a few update [groups](@@group@@)
			Groups.add("First");
			Groups.add("Second");
			Groups.add("Third");

			// Create a [viewport](@@viewport@@). It has a width and a height along with offset coordinates
			// in case you don't want it to start in the top left corner of the canvas
			var viewport = Viewports.add("Main", Gb.canvas.width, Gb.canvas.height, 0, 0);

			// Set the [layers](@@layer@@) this [viewport](@@viewport@@) will have
			viewport.addLayer("Back");
			viewport.addLayer("Middle");
			viewport.addLayer("Front");

			// Set a bunch of shortcuts for [viewport](@@viewport@@) + [layer](@@layer@@) setups that will be used oftenly
			Gb.setViewportShortCut('MainBack', [{viewport:'Main', layer:'Back'}]);
			Gb.setViewportShortCut('MainMiddle', [{viewport:'Main', layer:'Middle'}]);
			Gb.setViewportShortCut('MainFront', [{viewport:'Main', layer:'Front'}]);
		},

		destroy: function() {
			Groups.remove("First");
			Groups.remove("Second");
			Groups.remove("Third");

			Viewports.remove('Main');

			Gb.removeViewportShortCut('MainBack');
			Gb.removeViewportShortCut('MainMiddle');
			Gb.removeViewportShortCut('MainFront');
		}
	});

	return BasicDisplaySetup;
});