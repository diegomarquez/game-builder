/**
 * # pause.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/extensions/extension.html)
 *
 * Depends of: 
 * [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/layers.html)
 * [gb](http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an extension that uses [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/layers.html) to halt all update activity
 * when the application looses focus.
 */

/**
 * Pause activity
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["layers", "gb", "extension"], function(Layers, Gb, Extension) {
	var Pause = Extension.extend({
		type: function() {
			// Notice the use of the constant BLUR defined in [game](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/game.html)
			// to define this extension should be executed on creation.
			return Gb.game.BLUR;
		},

		execute: function() {
			for (var k in Layers.layers) { 
				Layers.layers[k].drawAlreadyStopped = !Layers.layers[k].canDraw;
				Layers.layers[k].updateAlreadyStopped = !Layers.layers[k].canUpdate;
			}

			Layers.all('stop', 'update');
		}
	});

	return Pause;
});