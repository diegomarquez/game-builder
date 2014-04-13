/**
 * # game-object-pool.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [pool](@@pool@@)
 *
 * Depends of:
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines the game object pool. All the required instances of [game-object](@@game-object@@), 
 * at a certain point in the application, are held here. 
 * 
 * The pool can be configured with the types it should hold, and with the maximun amount of each type
 * it can hold. Note that [game-objects](@@game-object@@) that are only configured to be childs, do
 * not need to have a maximun amount specified, as they will be created as needed.
 *
 * Only [game-objects](@@game-object@@) which are going to be requested explicitly need to specify a 
 * maximum amount. They will be created dynamically until the maximun is reached.
 *
 * When the pool reaches the maximun amount of objects it can handle, it will not create
 * anymore if it is requested. Instead it will throw an error
 * saying that there are no more [game-objects](@@game-object@@) of that type available.
 *
 * This pool also stores configurations for [game-object](@@game-object@@) instances. 
 * That means that you can be having a single pooled
 * object, but with three different configurations, for example. ej.
 *
 * ``` javascript
 * componentPool.createPool("GameObject", someGameObjectPrototypeObject, 1);
 * 
	componentPool.createConfiguration("Conf_1", 'GameObject').args({some_property:  1});
	componentPool.createConfiguration("Conf_2", 'GameObject').args({some_property:2});
	componentPool.createConfiguration("Conf_3", 'GameObject').args({some_property: 3});
 *
 * ```
 *
 * In the example above, there will only be 
 * a single instance of _'someGameObjectPrototypeObject'_, but it might be configured with the arguments
 * for any of those configurations at the moment it is requested.
 *
 * This is usefull to avoid having too many idling instances at the same time.
 *
 * Unlike [components](@@component@@), there is a bit more to the configuration of a 
 * [game-objects](@@game-object@@).
 * A configuration might specify, [components](@@component@@) to attach, child [game-objects](@@game-object@@),
 * a [renderer](@@renderer@@), aswell as initialization arguments.
 *
 * The main idea is to provide 
 * a way to centralize the different configurations for
 * all the [game-objects](@@game-object@@) in a given section of an application. 
 * 
 * The good thing of clearly separating configuration from actual usage, is that the code
 * which will end up using the [assembler](@@assembler@@) module to make [game-objects](@@game-object@@)
 * appear on screen, is extremly short.
 */

/**
 * Pooling
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var getComponentDescription = function(id, args) {
		return {
			componentId: id,
			args: args
		}
	}

	var ErrorPrinter = require('error-printer');

	var GameObjectPool = require('pool').extend({
		
		/**
		 * <p style='color:#AD071D'><strong>createConfiguration</strong></p>
		 *
		 * Creates a configuration for the given type of pooled object.
		 * 
		 * @param  {String} alias The id that will be used to retrieve this configuration
		 * @param  {String} type  With this id the configuration has the information needed
		 *                        to know to which pool of objects it refers to
		 *
		 * @return {Object}       A configuration object. This objects have a lot of information
		 */
		createConfiguration: function(alias, type) {
			// Configuration objects for [game-objects](@@game-object@@)
			// contain the arguments that this configuration will apply
			var configuration = {
				type: type,
				hardArguments: null,
				childs: [],
				components: [],
				renderer: null,

				// Returns the id of the pool this configuration refers to
				typeId: function() {
					return type;
				},

				// Set which arguments this configuration will apply to a
				// [game-object](@@game-object@@)
				args: function(args) {
					this.hardArguments = args;
					return this;
				},
				// Add a child, specifying
				// an existing [game-object](@@game-object@@)
				// configuration id, and arguments the child will take when initialized
				addChild: function(childId, args) {
					this.childs.push({
						childId: childId,
						args: args
					});
					return this;
				},
				// Add a [component](@@component@@), specifying an existing 
				// [component](@@component@@) configuration id,
				// and arguments the component will take when initialized
				addComponent: function(componentId, args) {
					this.components.push(getComponentDescription(componentId, args));
					return this;
				},
				// Set a renderer, specifying an existing 
				// [component](@@component@@) configuration id, and arguments the
				// renderer will take when initialized
				setRenderer: function(rendererId, args) {
					this.renderer = getComponentDescription(rendererId, args);
					return this;
				}
			};

			this.configurations[alias] = configuration;

			return configuration;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getName</strong></p>
		 *
		 * Get the name of the pool
		 * 
		 * @return {String}
		 */
		getName: function() {
			return 'Game Object Pool';
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addInitialObjectsToPool</strong></p>
		 *
		 * Create initial amount of objects of a given type the pool will hold. This
		 * is also the maximun amount of [game-objects](@@game-object@@) of this type
		 * that can be requested explicitly.
		 * 
		 * @param {Number} amount Amount of intances to create
		 * @param {String} alias  Id refering to the type that should be created
		 */
		addInitialObjectsToPool: function(amount, alias) {
			if(!amount) return;

			for (var i = 0; i < amount; i++) {
				this.createPooledObject(alias);
			}	

			this.pools[alias].maxAmount = amount;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getConfiguration</strong></p>
		 *
		 * Gets a configuration for the requested [game-object](@@game-object@@).
		 *
		 * @param  {String} alias      Id of the [game-object](@@game-object@@) requested
		 *
		 * @throws {Error} If the corresponding pool has no available objects
		 * @throws {Error} If a [game-object](@@game-object@@) type which did not specified a maximun amount is requested explicitly
		 * @return {Object} The configuration object requested
		 */
		getConfiguration: function(alias, nestedCall) {
			var configuration = this.getConfigurationObject(alias);
			var pool = this.pools[configuration.type];

			if(!nestedCall && !pool.maxAmount) {
				ErrorPrinter.printError('Game Object Pool', 'Game Object with type: ' + configuration.type + ' does not have a value for maxAmount. It can not be requested explicitly')
			}

			if (pool.objects.length <= 0) {
				var ok = this.createNewIfNeeded(configuration.type);
				
				if(!ok) {
					ErrorPrinter.printError('Game Object Pool', 'Game Object with type: ' + configuration.type + ' is not available');
				}
			}

			return configuration;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getConfigurationObject</strong></p>
		 *
		 * Gets the requested configuration. It doesn't perform any type of validations.
		 * 
		 * @param  {String} alias      Id of the [game-object](@@game-object@@) requested
		 *
		 * @throws {Error} If the id provided does not match with any existing one
		 * 
		 * @return {Object} The configuration object requested
		 */
		getConfigurationObject: function(alias) {
			var configuration = this.configurations[alias]

			if(!configuration) {
				ErrorPrinter.printError('Game Object Pool', 'Configuration with id: '  + alias + ' does not exist');
			}

			return this.configurations[alias];
		}
		/**
		 * --------------------------------
		 */
	});

	return new GameObjectPool();
});