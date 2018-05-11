/**
 * # add-gameobject.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [component](@@component@@)
 *
 * Depends of:
 * [gb](@@gb@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * A [component](@@component@@) to encapsulate the logic needed to add a [game-object](@@game-object@@) to the world
 */

/**
 * Add Game Objects
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["component", "gb", "error-printer"], function(Component, Gb, ErrorPrinter) {

	var AddComponent = Component.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.goId = "";
			this.parentEvent = "";
			this.executeOnce = true;
			this.group = "";
			this.viewports = null;
			this.goArgs = null;

			this.gb = Gb;

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

			this.goId = "";
			this.parentEvent = "";
			this.executeOnce = true;
			this.group = "";
			this.viewports = null;
			this.goArgs = null;
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
			if (!this.goId) {
				ErrorPrinter.missingArgumentError("AddGameObject", "goId");
			}

			if (!this.parentEvent) {
				ErrorPrinter.missingArgumentError("AddGameObject", "parentEvent");
			}

			if (!this.group) {
				ErrorPrinter.missingArgumentError("AddGameObject", "group");
			}

			if (!this.viewports) {
				ErrorPrinter.missingArgumentError("AddGameObject", "viewports");
			}

			if (this.executeOnce) {
				parent.once(this.parentEvent, this, function() {
					this.gb.create(this.goId, this.group, this.viewports, this.goArgs);
				}, "add-game-object-delegate");
			} else {
				parent.on(this.parentEvent, this, function() {
					this.gb.create(this.goId, this.group, this.viewports, this.goArgs);
				}, false, false, false, "add-game-object-delegate");
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
			parent.levelCleanUp("add-game-object-delegate");
		}
		/**
		 * --------------------------------
		 */
	});

	return AddComponent;
});
