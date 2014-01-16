/**
 * # component-pool.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [pool](@@pool@@)
 *
 * Depends of:
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
 * Unlike [game-objects](@@game-object@@), [component](@@component@@) don't make sense by themselves, so
 * you don't specify the maximun amount of them you want, like you do with the [game-object-pool](@@game-object-pool@@). 
 * Instead when you configure the [game-object-pool](@@game-object-pool@@),
 * the maximun amount of [component](@@component@@) instances will be infered from the amount
 * of [game-object](@@game-object@@) instances and the amount of [components](@@component@@) they are
 * configured to use.
 *
 * With that said, another important aspect is that the pools not only store instances,
 * they also store configurations for those instances. That means that you can be having a single pooled
 * object, but with three different configurations. ej.
 *
 * ``` javascript
 * componentPool.createPool("Components", someComponentPrototypeObject);
	componentPool.createConfiguration("Conf_1", 'Components').args({some_property:  1});
	componentPool.createConfiguration("Conf_2", 'Components').args({some_property:2});
	componentPool.createConfiguration("Conf_3", 'Components').args({some_property: 3});
 *
 * ```
 *
 * With a configuration like that one, there will only be 
 * a single instance of _'someComponentPrototypeObject'_, but it might be configured with the arguments
 * for any of those configurations at the moment it is requested.
 */

/**
 * Pooling Components
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var ComponentPool = require('pool').extend({
		createConfiguration: function(alias, type) {
			var configuration = {
				componentId: type,
				componentArgs: null,

				typeId: function() {
					return type;
				},

				args: function(args) {
					this.componentArgs = args;
					return this;
				}
			}

			this.configurations[alias] = configuration;
		
			return configuration;
		},

		getName: function() {
			return 'Component Pool';
		},

		addInitialObjectsToPool: function(amount, alias) {},

		getConfiguration: function(alias, nestedCall) {
			var configuration = this.configurations[alias];
			var pool = this.pools[configuration.componentId];

			if (pool.objects.length <= 0) {
				var ok = this.createNewIfNeeded(configuration.componentId);

				if(!ok) {
					throw new Error('Component with id: ' + configuration.componentId + ' is not available');
				}
			}

			return configuration;
		}
	});

	return new ComponentPool();
});