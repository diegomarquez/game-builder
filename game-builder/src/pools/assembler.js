/**
 * # assembler.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
 * [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a very important object for [Game-Builder](http://diegomarquez.github.io/game-builder).
 *
 * The assembler module takes care of putting together the [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) with their
 * [components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) as they were configured in the [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
 * and [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html) respectively.
 *
 * In addition you are able to override the configured arguments, or add new ones when you
 * request a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html). When a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) is
 * put together the necessary callbacks are setup so that it and it's components return to their
 * respective pools for reuse when they are no longer needed.
 *
 * The object responsible for recycling [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) is [reclaimer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/reclaimer.html).
 */

/**
 * ASSEMBLE!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game-object-pool', 'component-pool', 'error-printer'], function(GameObjectPool, ComponentPool, ErrorPrinter) {
	var Assembler = function() {};

	var uidCounter = -1;

	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * It returns a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) ready to be started.
	 *
	 * @param {String} name Id of the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) we want assembled. It should be an existing configured id on the [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
	 * @param {Object} [args=null] All the properties in this object will be copied to the assembled object.
	 * @param {Boolean} [nestedCall=false] This argument is reserved for internal use. It defaults to false, but you can see what happens if you set it to true :P
	 *
	 * @throws {Error} If a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) was configured to have childs. Only [game-object-containers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html) can have nested childs
	 *
	 * @return {Object} A [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) ready to be used
	 */
	Assembler.prototype.get = function(name, args, nestedCall, createNew) {
		var configuration = GameObjectPool.getConfiguration(name, nestedCall, createNew);

		// Get one object from the pool
		var pooledObject = GameObjectPool.getPooledObject(configuration.type);

		// Reset some internal properties of the game-object before actually using it.
		pooledObject.reset();
		// Assign a uid to the game object, useful to precisly identify it, assuming you know the id
		uidCounter++;
		pooledObject.uid = uidCounter.toString();
		// Set object typeId, this is very useful to identify game objects in the middle of the spaghetti mist.
		pooledObject.typeId = name;

		// Apply arguments from less spicific to more specific
		pooledObject.configure(configuration.hardArguments);
		pooledObject.configure(args);

		// Adding all the components configured for this object type
		for (var i = 0; i < configuration.components.length; i++) {
			pooledObject.addComponent(this.getComponent(configuration.components[i].componentId, configuration.components[i].args));
		}

		// Adding nested childs configured for this object
		for (i = 0; i < configuration.childs.length; i++) {
			if (!pooledObject.addChild) {
				ErrorPrinter.printError('Assembler', 'Game Object with type: ' + configuration.type + ' is not a container, can not add childs to it');
			}

			pooledObject.addChild(this.get(configuration.childs[i].childId, configuration.childs[i].args, true));
		}

		// Adding the renderer configured for this object type
		if (configuration.renderer) {
			pooledObject.setRenderer(this.getComponent(configuration.renderer.componentId, configuration.renderer.args));
		}

		// When this object is 'recycled' it returns to it's respective pool
		pooledObject.on(pooledObject.RECYCLE, this, function(go) {
			GameObjectPool.returnToPool(go);
		}, true);

		return pooledObject;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>getComponent</strong></p>
	 *
	 * It returns a [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) ready to be started. If the object is not available in the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html)
	 * it will be created every time.
	 *
	 * @param {String} componentId Id of the [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html). It should be an existing configured id on the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html)
	 * @param {Object} [args=null] All the properties in this object will be copied to the [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html).
	 *
	 * @return {Object} A [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) ready to be used
	 */
	Assembler.prototype.getComponent = function(componentId, args) {
		var config = ComponentPool.getConfiguration(componentId);

		// If there is no configuration, do nothing.
		if (!config) return;

		// Getting the requested component from the corresponding pool.
		var pooledComponent = ComponentPool.getPooledObject(config.componentId);

		// Reset some internal properties of the component before actually using it.
		pooledComponent.reset();
		// Assign a uid to the component, useful to precisly identify it, assuming you know the id
		uidCounter++;
		pooledComponent.uid = uidCounter.toString();
		// Set component typeId, this is very useful to identify game objects in the middle of the spaghetti mist.
		pooledComponent.typeId = componentId;

		// Apply arguments from less spicific to more specific
		pooledComponent.configure(config.componentArgs);
		pooledComponent.configure(args);

		// When a component is 'recycled' it returns to it's respective pool
		pooledComponent.on(pooledComponent.RECYCLE, this, function(c) {
			ComponentPool.returnToPool(c);
		}, true);

		return pooledComponent;
	};
	/**
	 * --------------------------------
	 */

	return new Assembler();
});
