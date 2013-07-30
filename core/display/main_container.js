define(function() {
	var MainContainer = function() {
		this.mainObjects = [];

		this.objectPools = {};
		this.componentsPool = {};

		this.configurations = {};
		this.componentConfigurations = {};

		return this;
	};

	MainContainer.PUSH = "push";
	MainContainer.UNSHIFT = "unshift";
	MainContainer.CALL = "call";
	MainContainer.APPLY = "apply";

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

	MainContainer.prototype.createTypePool = function(alias, type, amount) {
		createPool(this.objectPools, alias, type, amount);
	};

	MainContainer.prototype.createComponentPool = function(alias, type, amount) {
		createPool(this.componentsPool, alias, type, amount);
	};

	MainContainer.prototype.setDefaultLayer = function(layerIndex) {
		this.defaultLayer = layerIndex;
		return this;
	};

	MainContainer.prototype.createObjectConfiguration = function(typeAlias, type) {
		var configuration = {
			type: type,
			layerIndex: this.defaultLayer,
			mode: "push",
			initCall: "apply",
			hardArguments: null,
			doNotDestroy: false,
			activeOnSoftPause: false,
			components: null,

			addMode: function(aMode) {
				this.mode = aMode;
				return this;
			},
			init: function(iCall) {
				this.initCall = iCall;
				return this;
			},
			args: function(args) {
				this.hardArguments = args;
				return this;
			},
			saveOnReset: function() {
				this.doNotDestroy = true;
				return this;
			},
			layer: function(offset) {
				this.layerIndex += offset;
				return this;
			},
			activeSoftPause: function() {
				this.activeOnSoftPause = true;
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

	MainContainer.prototype.createComponentConfiguration = function(componentAlias, componentId, componentArguments) {
		this.componentConfigurations[componentAlias] = {
			componentId: componentId,
			args: componentArguments
		};
	};

	MainContainer.prototype.add = function(name, args) {
		var configuration = this.configurations[name];

		//Create drawing layer if it doesn't exist
		if (this.mainObjects[configuration.layerIndex] == null) {
			this.mainObjects[configuration.layerIndex] = [];
		}

		//Do nothing if there is no object available in the pool I am looking in
		if (this.objectPools[configuration.type].length <= 0) {
			throw new Error('Game Object with type:' + configuration.type + ' is not available, can not create Game Object');
		}

		//Get one object from the pool
		var pooledObject = this.objectPools[configuration.type].pop();

		//Putting back all the components back in the pool
		if(pooledObject.components) {
			while(pooledObject.components.length) {
				var component = pooledObject.components.pop();
				this.componentsPool[component.poolId].push(component);
			}
		}

		pooledObject.typeId = name;

		//This sets if the object should keep updating during a soft pause.
		pooledObject.activeOnSoftPause = configuration.activeOnSoftPause;

		//Add it to its rendering layer. To the end or the beggining of the list, depending of the configuration
		this.mainObjects[configuration.layerIndex][configuration.mode](pooledObject);

		//This sets unchanging arguments (hard), specified on the configuration object.
		var hardArguments = configuration.hardArguments;
		if (hardArguments) {
			for (var ha in hardArguments) {
				pooledObject[ha] = hardArguments[ha];
			}
		}

		//Initialize it with given arguments. Arguments are passes as a single object or a list depending on configuration. Look up APPLY and CALL
		pooledObject.reset[configuration.initCall](pooledObject, args);

		//Adding all the components configured for this object type	
		for(var i=0; i<configuration.components.length; i++) {
			var componentConfiguration = this.componentConfigurations[configuration.components[i]];

			var component = this.componentsPool[componentConfiguration.componentId].pop();

			//If any of the components can not be fetched, abort the creation of the whole game_object
			if(!component) {
				throw new Error('Component with id:' + componentConfiguration.componentId + ' is not available, can not create Game Object');
			}

			//Configures the component as stated by the configuration object
			if (componentConfiguration.args) {
				for (var ha in componentConfiguration.args) {
					component[ha] = componentConfiguration.args[ha];
				}
			}

			pooledObject.addComponent(component);
		}

		return pooledObject;
	};

	MainContainer.prototype.update = function(delta, updateConfiguredOnly) {
		var i, j, a;

		for (i = 0; i < this.mainObjects.length; i++) {
			a = this.mainObjects[i];

			if (a != null) {
				for (j = a.length - 1; j >= 0; j--) {
					var object = a[j];

					if (object.alive) {

						if (updateConfiguredOnly && !object.activeOnSoftPause) continue;

						if (object.parent) continue;

						debugger;

						object.update(delta);

						if(!object.components) continue;

						for(var k=0; k<object.components.length; k++){
							object.components[k].update();
						}
						
					} else {

						object.clear();

						this.objectPools[object.poolId].push(object);

						a.splice(j, 1);
						object = null;
					}
				}
			}
		}
	};

	MainContainer.prototype.draw = function(context) {
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		for (var i = this.mainObjects.length - 1; i >= 0; i--) {
			var a = this.mainObjects[i];

			if (a != null) {
				for (var j = 0; j < a.length; j++) {
					var object = a[j];

					if (object.parent) continue;

					if (object.alive) {
						object.transformAndDraw(context, true);
					}
				}
			}
		}
	};

	return new MainContainer();
});