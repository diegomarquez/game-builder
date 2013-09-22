define(['pool'], function(Pool) {
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
					this.components.push({
						componentId: componentId,
						args: args
					});
					return this;
				},
				setRenderer: function(rendererId, args) {
					this.renderer = {
						id: rendererId,
						args: args
					};
					return this;
				}
			};

			this.configurations[alias] = configuration;

			return configuration;
		},

		getConfiguration: function(alias) {
			var configuration = this.configurations[alias];

			if (this.pools[configuration.type].length <= 0) {
				throw new Error('Game Object with type: ' + configuration.type + ' is not available');
			}

			return configuration;
		}
	});

	return new GameObjectPool();
});