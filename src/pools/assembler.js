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

	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * The only method in the module. It returns a [game-object](@@game-object@@)
	 * ready to be started.
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
	/**
	 * --------------------------------
	 */

	return new Assembler();
});