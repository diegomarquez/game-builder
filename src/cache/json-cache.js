/**
 * # json-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: [cache](@@cache@@)
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
	var JSONCache = require('cache').extend({
		/**
		 * <p style='color:#AD071D'><strong>name</strong></p>
		 *
		 * @return {String} The name of the cache
		 */
		name: function() {
			return 'JSON Cache';
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>parse</strong></p>
		 *
		 * @param  {String} id     Id to retrived the cached object later
		 * @param  {String} string A JSON string
		 */
		parse: function(id, string) {
			this.cacheObject[id] = JSON.parse(string);
			this.execute(this.CACHE, this.cacheObject[id]);
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
			this.cacheObject[id] = object;
			this.execute(this.CACHE, this.cacheObject[id]);
		}
		/**
		 * --------------------------------
		 */
	});

	return new JSONCache();
});