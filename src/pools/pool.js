/**
 * # pool.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [class](@@class@@)
 *
 * Depends of: [util](@@util@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 *
 */

/**
 * Pooling
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["util", "class"], function(util) {
	var Pool = Class.extend({
		init: function() {
			this.pools = {};
			this.configurations = {};
			this.active = {};
		},

		/**
		 * <p style='color:#AD071D'><strong>createPool</strong></p>
		 *
		 * @param  {[type]} alias  [description]
		 * @param  {[type]} type   [description]
		 * @param  {[type]} amount [description]
		 *
		 * @return {[type]}        [description]
		 */
		createPool: function(alias, type, amount) {
			// A pool object contains an array of objects, and a variable 
			// of the type of the objects it contains.
			if (this.pools[alias] == null) {
				this.pools[alias] = {
					objects: [],
					type: type
				};
			}

			// Objects that are active on a given pool at any given time.
			if (this.active[alias] == null) {
				this.active[alias] = [];
			}

			this.addInitialObjectsToPool(amount, alias);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>createPooledObject</strong></p>
		 *
		 * @param  {[type]} alias [description]
		 *
		 * @return {[type]}       [description]
		 */
		createPooledObject: function(alias) {
			var pool = this.pools[alias];
			
			var o = new pool.type();
			o.poolId = alias;		

			pool.objects.push(o);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getPoolSize</strong></p>
		 *
		 * @param  {[type]} alias [description]
		 *
		 * @return {[type]}       [description]
		 */
		getPoolSize: function(alias) {
			this.pools[alias].objects.length;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getActiveObjects</strong></p>
		 *
		 * @param  {[type]} alias [description]
		 *
		 * @return {[type]}       [description]
		 */
		getActiveObjects: function(alias) {
			return this.active[alias];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getAllActiveObjects</strong></p>
		 *
		 * @return {[type]} [description]
		 */
		getAllActiveObjects: function() {
			return this.active;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>returnToPool</strong></p>
		 *
		 * @param  {[type]} o [description]
		 *
		 * @return {[type]}   [description]
		 */
		returnToPool: function(o) {
			if (!o.poolId) return;
			this.pools[o.poolId].objects.push(o);
			this.active[o.poolId].splice(this.active[o.poolId].indexOf(o), 1);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getName</strong></p>
		 *
		 * @return {[type]} [description]
		 */
		getName: function() {
			throw new Error('Pool: This method must be overriden');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addInitialObjectsToPool</strong></p>
		 *
		 * @param {[type]} amount [description]
		 */
		addInitialObjectsToPool: function(amount) {
			throw new Error('Pool: This method must be overriden');
		},
		/**
		 * --------------------------------
		 */		

		/**
		 * <p style='color:#AD071D'><strong>createConfiguration</strong></p>
		 *
		 * @param  {[type]} alias [description]
		 * @param  {[type]} type  [description]
		 *
		 * @return {[type]}       [description]
		 */
		createConfiguration: function(alias, type) {
			throw new Error('Pool: This method must be overriden');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getConfiguration</strong></p>
		 *
		 * @param  {[type]} name       [description]
		 * @param  {[type]} nestedCall [description]
		 *
		 * @return {[type]}            [description]
		 */
		getConfiguration: function(name, nestedCall) {
			throw new Error('Pool: This method must be overriden');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>createNewIfNeeded</strong></p>
		 *
		 * @param  {[type]} type [description]
		 *
		 * @return {[type]}      [description]
		 */
		createNewIfNeeded: function(type) {
			if(!this.pools[type].maxAmount) {
				this.createPooledObject(type);
				return true;
			}

			return false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getPooledObject</strong></p>
		 *
		 * @param  {[type]} type [description]
		 *
		 * @return {[type]}      [description]
		 */
		getPooledObject: function(type) {
			var o = this.pools[type].objects.pop();
			this.active[type].push(o);
			return o;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * @return {[type]} [description]
		 */
		clear: function() {
			var k;

			for(k in this.pools) {
				var pool = this.pools[k].objects;

				while (pool.length > 0){
					util.destroyObject(pool.pop());
				}
			}

			for(k in this.active) {
				var active = this.active[k];

				while (active.length > 0){
					util.destroyObject(active.pop());
				}
			}

			for(k in this.configurations) {
				util.destroyObject(this.configurations[k]);
			}

			this.pools = {};
			this.configurations = {};
			this.active = {};	
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>toString</strong></p>
		 *
		 * @return {[type]} [description]
		 */
		toString: function() {
			var r = {
				name: this.getName()
			}

			var total = 0;

			for (var k in this.pools) {
				r[k] = {
					pooled: this.pools[k].objects.length,
					active: this.active[k].length,
					total: this.pools[k].objects.length + this.active[k].length
				}

				total += r[k].total;
			}

			r['total'] = total;

			return JSON.stringify(r, null, 2);
		}
		/**
		 * --------------------------------
		 */
	});

	return Pool;
});