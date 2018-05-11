/**
 * # world.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module serves as an abstraction for the rectangle that defines the 2D world of the game. Useful to
 * have those values available to everyone, instead of hardcoded some where.
 */

/**
 * Game World
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate"], function(Delegate) {
	var World = Delegate.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>create</strong></p>
		 *
		 * @param {Number} w Width of the world
		 * @param {Number} h Height of the world
		 */
		create: function(w, h) {
			var width = w;
			var height = h;

			this.getWidth = function() {
				return width;
			};

			this.getHeight = function() {
				return height;
			};

			this.setWidth = function(v) {
				var prev = width;
				width = v;

				if (prev != v) {
					if (v > prev) {
						this.execute(this.CHANGE_WIDTH_INCREASE, v);
					} else {
						this.execute(this.CHANGE_WIDTH_DECREASE, v);
					}

					this.execute(this.CHANGE_WIDTH, v);

					this.execute(this.CHANGE);
				}
			};

			this.setHeight = function(v) {
				var prev = height;
				height = v;

				if (prev != v) {
					if (v > prev) {
						this.execute(this.CHANGE_HEIGHT_INCREASE, v);
					} else {
						this.execute(this.CHANGE_HEIGHT_DECREASE, v);
					}

					this.execute(this.CHANGE_HEIGHT, v);

					this.execute(this.CHANGE);
				}
			};
		},

		/**
		 * <p style='color:#AD071D'><strong>scaleViewportToFit</strong></p>
		 *
		 * Make the specified [viewport](@@viewport@@) scale so it can show all the world
		 *
		 * @param {Object} viewport The [viewport](@@viewport@@) to scale
		 */
		scaleViewportToFit: function(viewport) {
			viewport.ScaleX = 1;
			viewport.ScaleY = 1;

			viewport.ScaleX /= this.getWidth() / viewport.Width;
			viewport.ScaleY /= this.getHeight() / viewport.Height;

			viewport.WorldFit = true;

			this.execute(this.SCALE_TO_FIT, viewport);
			this.execute(this.SCALE, viewport);
		},

		/**
		 * <p style='color:#AD071D'><strong>resetViewportScale</strong></p>
		 *
		 * Reset the scale of the specified [viewport](@@viewport@@)
		 *
		 * @param {Object} viewport The [viewport](@@viewport@@) to scale
		 */
		resetViewportScale: function(viewport) {
			viewport.ScaleX = 1;
			viewport.ScaleY = 1;

			viewport.WorldFit = false;

			this.execute(this.RESET_SCALE, viewport);
			this.execute(this.SCALE, viewport);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>scaleViewportProportionaly</strong></p>
		 *
		 * Make the specified [viewport](@@viewport@@) scale by the specified factor
		 *
		 * @param {Object} viewport The [viewport](@@viewport@@) to scale
		 * @param {Number} factor Amount to scale by
		 */
		scaleViewportProportionaly: function(viewport, factor) {
			viewport.ScaleX = 1;
			viewport.ScaleY = 1;

			viewport.ScaleX *= factor;
			viewport.ScaleY *= factor;

			this.execute(this.SCALE_PROPORTIONALY, viewport);
			this.execute(this.SCALE, viewport);
		}
	});

	Object.defineProperty(World.prototype, "CHANGE", {
		get: function() {
			return 'change'
		}
	});
	Object.defineProperty(World.prototype, "CHANGE_WIDTH", {
		get: function() {
			return 'change_width'
		}
	});
	Object.defineProperty(World.prototype, "CHANGE_HEIGHT", {
		get: function() {
			return 'change_height'
		}
	});
	Object.defineProperty(World.prototype, "CHANGE_WIDTH_INCREASE", {
		get: function() {
			return 'change_width_increase'
		}
	});
	Object.defineProperty(World.prototype, "CHANGE_WIDTH_DECREASE", {
		get: function() {
			return 'change_width_decrease'
		}
	});
	Object.defineProperty(World.prototype, "CHANGE_HEIGHT_INCREASE", {
		get: function() {
			return 'change_height_increase'
		}
	});
	Object.defineProperty(World.prototype, "CHANGE_HEIGHT_DECREASE", {
		get: function() {
			return 'change_height_decrease'
		}
	});
	Object.defineProperty(World.prototype, "SCALE", {
		get: function() {
			return 'scale_viewport'
		}
	});
	Object.defineProperty(World.prototype, "SCALE_TO_FIT", {
		get: function() {
			return 'scale_to_fit'
		}
	});
	Object.defineProperty(World.prototype, "RESET_SCALE", {
		get: function() {
			return 'scale_to_fit'
		}
	});
	Object.defineProperty(World.prototype, "SCALE_PROPORTIONALY", {
		get: function() {
			return 'scale_proportionaly'
		}
	});

	return new World();
});
