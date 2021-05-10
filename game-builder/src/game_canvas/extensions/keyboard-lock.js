/**
 * # keyboard-lock.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [extension](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/extensions/extension.html)
 *
 * Depends of:
 * [keyboard](http://diegomarquez.github.io/game-builder/game-builder-docs/src/input/keyboard.html)
 * [gb](http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This extension blocks keyboard input when the application looses focus, and gives it back when focus is regained.
 * In the event of a manual pause, it blocks every key other than the key defines for pause in the [keyboard](http://diegomarquez.github.io/game-builder/game-builder-docs/src/input/keyboard.html)
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
			// Notice the use of the constant CREATE defined in [game](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/game.html)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			game.on(game.BLUR, this, function() {
				Keyboard.setBlock(true);
			}, false, false, false, 'keyboard-lock');

			game.on(game.FOCUS, this, function() {
				Keyboard.setBlock(false);
			}, false, false, false, 'keyboard-lock');

			game.on(game.PAUSE, this, function() {
				Keyboard.setBlock(true, whiteList);
			}, false, false, false, 'keyboard-lock');

			game.on(game.RESUME, this, function() {
				Keyboard.setBlock(false);
			}, false, false, false, 'keyboard-lock');
		},

		destroy: function() {
			game.levelCleanUp('keyboard-lock');
		}
	});

	return KeyboardLock;
});
