/**
 * # component-pool.js
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
 * This module defines the component pool. All the required instances of [component](@@component@@)
 * objects are held in here. 
 * 
 * As [game-objects](@@game-object@@) are assembled by [assembler](@@assembler@@), 
 * [component](@@component@@) objects might be needed, at that point they are instantiated.
 * When they are not needed anymore, instead of destroying the instance, they are sent back to this
 * pool for later usage. 
 *
 * When the pool reaches the maximun amount of objects, of a certain type, it can handle, it will not create
 * anymore if it is requested. Instead it will throw an error
 * saying that there are no more [components](@@component@@) of that type available.
 *
 * Unlike [game-objects](@@game-object@@), [components](@@component@@) don't make sense by themselves, so
 * you don't specify the maximun amount of them you want, like you do with the [game-object-pool](@@game-object-pool@@). 
 * Instead [components](@@component@@) will be created as needed. Since [components](@@component@@),
 * can not exists outside of a [game-object](@@game-object@@), when the cap on [game-objects](@@game-object@@)
 * is reached, naturally, no more [components](@@component@@) will be created.
 *
 * From that point, if a [game-object](@@game-object@@) is recycled all of it's [components](@@component@@) will
 * be recycled aswell, freeing them to be used in another [game-object](@@game-object@@) if needed.
 *
 * This pool also stores configurations for [component](@@component@@) instances. 
 * That means that you can be having a single pooled
 * object, but with three different configurations, for example. ej.
 *
 * ``` javascript
 * componentPool.createPool("Component", someComponentPrototypeObject);
 * 
	componentPool.createConfiguration("Conf_1", 'Component').args({some_property:  1});
	componentPool.createConfiguration("Conf_2", 'Component').args({some_property:2});
	componentPool.createConfiguration("Conf_3", 'Component').args({some_property: 3});
 *
 * ```
 *
 * In the example above, there will only be 
 * a single instance of **'someComponentPrototypeObject'**, but it might be configured with the arguments
 * for any of those configurations at the moment it is requested.
 *
 * This is usefull to avoid having too many idling instances of the same type at the same time.
 */

/**
 * Pooling
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var ComponentPool = require('pool').extend({
		/**
		 * <p style='color:#AD071D'><strong>createConfiguration</strong></p>
		 *
		 * Creates a configuration for the given type of pooled object.
		 * 
		 * @param  {String} alias The id that will be used to retrieve this configuration
		 * @param  {String} type  With this id the configuration has the information needed
		 *                        to know to which pool of objects it refers to
		 *
		 * @return {Object}       A configuration object. Nothing too fancy
		 */
		createConfiguration: function(alias, type) {
			var self = this;

			// Configuration objects for [components](@@component@@)
			// contain the arguments that this configuration will apply
			var configuration = {
				componentId: type,
				componentArgs: null,
				alias: alias,

				// Returns the id of the pool this configuration refers to
				typeId: function() {
					return type;
				},

				configurationId: function() {
					return alias;
				},

				// Set which arguments this configuration will apply to a
				// [component](@@component@@)
				args: function(args) {
					this.componentArgs = args;
					self.execute(self.UPDATE_CONFIGURATION, this);
					return this;
				}
			}

			this.configurations[alias] = configuration;
			this.execute(this.CREATE_CONFIGURATION, configuration);
		
			return configuration;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>createConfigurationFromObject</strong></p>
		 *
		 * @param  {Object} configurationObject An object with all the information needed to set up a configuration for a pooled type
		 *
		 * @return {Object} The configuration object created
		 */
		createConfigurationFromObject: function(configurationObject) {
			var configuration = this.createConfiguration(configurationObject.alias, configurationObject.componentId);

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
			return 'Component Pool';
		},
		/**
		 * --------------------------------
		 */

		addInitialObjectsToPool: function(amount, alias) {},

		/**
		 * <p style='color:#AD071D'><strong>getConfiguration</strong></p>
		 *
		 * Gets a configuration for the requested [component](@@component@@).
		 *
		 * @param  {String} alias      Id of the [component](@@component@@) requested
		 * @param  {Boolean} nestedCall
		 *
		 * @throws {Error} If the corresponding pool has no available objects
		 * @return {Object} The configuration object requested
		 */
		getConfiguration: function(alias, nestedCall) {
			var configuration = this.configurations[alias];
			var pool = this.pools[configuration.componentId];

			if (pool.objects.length <= 0) {
				var ok = this.createNewIfNeeded(configuration.componentId);

				if(!ok) {
					require('error-printer').printError('Component Pool', 'Component with id: ' + configuration.componentId + ' is not available');
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
		 * @param  {String} alias      Id of the [component](@@component@@) requested
		 *
		 * @throws {Error} If the id provided does not match with any existing one
		 * 
		 * @return {Object} The configuration object requested
		 */
		getConfigurationObject: function(alias) {
			var configuration = this.configurations[alias]

			if(!configuration) {
				ErrorPrinter.printError('Component Pool', 'Configuration with id: '  + alias + ' does not exist');
			}

			return this.configurations[alias];
		}
		/**
		 * --------------------------------
		 */
	});

	return new ComponentPool();
});