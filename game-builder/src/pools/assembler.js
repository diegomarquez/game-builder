define(['game-object-pool', 'component-pool', 'util'], function(GameObjectPool, ComponentPool, Util) {
	var Assembler = function() {};

	var addComponent = function(component, pooledObject, addMethod) {
		var config = ComponentPool.getConfiguration(component.componentId);

		// If there is no configuration, do nothing.
		if(!config) return;

		// Getting the requested component from the corresponding pool.
		var componentIntance = ComponentPool.getPooledObject(config.componentId);

		//Merge arguments from type configuration with the ones in the specific component, if any.
		componentIntance.configure( Util.shallow_merge(config.componentArgs, component.args) );

		//When a component is 'recycled' it returns to it's respective pool
		componentIntance.on('recycle', this, function(c) {
			ComponentPool.returnToPool(c);
		}, true);

		// Sending the component to whoever is going to use it
		pooledObject[addMethod](componentIntance); 
	}

	//This method only return an instance. It is up to the user to call the start method with arguments.
	Assembler.prototype.get = function(name, args, nestedCall) {
		var configuration = GameObjectPool.getConfiguration(name, nestedCall);

		//Get one object from the pool
		var pooledObject = GameObjectPool.getPooledObject(configuration.type);
		//Reset some internal properties of the game-object before actually using it.
		pooledObject.reset();
		//Merge arguments from configuration the the ones specific to this call
		pooledObject.configure( Util.shallow_merge(configuration.hardArguments, args) );

		//Set object typeId, this is very useful to identify game objects in the middle of the spaghetti mist.
		pooledObject.typeId = name;

		//Adding all the components configured for this object type	
		for (var i = 0; i < configuration.components.length; i++) {
			addComponent.call(this, configuration.components[i], pooledObject, 'addComponent');
		}

		//Adding nested childs configured for this object
		for (var i = 0; i < configuration.childs.length; i++) {
			var childId = configuration.childs[i].childId;

			if (!pooledObject.add) {
				throw new Error('Game Object with type: ' + configuration.type + ' is not a container, can not add childs to it');
			}

			pooledObject.add(this.get(childId, configuration.childs[i].args, true));
		}

		//Adding the renderer configured for this object type		
		addComponent.call(this, configuration.renderer, pooledObject, 'setRenderer');

		//When this object is 'recycled' it returns to it's respective pool
		pooledObject.on('recycle', this, function(go) {
			GameObjectPool.returnToPool(go);
		}, true);

		return pooledObject;
	};

	return new Assembler();
});