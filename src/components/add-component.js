/**
 * # add-component.js
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
 * A [component](@@component@@) to encapsulate the logic needed to add a [component](@@component@@) to
 * the parnet [game-object](@@game-object@@) when it executes a delegate.
 */

/**
 * Add components to game objects
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

			this.componentId = "";
			this.parentEvent = "";
			this.executeOnce = true;
			this.componentArgs = null;

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

			this.componentId = "";
			this.parentEvent = "";
			this.executeOnce = true;
			this.componentArgs = null;
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
			if (!this.componentId) {
				ErrorPrinter.missingArgumentError("AddComponent", "componentId");
			}

			if (!this.parentEvent) {
				ErrorPrinter.missingArgumentError("AddComponent", "parentEvent");
			}

			if (this.executeOnce) {
				parent.once(this.parentEvent, this, function() {
					this.gb.addComponentTo(this.parent, this.componentId, this.componentArgs);
				}, "add-component-delegate");
			} else {
				parent.on(this.parentEvent, this, function() {
					this.gb.addComponentTo(this.parent, this.componentId, this.componentArgs);
				}, false, false, false, "add-component-delegate");
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
			parent.levelCleanUp("add-component-delegate");
		}
		/**
		 * --------------------------------
		 */
	});

	return AddComponent;
});
