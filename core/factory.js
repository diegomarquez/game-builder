define(function(){
	var Factory = function() {
		this.objectPools = {};
		this.componentsPool = {};

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

	Factory.prototype.returnGameObjectToPool = function(gameObject) {
		if(!gameObject.poolId) return;

		this.objectPools[gameObject.poolId].push(gameObject);
	}

	Factory.prototype.createGameObjectConfiguration = function(typeAlias, type) {
		var configuration = {
			type: type,
			hardArguments: null,
			components: null,

			init: function(iCall) {
				this.initCall = iCall;
				return this;
			},
			args: function(args) {
				this.hardArguments = args;
				return this;
			},
			addComponent: function(componentId) {
				if(!this.components) {
					this.components = [];
				}

				this.components.push(componentId);

				return this;
			}
		};

		this.configurations[typeAlias] = configuration;

		return configuration;
	};

	Factory.prototype.createComponentPool = function(alias, type, amount) {
		createPool(this.componentsPool, alias, type, amount);
	};

	Factory.prototype.createComponentConfiguration = function(componentAlias, componentId, componentArguments) {
		this.componentConfigurations[componentAlias] = {
			componentId: componentId,
			args: componentArguments
		};
	};

	Factory.prototype.returnComponentToPool = function(component) {
		if(!component.poolId) return;

		this.componentsPool[component.poolId].push(component);
	}

	//This method only return an instance. It is up to the user to call the reset method with arguments.
	Factory.prototype.get = function(name, args) {
		var configuration = this.configurations[name];

		//Do nothing if there is no object available in the pool I am looking in
		if (this.objectPools[configuration.type].length <= 0) {
			throw new Error('Game Object with type: ' + configuration.type + ' is not available, can not create Game Object');
		}

		//Get one object from the pool
		var pooledObject = this.objectPools[configuration.type].pop();

		//Putting back all the components of the previous form of this game_object back into their respective pools
		pooledObject.removeAllComponents();		

		//This sets unchanging arguments (hard), specified on the configuration object.
		pooledObject.configure(configuration.hardArguments);

		//Set it's name
		pooledObject.typeId = name;

		//This tells a game_object it should put itself back into it's respective pool when it is destroyed
		pooledObject.returnToPool = true;

		//Adding all the components configured for this object type	
		for(var i=0; i<configuration.components.length; i++) {
			var componentConfiguration = this.componentConfigurations[configuration.components[i]];

			//If any of the components can not be fetched, abort the creation of the whole game_object
			if(!this.componentsPool[componentConfiguration.componentId].length <= 0) {
				throw new Error('Component with id: ' + componentConfiguration.componentId + ' is not available, can not create Game Object with id: ' + configuration.type);
			}

			var component = this.componentsPool[componentConfiguration.componentId].pop();

			//Configures the component as stated by the configuration object
			component.configure(componentConfiguration.args);

			//This component will return to it's respective pool when destroyed
			pooledObject.addComponent(component, true);
		}

		return pooledObject;
	};

	return new Factory();
});

