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
			this.stopParentEvent = "";
			this.executeOnce = false;

			this.offScreenPlay = true;
			this.offScreenViewport = "Main";

			this.soundPlayer = SoundPlayer;

			this.soundUniqueId = "";

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
			this.stopParentEvent = "";
			this.executeOnce = false;
			this.soundUniqueId = "";

			this.offScreenPlay = true;
			this.offScreenViewport = "Main";
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
		 * @param {Object} parent [game-object](@@game-object@@) using this component
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

			if (this.executeOnce) {
				parent.once(this.parentEvent, this, function() {


					if (!this.offScreenPlay && !parent.getViewportVisibility(this.offScreenViewport)) {
						return;
					}

					if (this.playMode === "single") {
						this.soundUniqueId = this.soundPlayer.playSingle(this.soundId);
					} else if (this.playMode === "loop") {
						this.soundUniqueId = this.soundPlayer.playLoop(this.soundId);
					}
				}, false, false, false, "sound-player-delegate");

				if (this.stopParentEvent) {
					parent.once(this.stopParentEvent, this, function() {
						this.soundPlayer.stop(this.soundUniqueId);
					}, false, false, false, "sound-player-delegate");
				}
			} else {
				parent.on(this.parentEvent, this, function() {
					if (!this.offScreenPlay && !parent.getViewportVisibility(this.offScreenViewport)) {
						return;
					}

					if (this.playMode === "single") {
						this.soundUniqueId = this.soundPlayer.playSingle(this.soundId);
					} else if (this.playMode === "loop") {
						this.soundUniqueId = this.soundPlayer.playLoop(this.soundId);
					}
				}, false, false, false, "sound-player-delegate");

				if (this.stopParentEvent) {
					parent.on(this.stopParentEvent, this, function() {
						this.soundPlayer.stop(this.soundUniqueId);
					}, false, false, false, "sound-player-delegate");
				}
			}
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
		 * @param {Object} parent [game-object](@@game-object@@) using this component
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
