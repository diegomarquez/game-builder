/**
 * # basic-layer-setup.js
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
 * This module defines an extension that adds a bunch of [layer](@@layer@@) objects to the 
 * [layers](@@layers@@) object. If you need more layers you can create a different extension
 * that defines all the layers you want to use.
 */

/**
 * Define layers
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["layers", "gb", "extension"], function(Layers, Gb, Extension) {
	var BasicLayerSetup = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			Layers.add("Back");
			Layers.add("Middle");
			Layers.add("Front");
			Layers.add("Text");
		}
	});

	return BasicLayerSetup;
});