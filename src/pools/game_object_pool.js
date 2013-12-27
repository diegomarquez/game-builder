define(function(require) {
	var getComponentDescription = function(id, args) {
		return {
			componentId: id,
			args: args
		}
	}

	var GameObjectPool = require('pool').extend({
		createConfiguration: function(alias, type) {
			var configuration = {
				type: type,
				hardArguments: null,
				childs: [],
				components: [],
				renderer: null,

				typeId: function() {
					return type;
				},

				args: function(args) {
					this.hardArguments = args;
					return this;
				},
				addChild: function(childId, args) {
					this.childs.push({
						childId: childId,
						args: args
					});
					return this;
				},
				addComponent: function(componentId, args) {
					this.components.push(getComponentDescription(componentId, args));
					return this;
				},
				setRenderer: function(rendererId, args) {
					this.renderer = getComponentDescription(rendererId, args);
					return this;
				}
			};

			this.configurations[alias] = configuration;

			return configuration;
		},

		getName: function() {
			return 'Game Object Pool';
		},

		addInitialObjectsToPool: function(amount, alias) {
			if(!amount) return;

			for (var i = 0; i < amount; i++) {
				this.createPooledObject(alias);
			}	
		},

		getConfiguration: function(alias, nestedCall) {
			var configuration = this.getConfigurationObject(alias);
			var pool = this.pools[configuration.type];

			if(!nestedCall && !pool.maxAmount) {
				throw new Error('Game Object with type: ' + configuration.type + ' does not have a value for maxAmount. It can not be requested explicitly');
			}

			if (pool.objects.length <= 0) {
				var ok = this.createNewIfNeeded(configuration.type);
				
				if(!ok) {
					throw new Error('Game Object with type: ' + configuration.type + ' is not available');
				}
			}

			return configuration;
		},

		getConfigurationObject: function(alias) {
			if(!alias) {
				throw new Error('Game Object Pool: ' + 'alias argument is: ' + alias);
			}

			return this.configurations[alias];
		}
	});

	return new GameObjectPool();
});