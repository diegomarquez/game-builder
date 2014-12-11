/**
 * # assembler.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [game-object-pool](@@game-object-pool@@)
 * [component-pool](@@component-pool@@)
 * [util](@@util@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines a very important module for [Game-Builder](http://diegomarquez.github.io/game-builder).
 *
 * The assembler module takes care of putting together the [game-objects](@@game-object@@) with their
 * [components](@@component@@) as they were configured in the [game-object-pool](@@game-object-pool@@)
 * and [component-pool](@@component-pool@@) respectively. 
 *
 * In addition you are able to override the configured arguments, or add new ones when you
 * request a [game-object](@@game-object@@). When a [game-object](@@game-object@@) is
 * put together the necessary callbacks are setup so that it and it's components return to their
 * respective pools for reuse when they are no longer needed.
 *
 * The object responsible for recycling [game-objects](@@game-object@@) is [reclaimer](@@reclaimer@@).
 */

/**
 * ASSEMBLE!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game-object-pool', 'component-pool', 'util', 'error-printer'], function(GameObjectPool, ComponentPool, Util, ErrorPrinter) {
	var Assembler = function() {};

	var uidCounter = -1;

	var getUid = function() {
		uidCounter++;
		return uidCounter.toString();
	}

	var getComponent = function(componentId, args) {
		var config = ComponentPool.getConfiguration(componentId);

		// If there is no configuration, do nothing.
		if(!config) return;

		// Getting the requested component from the corresponding pool.
		var pooledComponent = ComponentPool.getPooledObject(config.componentId);

		// Reset some internal properties of the component before actually using it.
		pooledComponent.reset();
		// Assign a uid to the component, useful to precisly identify it, assuming you know the id
		pooledComponent.uid = getUid();
		// Set component typeId, this is very useful to identify game objects in the middle of the spaghetti mist.
		pooledComponent.typeId = componentId;
		// Merge arguments from type configuration with the ones in the specific component, if any.
		pooledComponent.configure( Util.shallow_merge(config.componentArgs, args) );
		
		// When a component is 'recycled' it returns to it's respective pool
		pooledComponent.on(pooledComponent.RECYCLE, this, function(c) {
			ComponentPool.returnToPool(c);
		}, true); 

		return pooledComponent;
	}

	var addComponent = function(component, pooledObject, addMethod) {
		// Get a component
		var pooledComponent = getComponent(component.componentId, component.args);
		// Sending the component to whoever is going to use it
		pooledObject[addMethod](pooledComponent); 
	}

	var assemble = function(name, args, nestedCall, createNew) {
		var configuration = GameObjectPool.getConfiguration(name, nestedCall, createNew);

		// Get one object from the pool
		var pooledObject = GameObjectPool.getPooledObject(configuration.type);
		
		// Reset some internal properties of the game-object before actually using it.
		pooledObject.reset();
		// Assign a uid to the game object, useful to precisly identify it, assuming you know the id
		pooledObject.uid = getUid();
		// Set object typeId, this is very useful to identify game objects in the middle of the spaghetti mist.
		pooledObject.typeId = name;
		// Merge arguments from configuration the the ones specific to this call
		pooledObject.configure( Util.shallow_merge(configuration.hardArguments, args) );

		// Adding all the components configured for this object type	
		for (var i = 0; i < configuration.components.length; i++) {
			addComponent.call(this, configuration.components[i], pooledObject, 'addComponent');
		}

		// Adding nested childs configured for this object
		for (var i = 0; i < configuration.childs.length; i++) {
			var childId = configuration.childs[i].childId;

			if (!pooledObject.add) {
				ErrorPrinter.printError('Assembler', 'Game Object with type: ' + configuration.type + ' is not a container, can not add childs to it')
			}

			pooledObject.add(this.get(childId, configuration.childs[i].args, true));
		}

		// Adding the renderer configured for this object type		
		if (configuration.renderer) {
			addComponent.call(this, configuration.renderer, pooledObject, 'setRenderer');
		}

		// When this object is 'recycled' it returns to it's respective pool
		pooledObject.on(pooledObject.RECYCLE, this, function(go) {
			GameObjectPool.returnToPool(go);
		}, true);

		return pooledObject;
	}

	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * It returns a [game-object](@@game-object@@) ready to be started.
	 * 
	 * @param  {String} name       Id of the [game-object](@@game-object@@) we want assembled. It should be an existing configured id on the [game-object-pool](@@game-object-pool@@)
	 * @param  {Object} [args=null]       All the properties in this object will be copied to the assembled object. 
	 * @param  {Boolean} [nestedCall=false] This argument is reserved for internal use. It defaults to false, but you can see what happens if you set it to true :P   
	 * 
	 * @throws {Error} If a [game-object](@@game-object@@) was configured to have childs. Only [game-object-containers](@@game-object-container@@) can have nested childs
	 * 
	 * @return {Object} A [game-object](@@game-object@@) ready to be used
	 */
	Assembler.prototype.get = function(name, args, nestedCall) {
		return assemble.call(this, name, args, nestedCall, false);
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>create</strong></p>
	 *
	 * It returns a [game-object](@@game-object@@) ready to be started. If the object is not available in the [game-object-pool](@@game-object-pool@@)
	 * it will be created every time.
	 * 
	 * @param  {String} name                Id of the [game-object](@@game-object@@) we want assembled. It should be an existing configured id on the [game-object-pool](@@game-object-pool@@)
	 * @param  {Object} [args=null]         All the properties in this object will be copied to the assembled object. 
	 * @param  {Boolean} [nestedCall=false] This argument is reserved for internal use. It defaults to false, but you can see what happens if you set it to true :P   
	 * 
	 * @throws {Error} If a [game-object](@@game-object@@) was configured to have childs. Only [game-object-containers](@@game-object-container@@) can have nested childs
	 * 
	 * @return {Object} A [game-object](@@game-object@@) ready to be used
	 */
	Assembler.prototype.create = function(name, args, nestedCall) {
		return assemble.call(this, name, args, nestedCall, true);
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>getComponent</strong></p>
	 *
	 * It returns a [component](@@component@@) ready to be started. If the object is not available in the [component-pool](@@component-pool@@)
	 * it will be created every time.
	 * 
	 * @param  {String} name       Id of the [component](@@component@@). It should be an existing configured id on the [component-pool](@@component-pool@@)
	 * @param  {Object} [args=null] All the properties in this object will be copied to the [component](@@component@@). 
	 * 
	 * @return {Object} A [component](@@component@@) ready to be used
	 */
	Assembler.prototype.getComponent = function(name, args) {
		return getComponent.call(this, name, args);
	};
	/**
	 * --------------------------------
	 */

	return new Assembler();
});