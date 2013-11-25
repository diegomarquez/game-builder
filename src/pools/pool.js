define(["require", "class"], function(require) {

	Utils = require("util");

	var Pool = Class.extend({
		init: function() {
			this.pools = {};
			this.configurations = {};
			this.active = {};
		},

		createPool: function(alias, type, amount) {
			if (this.pools[alias] == null) {
				this.pools[alias] = [];
			}

			if (this.active[alias] == null) {
				this.active[alias] = [];
			}

			for (var i = 0; i < amount; i++) {
				var o = new type();

				o.poolId = alias;

				this.pools[alias].push(o);
			}
		},

		getActiveObjects: function(alias) {
			return this.active[alias];
		},

		getAllActiveObjects: function() {
			return this.active;
		},

		returnToPool: function(o) {
			if (!o.poolId) return;
			this.pools[o.poolId].push(o);
			this.active[o.poolId].splice(this.active[o.poolId].indexOf(o), 1);
		},

		createConfiguration: function(alias, type) {
			throw new Error('Pool: This method should be overriden');
		},

		getConfiguration: function(name) {
			throw new Error('Pool: This method should be overriden');
		},

		getPooledObject: function(type) {
			var o = this.pools[type].pop()
			this.active[type].push(o);
			return o;
		},

		clear: function() {
			var k;

			for(k in this.pools) {
				var pool = this.pools[k]

				while (pool.length > 0){
					Utils.destroyObject(pool.pop());
				}
			}

			for(k in this.configurations) {
				Utils.destroyObject(this.configurations[k]);
			}

			this.pools = {};
			this.configurations = {};
			this.active = {};	
		},

		toString: function() {
			var total = 0;
			for (var k in this.pools) {
				total += this.pools[k].length
			}

			var r = {
				objectTypeCount: Object.keys(this.pools).length,
				total: total,
			}

			return JSON.stringify(r, null, 2);
		}
	});

	return Pool;
});