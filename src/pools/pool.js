/**
 * # pool.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [delegate](@@delegate@@)
 *
 * Depends of:
 * [util](@@util@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines the base object from which [game-object-pool](@@game-object-pool@@) and
 * [component-pool](@@component-pool@@) are extended from.
 *
 * These pools create objects dynamically when requested. When one of those objects is
 * not needed in it's current state anymore,
 * it is recycled. Instead of destroying the reference it is sent back to the corresponding pool, so it
 * can be picked up again and refurbished later.
 *
 * Pools continue to create objects dynamically until the set cap for a given type is reached.
 * From then on, if the pool does not have available objects, it throws an error if it is requested
 * something.
 *
 * One of the key features of both [game-object-pool](@@game-object-pool@@) and
 * [component-pool](@@component-pool@@) is that you not only can define collections of
 * instances, but also configurations for those instances. A configuration defines a set
 * of arguments, to be applied on an instance. This allows to have configurations that would
 * otherwise be sprinckled all over a project, centralized in the same place, or the same handfull
 * of places.
 *
 * A less obvious advantage of preconfiguring objects, is that you avoid creating small dynamic
 * objects that will most likely be used in the initialization of other larger dynamic objects.
 *
 * Generally speaking, pooling is very usefull because it frees CPU time from the burden of allocating
 * and deallocating memory every single time you want something new. In the case of Garbage Collected
 * environments, like a Javascript virtual machine, pooling should also reduce the time spent
 * by the Garbage Collector doing it's thing. Which is good.
 *
 * Pooling objects is good and all, but it is probably not a good idea to pool absolutely everything
 * you will need in the entire life span of an application, unless it is a small one. For that reason
 * it is possible to clear and repopulate pools.
 *
 * Pools extend [delegate](@@delegate@@) so they offer a bunch of events to hook onto.
 * 
 * * ### **INIT** 
 * When a pool is created 
 * 
 * Registered callbacks get the pool as argument 
 * ``` javascript  
 * pool.on(pool.INIT, function(pool) {});
 * ``` 
 *
 * </br>
 *
 * ### **GET** 
 * When an object is requested from a pool 
 * 
 * Registered callbacks get the object as argument 
 * ``` javascript  
 * pool.on(pool.GET, function(object) {});
 * ``` 
 *
 * </br>
 *
 * ### **RETURN** 
 * When an object is returned to it's respective pool
 * 
 * Registered callbacks get the returning object as argument 
 * ``` javascript  
 * pool.on(pool.RETURN, function(object) {});
 * ``` 
 *
 * </br>
 *
 * ### **CREATE_CONFIGURATION** 
 * When a configuration is created 
 * 
 * Registered callbacks get the configuration object as argument 
 * ``` javascript  
 * pool.on(pool.CREATE_CONFIGURATION, function(configuration) {});
 * ``` 
 *
 * </br>
 *
 * ### **UPDATE_CONFIGURATION** 
 * When a configurations values are updated
 * 
 * Registered callbacks get the corresponding configuration as argument 
 * ``` javascript  
 * pool.on(pool.UPDATE_CONFIGURATION, function(configuration) {});
 * ``` 
 *
 * </br>
 *
 * ### **CLEAR** 
 * When the whole pool object is cleared 
 * 
 * ``` javascript  
 * pool.on(pool.CLEAR, function() {});
 * ``` 
 *
 * </br>
 *
 * ### **CLEAR_OBJECTS** 
 * When all the instances in all pools are destroyed 
 * 
 * ``` javascript  
 * pool.on(pool.CLEAR_OBJECTS, function() {});
 * ``` 
 *
 * </br>
 * 
 * ### **CLEAR_CONFIGURATIONS** 
 * When all configurations of all pools are destroyed
 * 
 * ``` javascript  
 * pool.on(pool.CLEAR_CONFIGURATIONS, function() {});
 * ``` 
 *
 * </br>
 *
 * ### **CLEAR_CONFIGURATION** 
 * When a specific configuration is destroyed
 * 
 * Registered callbacks get the id of the configuration that was destroyed 
 * ``` javascript  
 * pool.on(pool.CLEAR_CONFIGURATION, function(id) {});
 * ``` 
 */
/**
 * Pooling
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "util", "error-printer"], function(Delegate, Util, ErrorPrinter) {
  var Pool = Delegate.extend({
    init: function() {
      this._super();

      this.pools = {};
      this.configurations = {};
      this.active = {};
    },

    /**
     * <p style='color:#AD071D'><strong>createPool</strong></p>
     *
     * Creates a collections of a given type of objects, assigning it an
     * id to later be able to get references out of it.
     *
     * The pools created by this method can not go above the given amount. If objects are requested from this
     * and there are no available, an error is thrown.
     *
     * @param  {String} alias  Id used to later refer to the collection that is being created
     * @param  {Object} type   The object prototype from which instances in this pool will be created from
     * @param  {Number} amount The amount of objects to add to the pool initially.
     */
    createPool: function(alias, type, amount) {
      // A pool object contains an array of objects, and a variable
      // of the type of the objects it contains.
      if (this.pools[alias] == null) {
        this.pools[alias] = {
          objects: [],
          type: type
        };
        
        this.addInitialObjectsToPool(amount, alias);

        this.execute(this.INIT, this.pools[alias]);
      }

      // Objects that are active on a given pool at any given time.
      if (this.active[alias] == null) {
        this.active[alias] = [];
      }
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>createDynamicPool</strong></p>
     *
     * Creates a collections of a given type of objects, assigning it an
     * id to later be able to get references out of it.
     *
     * The pools created with this method, are completely dynamic and do not need an initial amount. If they don't have 
     * an instance available they will create a new one when needed. These are more flexible, but also easier to loose control of.
     *
     * @param  {String} alias  Id used to later refer to the collection that is being created
     * @param  {Object} type   The object prototype from which instances in this pool will be created from
     */
    createDynamicPool: function(alias, type) {
      // A pool object contains an array of objects, and a variable
      // of the type of the objects it contains.
      if (this.pools[alias] == null) {
        this.pools[alias] = {
          objects: [],
          type: type
        };

        this.pools[alias].dynamic = true;
        this.execute(this.INIT, this.pools[alias]);
      }

      // Objects that are active on a given pool at any given time.
      if (this.active[alias] == null) {
        this.active[alias] = [];
      }
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>createPooledObject</strong></p>
     *
     * Creates a pooled object.
     *
     * @param  {String} alias Id used to referer to this kind of object
     */
    createPooledObject: function(alias) {
      var pool = this.pools[alias];

      var o = new pool.type();
      o.poolId = alias;

      pool.objects.push(o);
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>getPoolSize</strong></p>
     *
     * Gets the size of the requested collection of pooled objects.
     *
     * @param  {String} alias Id corresponding to an object type
     */
    getPoolSize: function(alias) {
      this.pools[alias].objects.length;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>getTotalPooledObjectsCount</strong></p>
     *
     * Get the total amount of pooled objects
     *
     * @return {Number} Amount of pooled objects
     */
    getTotalPooledObjectsCount: function() {
      var result = 0;

      for (var k in this.pools) {
        result += this.pools[k].objects.length;
      }

      return result;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>getTotalActiveObjectsCount</strong></p>
     *
     * Get the total amount of active objects
     *
     * @return {Number} Amount of active objects
     */
    getTotalActiveObjectsCount: function() {
      var result = 0;

      for (var k in this.active) {
        result += this.active[k].length;
      }

      return result;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>getActiveObjects</strong></p>
     *
     * Gets the amount of objects in a given pool, that are active.
     *
     * @param  {String} alias Id corresponding to an object type
     */
    getActiveObjects: function(alias) {
      return this.active[alias];
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>getAllActiveObjects</strong></p>
     *
     * Gets all the active [game-object](@@game-object@@) instances.
     *
     * @return {Object} All the different types of active [game-objects](@@game-object@@)
     */
    getAllActiveObjects: function() {
      return this.active;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>returnToPool</strong></p>
     *
     * This method is used in [assembler](@@assembler@@) when an object is
     * recycled to send it back to it's corresponding pool for reuse.
     *
     * @param  {Object} o Returning object
     */
    returnToPool: function(o) {
      if (!o.poolId) return;

      this.pools[o.poolId].objects.push(o);
      this.active[o.poolId].splice(this.active[o.poolId].indexOf(o), 1);

      this.execute(this.RETURN, o);
    },
    /**
     * --------------------------------
     */

    /**
     * Methods to be overriden by objects extending this one
     * View [game-object-pool](@@game-object-pool@@) and
     * [component-pool](@@component-pool@@) for implementations.
     */
    getName: function() {
      ErrorPrinter.mustOverrideError('Pool');
    },
    addInitialObjectsToPool: function(amount) {
      ErrorPrinter.mustOverrideError('Pool');
    },
    createConfiguration: function(alias, type) {
      ErrorPrinter.mustOverrideError('Pool');
    },
    getConfiguration: function(name, nestedCall, createNew) {
      ErrorPrinter.mustOverrideError('Pool');
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>createNewIfNeeded</strong></p>
     *
     * Dynamically creates an instance of the type specified. This
     * method will only create instances of types that do not specify
     * a maximun amount when created.
     *
     * @param  {String} type Id of the type of object to create
     * @param  {Boolean} force Set to true to force the creation of a new object
     *
     * @return {Boolean}      True or false depending if an object was created or not
     */
    createNewIfNeeded: function(type, force) {
      if (force) {
        this.createPooledObject(type);
        return true;
      }

      if(!this.pools[type].maxAmount) {
        this.createPooledObject(type);
        return true;
      }

      return false;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>getPooledObject</strong></p>
     *
     * Get a pooled object, the object to be returned is added to the collection
     * of active objects. This method is mainly used by the [assembler](@@assembler@@)
     * module when putting together [game-objects](@@game-object@@).
     *
     * @param  {String} type id of the type of object to retrieve
     *
     * @return {Object}
     */
    getPooledObject: function(type) {
      var o = this.pools[type].objects.pop();
      this.active[type].push(o);

      this.execute(this.GET, o);
      return o;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>clear</strong></p>
     *
     * Clear a pool out of everything. This method is
     * used by the [reclaimer](@@reclaimer@@) module.
     */
    clear: function() {
      this.clearObjects();
      this.clearConfigurations();

      for (var k in this.pools) {
        Util.destroyObject(this.pools[k]);
      }

      this.pools = {};
      this.active = {};

      this.execute(this.CLEAR);
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>clearObjects</strong></p>
     *
     * Remove all instances from a pool, active and pooled ones.
     */
    clearObjects: function() {
      var k;

      for(k in this.pools) {
        var pool = this.pools[k].objects;

        while (pool.length > 0){
          Util.destroyObject(pool.pop());
        }
      }

      for(k in this.active) {
        var active = this.active[k];

        while (active.length > 0){
          Util.destroyObject(active.pop());
        }
      }

      this.execute(this.CLEAR_OBJECTS);
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>clearConfiguration</strong></p>
     *
     * Remove a configuration from the pool. After executing this method with a valid id, the id becomes useless to retrieve instances from the pool
     * 
     * @param  {String} configurationId An existing configuration id
     */
    clearConfiguration: function(configurationId) {
    	var configuration = this.configurations[configurationId];

    	if (configuration) {
    		Util.destroyObject(configuration);
    		delete this.configurations[configurationId];

    		this.execute(this.CLEAR_CONFIGURATION, configurationId);
    	}
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>clearConfigurations</strong></p>
     *
     * Remove all configurations from a pool. The pool is effectively useless without any configurations. After using this method
     * you probably want to add new [game-object](@@game-object@@) configurations.
     */
    clearConfigurations: function() {
      for(var k in this.configurations) {
      	clearConfiguration(k);
      }

      this.configurations = {};

      this.execute(this.CLEAR_CONFIGURATIONS);
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
      var r = [];

      for (var k in this.configurations) {
        r.push(k);
      }

      return r;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>toString</strong></p>
     *
     * Return a string representation of the pool. For debugging purposes.
     *
     * @return {String}
     */
    toString: function() {
      var r = {
        name: this.getName()
      }

      var total = 0;

      for (var k in this.pools) {
        r[k] = {
          pooled: this.pools[k].objects.length,
          active: this.active[k].length,
          total: this.pools[k].objects.length + this.active[k].length
        }

        total += r[k].total;
      }

      r['total'] = total;

      return JSON.stringify(r, null, 2);
    }
    /**
     * --------------------------------
     */
  });

  Object.defineProperty(Pool.prototype, "INIT", { get: function() { return 'init'; } });
  Object.defineProperty(Pool.prototype, "GET", { get: function() { return 'get'; } });
  Object.defineProperty(Pool.prototype, "RETURN", { get: function() { return 'return'; } });
  Object.defineProperty(Pool.prototype, "CREATE_CONFIGURATION", { get: function() { return 'create_configurations'; } });
  Object.defineProperty(Pool.prototype, "UPDATE_CONFIGURATION", { get: function() { return 'update_configurations'; } });
  Object.defineProperty(Pool.prototype, "CLEAR", { get: function() { return 'clear'; } });
  Object.defineProperty(Pool.prototype, "CLEAR_OBJECTS", { get: function() { return 'clear_objects'; } });
  Object.defineProperty(Pool.prototype, "CLEAR_CONFIGURATIONS", { get: function() { return 'clear_configurations'; } });
  Object.defineProperty(Pool.prototype, "CLEAR_CONFIGURATION", { get: function() { return 'clear_configuration'; } });

  return Pool;
});
