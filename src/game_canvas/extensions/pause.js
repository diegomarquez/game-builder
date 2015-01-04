/**
 * # pause.js
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
 * This module defines an extension that uses [groups](@@groups@@) to halt all update activity
 * when the application looses focus.
 *
 * It also uses [viewports](@@viewports@@) to check if there were any [layers](@@layer@@) already hiding before pausing.
 * The extension needs to check that so that things that were hiding before pausing, remain hiding after resuming.
 * 
 * The extension also adds a **pause** method to [game](@@game@@) to be able to pause the application
 * manually.
 *
 * This Extension adds an event [game](@@game@@) can hook into: 
 *
 * ### **PAUSE** 
 * When the application is paused manually
 * 
 * ``` javascript  
 * game.on(game.PAUSE, function() {});
 * ```
 */

/**
 * Pause activity
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["groups", "viewports", "gb", "extension"], function(Groups, Viewports, Gb, Extension) {
	var game = Gb.game;

	var Pause = Extension.extend({
		type: function() {
			// Notice the use of the constant BLUR defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return game.BLUR;
		},

		execute: function() {
			for (var k in Groups.groups) { 
				Groups.groups[k].drawAlreadyStopped = !Groups.groups[k].canDraw;
				Groups.groups[k].updateAlreadyStopped = !Groups.groups[k].canUpdate;
			}

			var viewports = Viewports.all();

			for (var v in viewports) {
				for (var l in v.layers) {
					l.alreadyHidden = !l.isVisible();					
				}
			}

			Groups.all('stop', 'update');
		}
	});

	Object.defineProperty(game.prototype, "PAUSE", { get: function() { return 'pause'; } });

	game.pause = function() {
		if(game.blurAction()) {
			game.execute(game.PAUSE);
			window.removeEventListener("blur", game.blurAction);
			window.removeEventListener("focus", game.focusAction);	
		}
	}

	return Pause;
});