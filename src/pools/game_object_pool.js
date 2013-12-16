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
					self.addObjectToPool(childId);

					this.childs.push({
						childId: childId,
						args: args
					});
					return this;
				},
				addComponent: function(componentId, args) {
					self.componentPool.addObjectToPool(componentId);

					this.components.push(getComponentDescription(componentId, args));
					return this;
				},
				setRenderer: function(rendererId, args) {
					self.componentPool.addObjectToPool(rendererId);

					this.renderer = getComponentDescription(rendererId, args);
					return this;
				},
				getComponentIds: function() {
					var ids = [];

					for(var i=0; i<this.components.length; i++){
						ids.push(this.components[i].componentId);
					}

					if(this.renderer) {
						ids.push(this.renderer.componentId);	
					}

					return ids;
				}
			};

			this.configurations[alias] = configuration;

			return configuration;
		},

		getName: function() {
			return 'Game Object Pool';
		},

		addInitialObjectsToPool: function(amount, alias) {
			// If provided the amount of objects to add to the pool.
			if(!amount) return;

			for (var i = 0; i < amount; i++) {
				this.createPooledObject(alias);
			}	
		},

		getComponentUseCount: function(componentId) {
			var componentUseCount = 0;

			for(k in this.configurations) {
				var configuration = this.configurations[k];
				var componentsIds = configuration.getComponentIds();

				for(var j=0; j<componentsIds.length; j++) {
					if (componentId == componentsIds[j]) {
						componentUseCount++;
					}
				}
			}

			return componentUseCount;
		},

		getConfiguration: function(alias) {
			var configuration = this.getConfigurationObject(alias);

			if (this.pools[configuration.type].objects.length <= 0) {
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

	var self = new GameObjectPool();

	return self;
});