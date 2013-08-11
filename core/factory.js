define(function() {
	var Factory = function() {
		this.objectPools = {};
		this.componentsPool = {};
		this.renderersPool = {};

		this.configurations = {};
		this.componentConfigurations = {};
	}

	var createPool = function(pool, alias, type, amount) {
		if (pool[alias] == null) {
			pool[alias] = [];
		}

		for (var i = 0; i < amount; i++) {
			var o = new type();

			o.poolId = alias;

			pool[alias].push(o);
		}
	};

	Factory.prototype.createGameObjectPool = function(alias, type, amount) {
		createPool(this.objectPools, alias, type, amount);
	};

	Factory.prototype.createComponentPool = function(alias, type, amount) {
		createPool(this.componentsPool, alias, type, amount);
	};

	Factory.prototype.createRendererPool = function(alias, type, amount) {
		createPool(this.renderersPool, alias, type, amount);
	};

	Factory.prototype.returnGameObjectToPool = function(gameObject) {
		if (!gameObject.poolId) return;
		this.objectPools[gameObject.poolId].push(gameObject);
	};

	Factory.prototype.returnComponentToPool = function(component) {
		if (!component.poolId) return;
		this.componentsPool[component.poolId].push(component);
	};

	Factory.prototype.returnRendererToPool = function(renderer) {
		if (!renderer || !renderer.poolId) return;
		this.renderersPool[renderer.poolId].push(renderer);
	};

	Factory.prototype.createGameObjectConfiguration = function(typeAlias, type) {
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

		this.configurations[typeAlias] = configuration;

		return configuration;
	};

	Factory.prototype.createComponentConfiguration = function(componentAlias, componentId) {
		var configuration = {
			componentId: componentId,
			componentArgs: null,
			renderer: null,

			args: function(args) {
				this.componentArgs = args;
				return this;
			},
			setRenderer: function(rendererId, args) {
				this.renderer = {
					id: rendererId,
					args: args
				};
				return this;
			}
		}

		this.componentConfigurations[componentAlias] = configuration;

		return configuration;
	};

	//This method only return an instance. It is up to the user to call the reset method with arguments.
	Factory.prototype.get = function(name, args) {
		var configuration = this.configurations[name];

		//Do nothing if there is no object available in the pool I am looking in
		if (this.objectPools[configuration.type].length <= 0) {
			throw new Error('Game Object with type: ' + configuration.type + ' is not available, can not create Game Object');
		}

		//Get one object from the pool
		var pooledObject = this.objectPools[configuration.type].pop();

		//Reset some internal properties of the game_object before actually using it.
		pooledObject.reset();

		//This sets unchanging arguments (hard), specified on the configuration object.
		//If available the specific configuration object overrides the generic one.
		if (args) {
			pooledObject.configure(args);
		} else {
			pooledObject.configure(configuration.hardArguments);
		}

		//Set it's name
		pooledObject.typeId = name;

		//Adding all the components configured for this object type	
		for (var i = 0; i < configuration.components.length; i++) {
			var componentConfiguration = this.componentConfigurations[configuration.components[i].componentId];

			//If any of the components can not be fetched, abort the creation of the whole game_object
			if (this.componentsPool[componentConfiguration.componentId].length <= 0) {
				throw new Error('Component with id: ' + componentConfiguration.componentId + ' is not available, can not create Game Object with id: ' + configuration.type);
			}

			var component = this.componentsPool[componentConfiguration.componentId].pop();

			//Configures the component as stated by the configuration object.
			//If available the specific configuration object overrides the generic one.
			if (configuration.components[i].componentArgs) {
				component.configure(configuration.components[i].componentArgs);
			} else {
				component.configure(componentConfiguration.args);
			}

			//Adding renderer to the component
			component.renderer = this.renderersPool[componentConfiguration.renderer.id];
			component.renderer.start(componentConfiguration.renderer.args);

			component.on('recycle', this, function(c) {
				this.returnComponentToPool(c);
				this.returnRendererToPool(c.renderer);
			}, true);

			//This component will return to it's respective pool when destroyed
			pooledObject.addComponent(component);
		}

		//Adding nested childs configured for this object
		for (var i = 0; i < configuration.childs.length; i++) {
			var childId = configuration.childs[i].childId;

			if (!pooledObject.add) {
				throw new Error('Game Object with type: ' + configuration.type + ' is not a container, can not add childs to it');
			}

			pooledObject.add(this.get(childId, configuration.childs[i].args));
		}

		//Adding renderer to the game_object
		pooledObject.renderer = this.renderersPool[configuration.renderer.id];
		pooledObject.renderer.start(configuration.renderer.args);

		pooledObject.on('recycle', this, function(go) {
			this.returnGameObjectToPool(go);
			this.returnRendererToPool(go.renderer);
		}, true);

		return pooledObject;
	};

	Factory.prototype.toString = function() {
		var totalGameObjectCount = 0;
		for (var k in this.objectPools) {
			totalGameObjectCount += this.objectPools[k].length
		}

		var totalComponentCount = 0;
		for (var k in this.componentsPool) {
			totalComponentCount += this.componentsPool[k].length
		}

		var r = {
			objectTypeCount: Object.keys(this.objectPools).length,
			componentTypeCount: Object.keys(this.componentsPool).length,

			totalGameObjectCount: totalGameObjectCount,
			totalComponentCount: totalComponentCount
		}

		return JSON.stringify(r, null, 2);
	}

	return new Factory();
});