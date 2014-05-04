/**
 * # cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from: [delegate](@@delegate@@)
 * 
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a common interface for objects that behaive like a cache.
 */

/**
 * Cache Interface
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var ErrorPrinter = require('error-printer');

	var Cache = require('delegate').extend({
		init: function() {
			this._super();

			this.cacheObject = {};
		},

		/**
		 * <p style='color:#AD071D'><strong>name</strong></p>
		 *
		 * All childs of this module must implement this method. Arguments may vary
		 */
		name: function() {
			ErrorPrinter.mustOverrideError('Cache');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>cache</strong></p>
		 *
		 * All childs of this module must implement this method. Arguments may vary
		 */
		cache: function() {
			ErrorPrinter.mustOverrideError('Cache');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>get</strong></p>
		 *
		 * @param  {String} id Id of the object to retrieve
		 *
		 * @return {Object}    Cached object
		 */
		get: function(id) {
			return this.cacheObject[id];
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
			return Object.keys(this.cacheObject).length;
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
			this.execute(this.CLEAR, this.cacheObject[id]);
			delete this.cacheObject[id];
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>clearAll</strong></p>
		 *
		 * Clears everything in the cache
		 */
		clearAll: function() {
			for(var k in this.cacheObject) {
				delete this.cacheObject[k];
			}

			this.execute(this.CLEAR_ALL);
		},

		/**
		 * <p style='color:#AD071D'><strong>toString</strong></p>
		 *
		 * String representation of the cache
		 */
		toString: function() {
			var r = {}

			r['name'] = this.name();
			r['count'] = this.cacheObject.keys().length;
			r['objects'] = [];
			
			for(var k in this.cacheObject) r['objects'].push(k);

			return JSON.stringify(r, null, 2);
		}
		/**
		 * --------------------------------
		 */
	});

	// ### Getters for all the types of events a cache can hook into
	Object.defineProperty(Cache.prototype, "CACHE", { get: function() { return 'cache'; } }); 
	Object.defineProperty(Cache.prototype, "CLEAR", { get: function() { return 'clear'; } });
	Object.defineProperty(Cache.prototype, "CLEAR_ALL", { get: function() { return 'clear_all'; } });
	/**
	 * --------------------------------
	 */

	return Cache;
});