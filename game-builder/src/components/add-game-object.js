/**
 * # add-gameobject.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html)
 *
 * Depends of:
 * [gb](http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * A [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) to encapsulate the logic needed to add a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to the world
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
		 * Called by the parent [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) when
		 * it is started
		 *
		 * @param {Object} parent [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) using this component
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
		 * Called by the parent [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
		 * when it is sent back to it's pool for reuse.
		 *
		 * @param {Object} parent [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) using this component
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
