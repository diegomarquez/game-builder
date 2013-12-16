define(function(require) {
	var util = require("util");

	var Pool = Class.extend({
		init: function() {
			this.pools = {};
			this.configurations = {};
			this.active = {};
		},

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

		createPooledObject: function(alias) {
			var pool = this.pools[alias];
			
			// Create the object and send it to the pool
			var o = new pool.type();
			o.poolId = alias;		

			pool.objects.push(o);
		},

		addObjectToPool: function(configurationId) {
			// Loop through all available configurations
			for(k in this.configurations) {
				// Find the configuration that matches the one I am trying to create an object for
				if (k == configurationId) {
					// Add a pooled object
					this.createPooledObject( this.configurations[k].typeId() );			
				}
			}
		},

		getPoolSize: function(alias) {
			this.pools[alias].objects.length;
		},

		getActiveObjects: function(alias) {
			return this.active[alias];
		},

		getAllActiveObjects: function() {
			return this.active;
		},

		returnToPool: function(o) {
			if (!o.poolId) return;
			this.pools[o.poolId].objects.push(o);
			this.active[o.poolId].splice(this.active[o.poolId].indexOf(o), 1);
		},

		getName: function() {
			throw new Error('Pool: This method must be overriden');
		},

		addInitialObjectsToPool: function(amount) {
			throw new Error('Pool: This method must be overriden');
		},		

		createConfiguration: function(alias, type) {
			throw new Error('Pool: This method must be overriden');
		},

		getConfiguration: function(name) {
			throw new Error('Pool: This method must be overriden');
		},

		getPooledObject: function(type) {
			var o = this.pools[type].objects.pop()
			this.active[type].push(o);
			return o;
		},

		clear: function() {
			var k;

			for(k in this.pools) {
				var pool = this.pools[k].objects

				while (pool.length > 0){
					util.destroyObject(pool.pop());
				}
			}

			for(k in this.configurations) {
				util.destroyObject(this.configurations[k]);
			}

			this.pools = {};
			this.configurations = {};
			this.active = {};	
		},

		toString: function() {
			var total = 0;
			for (var k in this.pools) {
				total += this.pools[k].objects.length
			}

			var r = {
				name: this.getName(),
				objectTypeCount: Object.keys(this.pools).length,
				total: total,
			}

			return JSON.stringify(r, null, 2);
		}
	});

	return Pool;
});