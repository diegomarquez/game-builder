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
 * --------------------------------
 */
define(function() {
	var cache = {};

	var ImageCache = function() {};

	/**
	 * <p style='color:#AD071D'><strong>cache</strong></p>
	 *
	 * @param  {String} id     Path to the image to load, can be a local or remote url
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
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * @param  {String} id Path used to load an image
	 *
	 * @return {Object}    Cached [HTMLImageElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	 */
	ImageCache.prototype.get = function(id) {
		return cache[id];
	};

	/**
	 * <p style='color:#AD071D'><strong>clear</strong></p>
	 *
	 * @param  {String} id Path of image to clear from cache
	 */
	ImageCache.prototype.clear = function(id) {
		delete cache[id];
	};

	/**
	 * <p style='color:#AD071D'><strong>clearAll</strong></p>
	 */
	ImageCache.prototype.clearAll = function() {
		for(var k in cache) {
			delete cache[k];
		}
	};

	return new ImageCache();
});