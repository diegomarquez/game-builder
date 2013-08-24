define(['class'], function() {

	var Pool = Class.extend({
		init: function() {
			this.pools = {};
			this.configurations = {};
		},

		createPool: function(alias, type, amount) {
			if (this.pools[alias] == null) {
				this.pools[alias] = [];
			}

			for (var i = 0; i < amount; i++) {
				var o = new type();

				o.poolId = alias;

				this.pools[alias].push(o);
			}
		},

		returnToPool: function(o) {
			if (!o.poolId) return;
			this.pools[o.poolId].push(o);
		},

		createConfiguration: function(alias, type) {
			throw new Error('This method should be overriden');
		},

		getConfiguration: function(name) {
			throw new Error('This method should be overriden');
		},

		getPooledObject: function(type) {
			return this.pools[type].pop();
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

	return new Pool();
});