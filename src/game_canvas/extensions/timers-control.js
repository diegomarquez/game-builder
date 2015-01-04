/**
 * # timers-control.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](@@extension@@)
 *
 * Depends of: 
 * [timer-factory](@@timer-factory@@)
 * [gb](@@gb@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This extension takes care of pausing and resuming all timers when the application is paused or resumed.
 */

/**
 * Control Timers
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["timer-factory", "gb", "extension"], function(TimerFactory, Gb, Extension) {
	var game = Gb.game;

	var TimersControl = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@)
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			game.on(game.BLUR, this, function() {
				// Add a _'alreadyPaused'_ property with a value of true to all timers
				// which are already paused
				TimerFactory.setProperty('alreadyPaused', true, function(timer, index, array){
					return timer.Paused;
				});

				// Pause all timers
				TimerFactory.pauseAll().now();
			});

			game.on(game.FOCUS, this, function() {
				// Resume all the timers which don't have an _'alreadyPaused'_ property
				TimerFactory.resumeAll().which(function(timer, index, array) {
					return !timer['alreadyPaused'];
				});

				// Set the _'alreadyPaused'_ property to null on all timers
				TimerFactory.setProperty('alreadyPaused', null, function(timer, index, array){
					return true;
				});
			});
		}
	});

	return TimersControl;
});