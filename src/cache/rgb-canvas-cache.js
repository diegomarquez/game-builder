/**
 * # rgb-canvas-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [cache](@@cache@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is used to separate an image into it's r red, green and blue components. Once the new images are created they are cached
 * and can be used to generate a tinted version of the original.
 */

/**
 * RGB Image Cache
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var ImageCache = require('cache')
		.extend({
			/**
			 * <p style='color:#AD071D'><strong>name</strong></p>
			 *
			 * @return {String} The name of the cache
			 */
			name: function() {
				return 'Rgb Canvas Cache';
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>cache</strong></p>
			 *
			 * @param {String} id Used to retrive the set of generated images later
			 * @param {Drawable} source The source image from which to generate red, green and blue version from
			 */
			cache: function(id, source) {
				if (this.cacheObject[id]) {
					return;
				}

				this.cacheObject[id] = [null, null, null, null];

				var w = source.width;
				var h = source.height;

				var sourceCanvas = document.createElement("canvas");

				sourceCanvas.width = w;
				sourceCanvas.height = h;

				var sourceContext = sourceCanvas.getContext("2d");
				sourceContext.drawImage(source, 0, 0);

				var pixels = sourceContext.getImageData(0, 0, w, h)
					.data;

				// 4 is used to ask for 3 images: red, green, blue and black in that order.
				for (var rgbI = 0; rgbI < 4; rgbI++) {
					var canvas = document.createElement("canvas");

					canvas.width = w;
					canvas.height = h;

					var context = canvas.getContext('2d');
					context.drawImage(sourceCanvas, 0, 0);

					var to = context.getImageData(0, 0, w, h);
					var toData = to.data;
					var len = pixels.length;

					for (var i = 0; i < len; i += 4) {
						toData[i] = (rgbI === 0) ? pixels[i] : 0;
						toData[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
						toData[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
						toData[i + 3] = pixels[i + 3];
					}

					context.putImageData(to, 0, 0);

					this.cacheObject[id][rgbI] = canvas;
				}

				this.execute(this.CACHE, this.cacheObject[id]);
			},
			/**
			 * --------------------------------
			 */
		});

	return new ImageCache();
});
