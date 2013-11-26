define(['game_object_pool', 'component_pool', 'util'], function(GameObjectPool, ComponentPool, Util) {
	var Assembler = function() {};

	//This method only return an instance. It is up to the user to call the start method with arguments.
	Assembler.prototype.get = function(name, args) {
		var configuration = GameObjectPool.getConfiguration(name);

		//Get one object from the pool
		var pooledObject = GameObjectPool.getPooledObject(configuration.type);

		//Reset some internal properties of the game_object before actually using it.
		pooledObject.reset();

		//Merge arguments from configuration the the ones specific to this call
		pooledObject.configure( Util.shallow_merge(configuration.hardArguments, args) );

		//Set it's name
		pooledObject.typeId = name;

		//Adding all the components configured for this object type	
		for (var i = 0; i < configuration.components.length; i++) {
			var componentConfiguration = ComponentPool.getConfiguration(configuration.components[i].componentId);
			var component = ComponentPool.getPooledObject(componentConfiguration.componentId);

			//Merge arguments from type configuration with the ones in the specific component, if any
			component.configure( Util.shallow_merge(componentConfiguration.componentArgs, configuration.components[i].args) );

			//When this object is 'recycled' it returns to it's respective pool
			component.on('recycle', this, function(c) {
				ComponentPool.returnToPool(c);
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

		//Adding renderer
		var rendererConfiguration = ComponentPool.getConfiguration(configuration.renderer.id);

		//No renderer on this Game Object? Do nothing.
		if(rendererConfiguration) {
			pooledObject.renderer = ComponentPool.getPooledObject(rendererConfiguration.componentId);
			pooledObject.renderer.parent = pooledObject;

			//Merge arguments from type configuration with the ones in the specific component, if any
			pooledObject.renderer.configure( Util.shallow_merge(rendererConfiguration.componentArgs, configuration.renderer.args) );

			//When this object is 'recycled' it returns to it's respective pool
			pooledObject.renderer.on('recycle', this, function(c) {
				ComponentPool.returnToPool(c);
			}, true);		
		}

		//When this object is 'recycled' it returns to it's respective pool
		pooledObject.on('recycle', this, function(go) {
			GameObjectPool.returnToPool(go);
		}, true);

		return pooledObject;
	};

	return new Assembler();
});