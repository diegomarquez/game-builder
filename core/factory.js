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
	};

	Factory.prototype.createGameObjectConfiguration = function(typeAlias, type) {
		var configuration = {
			type: type,
			hardArguments: null,
			childs: [],
			components: [],

			args: function(args) {
				this.hardArguments = args;
				return this;
			},
			addChild: function(childId) {
				this.childs.push(childId);
				return this;
			},
			addComponent: function(componentId) {
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
	Factory.prototype.get = function(name) {
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
		pooledObject.configure(configuration.hardArguments);

		//Set it's name
		pooledObject.typeId = name;

		//Adding all the components configured for this object type	
		for(var i=0; i<configuration.components.length; i++) {
			var componentConfiguration = this.componentConfigurations[configuration.components[i]];

			//If any of the components can not be fetched, abort the creation of the whole game_object
			if(this.componentsPool[componentConfiguration.componentId].length <= 0) {
				throw new Error('Component with id: ' + componentConfiguration.componentId + ' is not available, can not create Game Object with id: ' + configuration.type);
			}

			var component = this.componentsPool[componentConfiguration.componentId].pop();

			//Configures the component as stated by the configuration object
			component.configure(componentConfiguration.args);

			//This component will return to it's respective pool when destroyed
			pooledObject.addComponent(component);
		}

		//Adding nested childs configured for this object
		for(var i=0; i<configuration.childs.length; i++) {
			var childId = configuration.childs[i];

			if(!pooledObject.add) {
				throw new Error('Game Object with type: ' + configuration.type + ' is not a container, can not add childs to it');	
			}

			pooledObject.add(this.get(childId));
		}

		return pooledObject;
	};

	Factory.prototype.toString = function() {
		
		var totalGameObjectCount = 0;
		for(var k in this.objectPools) {
			totalGameObjectCount += this.objectPools[k].length
		}

		var totalComponentCount = 0;
		for(var k in this.componentsPool) {
			totalComponentCount += this.componentsPool[k].length
		}

		var r = {
			object: this.objectPools,
			component: this.componentsPool,

			objectTypeCount: Object.keys(this.objectPools).length,
			componentTypeCount: Object.keys(this.componentsPool).length,

			totalGameObjectCount: totalGameObjectCount,
			totalComponentCount: totalComponentCount
		}

		return JSON.stringify(r, null, 2);	
	}

	return new Factory();
});