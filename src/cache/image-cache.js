/**
 * # image-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: [cache](@@cache@@)
 * 
 * Depends of:
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
	var ImageCache = require('cache').extend({
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
		 * @param  {String} id     Path to the image asset to load, can be a local or remote url
		 */
		cache: function(path) {
			if (this.cacheObject[path]) {
				return;
			}

			var image = document.createElement('img');
			
			image.src = path;
		
			this.cacheObject[path] = image;

			this.execute(this.CACHE, this.cacheObject[path]);
		}
		/**
		 * --------------------------------
		 */
		
	});

	return new ImageCache();
});