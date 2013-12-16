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

			// Save the configuration
			this.configurations[alias] = configuration;

			// Get the current use count for this component type
			var currentUseCount = self.gameObjectPool.getComponentUseCount(alias);
			// Get the currently created component count
			var currentCreateCount = self.getPoolSize(type);
			// This is the actual amount of additional component objects that needs to be created.
			var difference = currentUseCount - currentCreateCount;
			// Add the missing amount of objects
			for(var i=0; i<difference; i++) {
				this.addObjectToPool(alias);	
			}
		
			return configuration;
		},

		getName: function() {
			return 'Component Pool';
		},

		addInitialObjectsToPool: function(amount, alias) {
			//Components are only created on demand
		},

		getConfiguration: function(alias) {
			var configuration = this.configurations[alias];

			if (this.pools[configuration.componentId].objects.length <= 0) {
				throw new Error('Component with id: ' + configuration.componentId + ' is not available');
			}

			return configuration;
		}
	});

	var self = new ComponentPool();

	return self;
});