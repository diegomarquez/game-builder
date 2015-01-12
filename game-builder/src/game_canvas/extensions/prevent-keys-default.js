/**
 * # prevent-keys-default.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [extension](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/extensions/extension.html)
 *
 * Depends of: 
 * [keyboard](http://diegomarquez.github.io/game-builder/game-builder-docs/src/input/keyboard.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This extension prevents the default keyboard behaviour of all the keys defined in the [keyboard](http://diegomarquez.github.io/game-builder/game-builder-docs/src/input/keyboard.html) module.
 *
 * Most of the times you won't want the browser default key behaviour when playing a game, if you do, it is always possible 
 * to not know this extension, or to make another extension that blocks only some keys.
 */

/**
 * Prevent Keys Behaviour
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["extension", "gb", "keyboard"], function(Extension, Gb, Keyboard) {

	var PreventKeysDefault = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/game.html)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			Keyboard.config({
				skipDefaultBehaviour: [
					Keyboard.LEFT,
					Keyboard.UP,
					Keyboard.RIGHT,
					Keyboard.DOWN,
					Keyboard.CTRL,
					Keyboard.ALT,
					Keyboard.ESC,
					Keyboard.SPACE,
					Keyboard.NUM_0,
					Keyboard.NUM_1,
					Keyboard.NUM_2,
					Keyboard.NUM_3,
					Keyboard.NUM_4,
					Keyboard.NUM_5				
				]	
			});
		},

		destroy: function() {
			Keyboard.config({
				skipDefaultBehaviour: []
			});
		}
	});

	return PreventKeysDefault;
});


