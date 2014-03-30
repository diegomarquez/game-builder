/**
 * # path-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: 
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
 * The module will cache dynamically generated [canvases](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). a given canvas could
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
define(function() {
	var cache = {};

	var PathCache = function() {};

	/**
	 * <p style='color:#AD071D'><strong>cache</strong></p>
	 *
	 * @param  {String} id Id that will be used to retrieve the cached canvas
	 */
	PathCache.prototype.cache = function(id, width, height, drawingFunction) {
		var canvas = cache[id];

		if (!canvas) {
			canvas = document.createElement('canvas');
		}

		canvas.width = width;
		canvas.height = height;

		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawingFunction(context);
		cache[id] = canvas;
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>draw</strong></p>
	 *
	 * This method does not clear the cached [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
	 * it just draws more things into it
	 * 
	 * @param  {String} id Id of a cached [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to draw to
	 */
	PathCache.prototype.draw = function(id, drawingFunction) {
		var canvas = cache[id];

		if (!canvas) {
			return;
		}
		
		drawingFunction(canvas.getContext('2d'));
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * @param  {String} id Id of a cached [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
	 *
	 * @return {Object}    Cached [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
	 */
	PathCache.prototype.get = function(id) {
		return cache[id];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clear</strong></p>
	 *
	 * @param  {String} id Id of [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to remove from cache
	 */
	PathCache.prototype.clear = function(id) {
		delete cache[id];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearAll</strong></p>
	 */
	PathCache.prototype.clearAll = function() {
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
	PathCache.prototype.toString = function() {
		var r = {}

		r['cachedPaths'] = cache.keys().length;
		r['paths'] = [];
		

		for(var k in cache) {
			r['paths'].push(k);			
		}

		return JSON.stringify(r, null, 2);
	};
	/**
	 * --------------------------------
	 */

	return new PathCache();
});