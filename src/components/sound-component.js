/**
 * # sound-component.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [component](@@component@@)
 *
 * Depends of:
 * [sound-player](@@sound-player@@)
 * [error-printer](@@error-printer@@)
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * A [component](@@component@@) to encapsulate the logic needed to play a sound when the 
 * parent [game-object](@@game-object@@) executes a delegate.
 */

/**
 * Play sounds on game objects
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["component", "sound-player", "error-printer"], function(Component, SoundPlayer, ErrorPrinter) {

	var SoundComponent = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.soundId = "";
			this.parentEvent = "";
			this.playMode = "";

			this.soundPlayer = SoundPlayer;

			this.reset();
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>reset</strong></p>
		 *
		 * Reset for re-use
		 */
		reset: function() {
			this._super();

			this.soundId = "";
			this.parentEvent = "";
			this.playMode = "";
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Called by the parent [game-object](@@game-object@@) when
		 * it is started
		 *
		 * @param  {Object} parent [game-object](@@game-object@@) using this component 
		 */
		start: function(parent) {
			if (!this.soundId) {
				ErrorPrinter.missingArgumentError("SoundComponent", "soundId");
			}

			if (!this.parentEvent) {
				ErrorPrinter.missingArgumentError("SoundComponent", "parentEvent");
			}

			if (!this.playMode) {
				ErrorPrinter.missingArgumentError("SoundComponent", "playMode");
			}

			parent.on(this.parentEvent, this, function() {

				if (this.playMode === "single") {
					this.soundPlayer.playSingle(this.soundId);
					return;
				}

				if (this.playMode === "single-buffer") {
					this.soundPlayer.playSingleBuffer(this.soundId);
					return;
				}

				if (this.playMode === "loop") {
					this.soundPlayer.playLoop(this.soundId);
					return;
				}

			}, false, false, false, "sound-player-delegate");
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>recycle</strong></p>
		 *
		 * Called by the parent [game-object](@@game-object@@) 
		 * when it is sent back to it's pool for reuse.
		 *
		 * @param  {Object} parent [game-object](@@game-object@@) using this component
		 */
		recycle: function(parent) {
			parent.levelCleanUp("sound-player-delegate");
		}
		/**
		 * --------------------------------
		 */
	});

	return SoundComponent;
});