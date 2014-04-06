/**
 * # image-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: 
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
define(function() {
	var cache = {};

	var ImageCache = function() {};

	/**
	 * <p style='color:#AD071D'><strong>cache</strong></p>
	 *
	 * @param  {String} id     Path to the image asset to load, can be a local or remote url
	 */
	ImageCache.prototype.cache = function(path) {
		if (cache[path]) {
			return;
		}

		var image = document.createElement('img');
		
		image.src = path;
	
		cache[path] = image;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * @param  {String} id Path used to retrieve a cached [HTMLImageElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	 *
	 * @return {Object}    Cached [HTMLImageElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	 */
	ImageCache.prototype.get = function(path) {
		return cache[path];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clear</strong></p>
	 *
	 * @param  {String} id Path to the [HTMLImageElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) to clear from the cache
	 */
	ImageCache.prototype.clear = function(path) {
		delete cache[path];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearAll</strong></p>
	 */
	ImageCache.prototype.clearAll = function() {
		for(var k in cache) {
			delete cache[k];
		}
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>toString</strong></p>
	 *
	 * String representation of the cache
	 */
	ImageCache.prototype.toString = function() {
		var r = {}

		r['cachedImages'] = cache.keys().length;
		r['images'] = [];
		

		for(var k in cache) {
			r['images'].push(k);			
		}

		return JSON.stringify(r, null, 2);
	};
	/**
	 * --------------------------------
	 */

	return new ImageCache();
});