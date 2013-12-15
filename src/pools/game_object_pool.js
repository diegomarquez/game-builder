define(['pool'], function(Pool) {

	var getComponentDescription = function(id, args) {
		return {
			componentId: id,
			args: args
		}
	}

	var GameObjectPool = Pool.extend({
		createConfiguration: function(alias, type) {
			var configuration = {
				type: type,
				hardArguments: null,
				childs: [],
				components: [],
				renderer: null,

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

		getConfiguration: function(alias) {
			var configuration = this.getConfigurationObject(alias);

			if (this.pools[configuration.type].length <= 0) {
				throw new Error('Game Object with type: ' + configuration.type + ' is not available');
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