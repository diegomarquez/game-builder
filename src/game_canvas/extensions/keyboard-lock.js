/**
 * # keyboard-lock.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [extension](@@extension@@)
 *
 * Depends of: 
 * [keyboard](@@keyboard@@)
 * [gb](@@gb@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This extension blocks keyboard input when the application looses focus, and gives it back when focus is regained.
 * In the event of a manual pause, it blocks every key other than the key defines for pause in the [keyboard](@@keyboard@@) 
 * module.
 */

/**
 * Block Keys
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["keyboard", "gb", "extension"], function(Keyboard, Gb, Extension) {
	var game = Gb.game;

	var whiteList = [Keyboard.GAME_BUTTON_PAUSE];

	var KeyboardLock = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			game.on(game.BLUR, this, function() {
				Keyboard.setBlock(true);
			});

			game.on(game.FOCUS, this, function() {
				Keyboard.setBlock(false);
			});

			game.on(game.PAUSE, this, function() {
				Keyboard.setBlock(true, whiteList);
			});

			game.on(game.RESUME, this, function() {
				Keyboard.setBlock(false);
			});
		}
	});

	return KeyboardLock;
});