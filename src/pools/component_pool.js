define(function(require) {
	var ComponentPool = require('pool').extend({
		createConfiguration: function(alias, type) {
			var configuration = {
				componentId: type,
				componentArgs: null,

				typeId: function() {
					return type;
				},

				args: function(args) {
					this.componentArgs = args;
					return this;
				}
			}

			this.configurations[alias] = configuration;
		
			return configuration;
		},

		getName: function() {
			return 'Component Pool';
		},

		addInitialObjectsToPool: function(amount, alias) {},

		getConfiguration: function(alias, nestedCall) {
			var configuration = this.configurations[alias];
			var pool = this.pools[configuration.componentId];

			if (pool.objects.length <= 0) {
				var ok = this.createNewIfNeeded(configuration.componentId);

				if(!ok) {
					throw new Error('Component with id: ' + configuration.componentId + ' is not available');
				}
			}

			return configuration;
		}
	});

	return new ComponentPool();
});