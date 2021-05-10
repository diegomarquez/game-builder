/**
 * # complex-display-setup.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](@@extension@@)
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
	var BasicLayerSetup = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			// Configure the [world](@@world@@) object
			World.create(Gb.canvas.width*3, Gb.canvas.height*9);

			// Set a few update [groups](@@group@@)
			Groups.addGroup("First");
			Groups.addGroup("Second");
			Groups.addGroup("Third");

			// Create a [viewport](@@viewport@@). It has a width and a height along with offset coordinates
			// in case you don't want it to start in the top left corner of the canvas
			var viewport = Viewports.addViewport("Main", Gb.canvas.width-40, Gb.canvas.height-40, 20, 20);
			
			// Set the [layers](@@layer@@) this [viewport](@@viewport@@) will have
			viewport.addLayer("Back");
			viewport.addLayer("Middle");
			viewport.addLayer("Front");

			viewport.setStroke(3, "#00FF00");

			var mini = Viewports.addViewport("Mini", Gb.canvas.width/3, Gb.canvas.height - 20, Gb.canvas.width/2 + 57, 10);
			
			// Scale the [viewport](@@viewport@@) so it can show all the [world](@@world@@) 
			World.scaleViewportToFit(mini);

			mini.addLayer("Front");
			mini.setStroke(3, "#FF0000");

			Gb.setViewportShortCut('MainBack', [{viewport:'Main', layer:'Back'}]);
			Gb.setViewportShortCut('MainMiddle', [{viewport:'Main', layer:'Middle'}]);
			Gb.setViewportShortCut('MainFront', [{viewport:'Main', layer:'Front'}]);
			Gb.setViewportShortCut('MainMiniFront', [{viewport:'Mini', layer:'Front'}, {viewport:'Main', layer:'Front'}]);
			Gb.setViewportShortCut('MiniFront', [{viewport:'Mini', layer:'Front'}]);
		},

		destroy: function() {
			Groups.removeGroup("First");
			Groups.removeGroup("Second");
			Groups.removeGroup("Third");

			Viewports.removeViewport('Main');
			Viewports.removeViewport('Mini');

			Gb.removeViewportShortCut('MainBack');
			Gb.removeViewportShortCut('MainMiddle');
			Gb.removeViewportShortCut('MainFront');
			Gb.removeViewportShortCut('MainMiniFront');
			Gb.removeViewportShortCut('MiniFront');
		}
	});

	return BasicLayerSetup;
});