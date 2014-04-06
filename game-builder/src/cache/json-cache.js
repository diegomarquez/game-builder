/**
 * # json-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: 
 * 
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module takes care of parsing json strings and caching the result so they are easily injectable into other modules.
 *
 * It can also be used to cache regular objects.
 */

/**
 * Cache JSON and other Objects
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {
	var cache = {};

	var JSONCache = function() {};

	/**
	 * <p style='color:#AD071D'><strong>parse</strong></p>
	 *
	 * @param  {String} id     Id to retrived the cached object later
	 * @param  {String} string A JSON string
	 */
	JSONCache.prototype.parse = function(id, string) {
		cache[id] = JSON.parse(string);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>cache</strong></p>
	 *
	 * @param  {String} id     Id to retrived the cached object later
	 * @param  {Object} object Object to cache
	 */
	JSONCache.prototype.cache = function(id, object) {
		cache[id] = object;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * @param  {String} id Id of the object to retrieve
	 *
	 * @return {Object}    Cached JSON object
	 */
	JSONCache.prototype.get = function(id) {
		return cache[id];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clear</strong></p>
	 *
	 * @param  {String} id Id of the cached object to remove
	 */
	JSONCache.prototype.clear = function(id) {
		delete cache[id];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearAll</strong></p>
	 */
	JSONCache.prototype.clearAll = function() {
		for(var k in cache) {
			delete cache[k];
		}
	};
	/**
	 * --------------------------------
	 */

	return new JSONCache();
});