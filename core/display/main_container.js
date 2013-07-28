define(function() {
	var MainContainer = function() {
		this.mainObjects = [];

		this.objectPools = {};
		this.configurations = {};

		return this;
	};

	MainContainer.PUSH = "push";
	MainContainer.UNSHIFT = "unshift";
	MainContainer.CALL = "call";
	MainContainer.APPLY = "apply";

	MainContainer.prototype.createTypePool = function(alias, type, amount) {
		if (this.objectPools[alias] == null) {
			this.objectPools[alias] = [];
		}

		for (var i = 0; i < amount; i++) {
			var o = new type();

			o.poolId = alias;

			this.objectPools[alias].push(o);
		}
	};

	MainContainer.prototype.setDefaultLayer = function(layerIndex) {
		this.defaultLayer = layerIndex;
		return this;
	};

	MainContainer.prototype.createTypeConfiguration = function(typeAlias, type) {
		var configuration = {
			type: type,
			layerIndex: this.defaultLayer,
			collisionType: "",
			mode: "push",
			initCall: "apply",
			hardArguments: null,
			doNotDestroy: false,
			activeOnSoftPause: false,

			collisionId: function(cType) {
				this.collisionType = cType;
				return this;
			},
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
			}
		};

		this.configurations[typeAlias] = configuration;

		return configuration;
	};

	MainContainer.prototype.add = function(name, args) {
		var configuration = this.configurations[name];

		//var collisionType = configuration.collisionType;

		//Create drawing layer if it doesn't exist
		if (this.mainObjects[configuration.layerIndex] == null) {
			this.mainObjects[configuration.layerIndex] = [];
		}

		//Do nothing if there is no object available in the pool I am looking in
		if (this.objectPools[configuration.type].length <= 0) {
			return null;
		}

		//Get one object from the pool
		var pooledObject = this.objectPools[configuration.type].pop();

		pooledObject.typeId = name;

		//This id will be used for collision detection groups
		//pooledObject.collisionId = collisionType;

		//This sets if the object will check for collisions or not
		//pooledObject.checkingCollisions = (collisionType != "");

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

						object.update(delta);

						if(!object.components) continue;

						for(var i=0; i<object.components.length; i++){
							object.components.update();
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