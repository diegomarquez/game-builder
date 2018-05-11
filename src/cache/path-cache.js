/**
 * # path-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [cache](@@cache@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module is very similar to [image-cache](@@image-cache@@), but instead of caching
 * [Images](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) it caches paths drawn to a
 * [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). Paths are quite taxing on the CPU, so drawing it once and then
 * keeping the rastered image can be a pretty good time saver.
 *
 * The module will cache dynamically generated [canvases](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). A given canvas could
 * then be used to draw onto it to cache a path for later use.
 *
 * A few downsides are:
 *
 * 1. If for whatever reason your path is going to change alot (ej. procedural animation), you are better not caching. Infact caching would
 * be detrimental in this case.
 * 2. A width and a height for the rectangle enclosing the drawing need to be specified. This is because there is no easy way of determining the
 * size of a path. A pretty small downside, but a downside non the less.
 */

/**
 * --------------------------------
 */
define(function(require) {
	var PathCache = require('cache')
		.extend({
			/**
			 * <p style='color:#AD071D'><strong>name</strong></p>
			 *
			 * @return {String} The name of the cache
			 */
			name: function() {
				return 'Path Cache';
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>cache</strong></p>
			 *
			 * @param {String} id Id that will be used to retrieve the cached canvas
			 * @param {Number} width Maximun width of the canvas to cache
			 * @param {Number} height Maximun Height of the canvas to cache
			 * @param {Function} drawingFunction Drawing commands to cache
			 */
			cache: function(id, width, height, drawingFunction) {
				var canvas = this.cacheObject[id];

				if (!canvas) {
					canvas = document.createElement('canvas');
				}

				canvas.width = width;
				canvas.height = height;

				var context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);
				drawingFunction(context);
				this.cacheObject[id] = canvas;

				this.execute(this.CACHE, this.cacheObject[id]);
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>draw</strong></p>
			 *
			 * This method does not clear the cached [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
			 * it just draws more things into it
			 *
			 * @param {String} id Id of a cached [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to draw to
			 * @param {Function} drawingFunction Drawing to add on top of the cached canvas
			 */
			draw: function(id, drawingFunction) {
				var canvas = this.cacheObject[id];

				if (!canvas) {
					return;
				}

				drawingFunction(canvas.getContext('2d'));

				this.execute(this.CACHE, this.cacheObject[id]);
			}
		});

	return new PathCache();
});
