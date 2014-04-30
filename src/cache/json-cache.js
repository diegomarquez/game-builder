/**
 * # json-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: [delegate](@@delegate@@)
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
define(function(require) {
	var cache = {};

	JSONCache = require('delegate').extend({
		init: function() {
			this._super();
		},

		/**
		 * <p style='color:#AD071D'><strong>parse</strong></p>
		 *
		 * @param  {String} id     Id to retrived the cached object later
		 * @param  {String} string A JSON string
		 */
		parse: function(id, string) {
			cache[id] = JSON.parse(string);
			this.execute(this.CACHE, cache[id]);
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>cache</strong></p>
		 *
		 * @param  {String} id     Id to retrived the cached object later
		 * @param  {Object} object Object to cache
		 */
		cache: function(id, object) {
			cache[id] = object;
			this.execute(this.CACHE, cache[id]);
		},
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
		get: function(id) {
			return cache[id];
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>getTotalCount</strong></p>
		 *
		 * @return {Number}    Total amount of objects in the cache
		 */
		getTotalCount: function() {
			return Object.keys(cache).length;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * @param  {String} id Id of the cached object to remove
		 */
		clear: function(id) {
			this.execute(this.CLEAR, cache[id]);
			delete cache[id];
		},
		/**
		 * --------------------------------
		 */
		
		clearAll: function() {
			for(var k in cache) {
				delete cache[k];
			}

			this.execute(this.CLEAR_ALL);
		}
	});

	// ### Getters for all the types of events the JSON cache can  hook into
	Object.defineProperty(JSONCache.prototype, "CACHE", { get: function() { return 'cache'; } }); 
	Object.defineProperty(JSONCache.prototype, "CLEAR", { get: function() { return 'clear'; } });
	Object.defineProperty(JSONCache.prototype, "CLEAR_ALL", { get: function() { return 'clear_all'; } });
	/**
	 * --------------------------------
	 */

	return new JSONCache();
});