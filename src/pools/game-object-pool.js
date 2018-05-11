/**
 * # game-object-pool.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [pool](@@pool@@)
 *
 * Depends of:
 * [game-object-configuration](@@game-object-configuration@@)
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
 * gameObjectPool.createPool("GameObject", someGameObjectPrototypeObject, 1);
 *
	gameObjectPool.createConfiguration("Conf_1", 'GameObject').args({some_property: 1});
	gameObjectPool.createConfiguration("Conf_2", 'GameObject').args({some_property: 2});
	gameObjectPool.createConfiguration("Conf_3", 'GameObject').args({some_property: 3});
 *
 * ```
 *
 * In the example above, there will only be
 * a single instance of *'someGameObjectPrototypeObject'*, but it might be configured with the arguments
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
	var ErrorPrinter = require('error-printer');

	var GameObjectPool = require('pool')
		.extend({

			/**
			 * <p style='color:#AD071D'><strong>createConfiguration</strong></p>
			 *
			 * Creates a [game-object-configuration](@@game-object-configuration@@) for the given type of pooled object.
			 *
			 * @param {String} alias The id that will be used to retrieve this [game-object-configuration](@@game-object-configuration@@)
			 * @param {String} type With this id the [game-object-configuration](@@game-object-configuration@@) has the information needed
			 * to know to which pool of objects it refers to
			 *
			 * @return {Object} A [game-object-configuration](@@game-object-configuration@@) object.
			 */
			createConfiguration: function(alias, type) {
				// If the configuration already exists, return it
				if (this.configurations[alias]) {
					return this.configurations[alias];
				}

				this.configurations[alias] = new(require('game-object-configuration'))(this, type, alias);
				this.execute(this.CREATE_CONFIGURATION, this.configurations[alias]);

				return this.configurations[alias];
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>createConfigurationFromObject</strong></p>
			 *
			 * @param {Object} configurationObject An object with all the information needed to set up a configuration for a pooled type
			 *
			 * @return {Object} The configuration object created
			 */
			createConfigurationFromObject: function(configurationObject) {
				var configuration = this.createConfiguration(configurationObject.alias, configurationObject.type);

				for (var k in configurationObject) {
					configuration[k] = configurationObject[k];
				}

				this.execute(this.CREATE_CONFIGURATION, configuration);

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
			 * @param {String} alias Id refering to the type that should be created
			 */
			addInitialObjectsToPool: function(amount, alias) {
				if (!amount) return;

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
			 * @param {String} alias Id of the [game-object](@@game-object@@) requested
			 * @param {Boolean} nestedCall
			 * @param {Boolean} createNew
			 *
			 * @throws {Error} If the corresponding pool has no available objects
			 * @throws {Error} If a [game-object](@@game-object@@) type which did not specified a maximun amount is requested explicitly
			 * @return {Object} The configuration object requested
			 */
			getConfiguration: function(alias, nestedCall, createNew) {
				if (!this.configurations[alias]) {
					ErrorPrinter.printError('Game Object Pool', 'Configuration with id: ' + alias + ' does not exist');
				}

				var configuration = this.configurations[alias];
				var pool = this.pools[configuration.type];

				if (!nestedCall && !pool.maxAmount && !pool.dynamic) {
					ErrorPrinter.printError('Game Object Pool', 'Game Object with type: ' + configuration.type + ' does not have a value for maxAmount. It can not be requested explicitly')
				}

				if (pool.objects.length <= 0) {
					var ok;

					if (pool.dynamic) {
						ok = this.createNewIfNeeded(configuration.type, true);
					} else {
						ok = this.createNewIfNeeded(configuration.type, createNew);
					}

					if (!ok) {
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
			 * @param {String} alias Id of the [game-object](@@game-object@@) requested
			 *
			 * @throws {Error} If the id provided does not match with any existing one
			 *
			 * @return {Object} The configuration object requested
			 */
			getConfigurationObject: function(alias) {
				if (!this.configurations[alias]) {
					ErrorPrinter.printError('Game Object Pool', 'Configuration with id: ' + alias + ' does not exist');
				}

				return this.configurations[alias];
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>getConfigurationTypes</strong></p>
			 *
			 * Get an array with all the names of the configurations currently in the pool
			 *
			 * @return {Array} The names of the configurations registered in the pool
			 */
			getConfigurationTypes: function() {
				var r = []

				for (var k in this.configurations) {
					r.push(k);
				}

				return r;
			}
			/**
			 * --------------------------------
			 */
		});

	return new GameObjectPool();
});
