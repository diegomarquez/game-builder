/**
 * # basic-display-setup.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/extensions/extension.html)
 *
 * Depends of: 
 * [groups](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/groups.html)
 * [viewports](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewports.html)
 * [gb](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/gb.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an extension that adds a bunch of [group](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/group.html) objects to the 
 * [groups](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/groups.html) object which control the update of [game-objects](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html). 
 * The [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) objects are also defined here through 
 * the [viewports](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewports.html) object, these objects control the rendering of [game-objects](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html).
 *
 * Also set here, are some shortcuts that are used when adding a [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to a [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
 * [layer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/layer.html). 
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
			// Notice the use of the constant CREATE defined in [game](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/game.html)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			// Configure the [world](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/world.html) object. 
			// For simplicity's sake it is the same size as the canvas
			World.create(Gb.canvas.width, Gb.canvas.height);

			// Set a few update [groups](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/group.html)
			Groups.add("First");
			Groups.add("Second");
			Groups.add("Third");

			// Create a [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html). It has a width and a height along with offset coordinates
			// in case you don't want it to start in the top left corner of the canvas
			var viewport = Viewports.add("Main", Gb.canvas.width, Gb.canvas.height, 0, 0);

			// Set the [layers](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/layer.html) this [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) will have
			viewport.addLayer("Back");
			viewport.addLayer("Middle");
			viewport.addLayer("Front");

			// Set a bunch of shortcuts for [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) + [layer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/layer.html) setups that will be used oftenly
			Gb.setViewportShortCut('MainBack', [{viewport:'Main', layer:'Back'}]);
			Gb.setViewportShortCut('MainMiddle', [{viewport:'Main', layer:'Middle'}]);
			Gb.setViewportShortCut('MainFront', [{viewport:'Main', layer:'Front'}]);
		}
	});

	return BasicLayerSetup;
});