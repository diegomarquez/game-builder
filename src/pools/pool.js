define(["util", "class"], function(util) {
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
					type: type,
					maxAmount: amount
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
			
			var o = new pool.type();
			o.poolId = alias;		

			pool.objects.push(o);
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

		getConfiguration: function(name, nestedCall) {
			throw new Error('Pool: This method must be overriden');
		},

		createNewIfNeeded: function(type) {
			if(!this.pools[type].maxAmount) {
				this.createPooledObject(type);
				return true;
			}

			return false;
		},

		getPooledObject: function(type) {
			var o = this.pools[type].objects.pop();
			this.active[type].push(o);
			return o;
		},

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
	});

	return Pool;
});