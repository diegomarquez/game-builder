/**
 * # resume.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](@@extension@@)
 *
 * Depends of: 
 * [layers](@@layers@@)
 * [gb](@@gb@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an extension that uses [layers](@@layers@@) to resume all update activity
 * when the application gains focus.
 */

/**
 * Resume activity
 * --------------------------------
 */

/**
 * --------------------------------
 */

define(["layers", "gb", "extension"], function(Layers, Gb, Extension) {
	var Resume = Extension.extend({
		type: function() {
			// Notice the use of the constant FOCUS defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.FOCUS;
		},

		execute: function() {
			Layers.all('resume', 'update');

			for (var k in Layers.layers) { 
				if (Layers.layers[k].drawAlreadyStopped) {
					Layers.stop_draw(k);			
				} 
				if (Layers.layers[k].updateAlreadyStopped) {
					Layers.stop_update(k);
				}

				Layers.layers[k].drawAlreadyStopped = false;
				Layers.layers[k].updateAlreadyStopped = false;
			}
		}
	});

	return Resume;
});