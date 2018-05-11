/**
 * # image-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [cache](@@cache@@)
 *
 * Depends of:
 * [asset-preloader](@@asset-preloader@@)
 * [util](@@util@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module takes care of creating [HTMLImageElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
 * to load image data. Each image is saved under a key, if the same image is requested again, it can be re used instead of
 * creating a new one and loading it again.
 *
 * The [HTMLImageElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) are never attached to the DOM, so they are
 * not visible. The purpose of this cache is to have the data available to draw it on a [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawSystemFocusRing())
 */

/**
 * Cache Images
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var assetPreloader = require('asset-preloader');

	var ImageCache = require('cache')
		.extend({
			/**
			 * <p style='color:#AD071D'><strong>name</strong></p>
			 *
			 * @return {String} The name of the cache
			 */
			name: function() {
				return 'Image Cache';
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>cache</strong></p>
			 *
			 * @param {String} id Path to the image asset to load, can be a local or remote url
			 */
			cache: function(path) {
				if (this.cacheObject[path]) {
					return;
				}

				var cachedImage = assetPreloader.getCachedImage(path);

				if (cachedImage) {
					this.cacheObject[path] = cachedImage;

					this.execute(this.CACHE, this.cacheObject[path]);
				} else {
					var image = document.createElement('img');

					image.crossOrigin = 'Anonymous';

					if (window.location.protocol === 'file:') {
						image.src = 'http://localhost:5000/' + path;
					} else {
						image.src = path;
					}

					this.cacheObject[path] = image;

					this.execute(this.CACHE, this.cacheObject[path]);
				}
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>cache</strong></p>
			 *
			 * @param {String} path Path to the image asset to to create frames from
			 * @param {Number} frameWidth
			 * @param {Number} frameHeight
			 * @param {Number|null} frameCount If this is not passed, the method will try to figure out the framecount, assuming frames are squares. If they are not, it will make a wrong guess
			 * @param {Function} done This callback is executed when all the frames have been generated and receives the frame count as argument
			 */
			cacheStrip: function(path, frameWidth, frameHeight, frameCount, done) {
				if (this.cacheObject[path]) {
					if (require('util')
						.isArray(this.cacheObject[path])) {
						this.cacheObject[path].push(done);
						return;
					} else {
						done(this.cacheObject[path]);
					}
				}

				this.cacheObject[path] = [];
				this.cacheObject[path].push(done);

				var self = this;

				var onLoad = function(image) {
					var count = frameCount || (image.width / image.height);

					for (var i = 0; i < count; i++) {
						var canvas = document.createElement('canvas');

						canvas.width = frameWidth;
						canvas.height = frameHeight;

						canvas.getContext('2d')
							.mozImageSmoothingEnabled = false;
						canvas.getContext('2d')
							.imageSmoothingEnabled = false;

						canvas.getContext('2d')
							.drawImage(image, frameWidth * i, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

						self.cacheObject[path + '_' + i] = canvas;
					}

					self.execute(self.CACHE, self.cacheObject[path]);

					for (var i = 0; i < self.cacheObject[path].length; i++) {
						self.cacheObject[path][i](count);
					}

					self.cacheObject[path] = count;
				};

				var cachedImage = assetPreloader.getCachedImage(path);

				if (cachedImage) {
					onLoad(cachedImage);
				} else {
					var image = document.createElement('img');

					image.crossOrigin = 'Anonymous';

					var onLoadWrapper = function(event) {
						event.target.removeEventListener('load', onLoadWrapper);

						onLoad(event.target);
					};

					image.addEventListener('load', onLoadWrapper);

					if (window.location.protocol === 'file:') {
						image.src = 'http://localhost:5000/' + path;
					} else {
						image.src = path;
					}
				}
			}
			/**
			 * --------------------------------
			 */
		});

	return new ImageCache();
});
