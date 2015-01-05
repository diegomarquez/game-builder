/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 *
 * Depends of:
 * [game](@@game@@)
 * [groups](@@groups@@)
 * [assembler](@@assembler@@)
 * [reclaimer](@@reclaimer@@)
 * [game-object-pool](@@game-object-pool@@)
 * [component-pool](@@component-pool@@)
 * [json-cache](@@json-cache@@)
 * [asset-map](@@asset-map@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module.
 *
 * This module acts as a hub for the main modules of [Game-Builder](http://diegomarquez.github.io/game-builder). So instead of loading them individualy,
 * you just load this one and use the references that it provides.
 */

/**
 * A bunch of shortcuts
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game', 'groups', 'viewports', 'assembler', 'reclaimer', 'game-object-pool', 'component-pool', 'json-cache', 'asset-map', 'error-printer'],
  function(game, groups, viewports, assembler, reclaimer, gameObjectPool, componentPool, jsonCache, assetMap, ErrorPrinter) {

  	var processViewportArgument = function(vports) {
  		var v;

      if (typeof vports == 'string') {
        if (this.viewportsAliases[vports]) {
          v = this.viewportsAliases[vports];
        } else {
          ErrorPrinter.printError('Gb', 'Viewport shortcut ' + vports + ' does not exist.');
        }
      } else {
      	if (Object.prototype.toString.call(vports) != '[object Array]') {
      		ErrorPrinter.printError('Gb', 'Viewport argument must be an array');
      	} else {
      		v = vports;	
      	}
      }

      return v;
  	}

    var addToViewPorts = function(go, vports) {
      var v = processViewportArgument.call(this, vports);

      for (var i=0; i<v.length; i++) {
        viewports.get(v[i].viewport).addGameObject(v[i].layer, go);
      }
    }

    var removeFromViewPorts = function(go, vports) {
    	var v = processViewportArgument.call(this, vports);

    	for (var i=0; i<v.length; i++) {
        viewports.get(v[i].viewport).removeGameObject(v[i].layer, go);
      }
    }

    var toggle = function(state, prop) {
      if (state === false || state === true) {
        this[prop] = state;  
      } else {
        this[prop] = !this[prop];
      }
    }

    return {
      game: game,
      groups:groups,
      viewports: viewports,

      assembler: assembler,
      reclaimer: reclaimer,

      goPool: gameObjectPool,
      coPool: componentPool,
      jsonCache: jsonCache,

      debug: false,
      colliderDebug: false,
      rendererDebug: false,
      gameObjectDebug: false,

      viewportsAliases: {},

      /**
       * A reference to the main canvas object in index.html.
       */
      canvas: document.getElementById('game'),
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>setViewportShortCut</strong></p>
       *
       * Store commonly used [viewport](@@viewport@@) + [layer](@@layer@@) setups
       *
       * @param {String} alias Id to later indentify the object sent in the **vports** argument
       * @param {Array} vports An array specifying viewports and corresponding layers. The objects in the array should look like this
       * ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```
       */
      setViewportShortCut: function(alias, vports) {
        this.viewportsAliases[alias] = vports;
      },

      /**
       * <p style='color:#AD071D'><strong>getViewportShortCuts</strong></p>
       *
       * Get all the viewport shortcut names
       *
       * @return {Array} All the shortcut names
       */
      getViewportShortCuts: function() {
        var r = [];

        for (var k in this.viewportsAliases) {
          r.push(k);
        }

        return r;
      },

      /**
       * <p style='color:#AD071D'><strong>add</strong></p>
       *
       * Wraps all the steps needed to start rendering a <a href=@@game-object@@>game-object</a>
       *
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the [group](@@group@@) to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
       *  ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```                              
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} [args=null] Object with arguments to be applied to the created [game-object](@@game-object@@)
       * 
       * @return {Object} The [game-object](@@game-object@@) that was just assembled.
       */
      add: function (goId, groupId, vports, args) {
        var go = this.getGameObject(goId, groupId, vports, args, 'get'); 
        go.start();

        return go;
      },

      /**
       * <p style='color:#AD071D'><strong>create</strong></p>
       *
       * Wraps all the steps needed to start rendering a <a href=@@game-object@@>game-object</a>
       * This method will create a new object if the corresponding [game-object-pool](@@game-object-pool@@) doesn't
       * have any available
       *
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the [group](@@group@@) to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
       *  ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```                              
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} [args=null] Object with arguments to be applied to the created [game-object](@@game-object@@)
       *
       * @return {Object} The [game-object](@@game-object@@) that was just assembled.
       */
      create: function (goId, groupId, vports, args) {
        var go = this.getGameObject(goId, groupId, vports, args, 'create');
        go.start();

        return go;
      },

      /**
       * <p style='color:#AD071D'><strong>getGameObject</strong></p>
       *
       * Wraps all the steps needed to setup a <a href=@@game-object@@>game-object</a>.
       * The main difference with **add** and **create** is that this method does not start the objects
       * 
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the [group](@@group@@) to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
       *  ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```                              
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} args Object with arguments to be applied to the child [game-object](@@game-object@@)  
       * @param {String} method Method to get a [game-object](@@game-object@@), can be either 'get' or 'create'
       *
       * @return {Object} The [game-object](@@game-object@@) that was just assembled.
       */
      getGameObject: function(goId, groupId, vports, args, method) {
        var go = assembler[method](goId, args);
        groups.get(groupId).add(go);
        addToViewPorts.call(this, go, vports);
        
        return go;
      },

      /**
       * <p style='color:#AD071D'><strong>addChildTo</strong></p>
       *
       * Wraps all the steps needed to add a child [game-object](@@game-object@@) to a [game-object-container](@@game-object-container@@)
       *
       * If the vports aregument is specified, the child will be drawn in the [viewport](@@viewport@@) and [layer](@@layer@@) pairs specified.
       * The parent [viewport](@@viewport@@) will be ignored.
       * 
       * @param {Object} go [game-object-container](@@game-object-container@@) to add the child to
       * @param {String} chidlGoId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details
       * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
       *  ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```                              
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} args Object with arguments to be applied to the child [game-object](@@game-object@@)  
       * @param {String} method Method to get a [game-object](@@game-object@@), can be either 'get' or 'create'
       * @param {Boolean} [start=true] Whether the [game-object](@@game-object@@) should be started right away     
       *
       * @return {Object} The child [game-object](@@game-object@@)
       */
      addChildTo: function(parent, chidlGoId, vports, args, method, start) {
      	var child = assembler[method](chidlGoId, args);
      
        parent.add(child);

        if (vports) {
        	addToViewPorts.call(this, child, vports);	
        	parent.setChildOptions(child, { draw: false });
        }
        
        start = start === undefined ? true : false;

        if (start) {
        	child.start();
        }

        return child;
      },
      /**
       * --------------------------------
       */
      
      /**
       * <p style='color:#AD071D'><strong>addToViewports</strong></p>
       *
       * Adds a [game-object](@@game-object@@) to the specified [viewport](@@viewport@@) and [layer](@@layer@@) combos
       *
       * @param {Object} go    An active [game-object](@@game-object@@)
       * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
       *  ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```                              
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       */
      addToViewports: function(go, vports) {
      	addToViewPorts.call(this, go, vports);	
      },

      /**
       * <p style='color:#AD071D'><strong>removeFromViewports</strong></p>
       *
       * Removes a [game-object](@@game-object@@) from the specified [viewport](@@viewport@@) and [layer](@@layer@@) combos
       *
       * @param {Object} go    An active [game-object](@@game-object@@)
       * @param {Array|String} vports If it is an array specifying [viewports](@@viewport@@) and corresponding [layers](@@layer@@)
       *                              the [game-object](@@game-object@@) should be removed from.
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       */
      removeFromViewports: function(go, vports) {
      	removeFromViewPorts.call(this, go, vports);	
      },

      /**
       * <p style='color:#AD071D'><strong>addComponentTo</strong></p>
       *
       * Wraps all the steps needed to add <a href=@@component@@>component</a> to a [game-object](@@game-object@@)
       * 
       * @param {Object} go [game-object](@@game-object@@) to add the [component](@@component@@) to
       * @param {String} coId Id of [component](@@component@@) to add. View [component-pool](@@component-pool@@), for more details
       * @param {Object} [args=null] Object with arguments to be applied to the [component](@@component@@)       
       *
       * @return {Object} A [component](@@component@@)
       */
      addComponentTo: function(go, coId, args) {
      	var co = assembler.getComponent(coId, args);
        go.addComponent(co);
        co.start();

        return co;
      },
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>removeComponentFrom</strong></p>
       *
       * Wraps all the steps needed to remove a <a href=@@component@@>component</a> from a [game-object](@@game-object@@)
       * 
       * @param {Object} go [game-object](@@game-object@@) to remove a [component](@@component@@) from
       * @param {String} coId Id of [component](@@component@@) to remove. View [component-pool](@@component-pool@@), for more details
       */
      removeComponentFrom: function(go, coId) {
      	var c = go.findComponents().firstWithType(coId);
      	go.removeComponent(c);
      }, 

      /**
       * <p style='color:#AD071D'><strong>findGameObjectsOfType</strong></p>
       *
       * Get all the currently active [game-objects](@@game-object@@) that are similar to the one specified 
       * 
       * @param  {Object} go The [game-object](@@game-object@@) is used to return all other active ones that are similar to this one
       *
       * @return {Array}      An array with all the matching [game-objects](@@game-object@@)
       */
      findGameObjectsOfType: function(go) {
      	var gos = gameObjectPool.getActiveObjects(go.poolId);

      	var result = [];

      	for (var i = 0; i < gos.length; i++) {
      		if (gos[i].typeId == go.typeId) {
      			result.push(gos[i]);
      		}
      	}

      	return result;
      },
      /**
       * --------------------------------
       */
      
      /**
       * <p style='color:#AD071D'><strong>addTextToLayer</strong></p>
       *
       * This method is basically the same as **add** but it is used with [game-objects](@@game-object@@) that have a
       * [text-renderer](@@text-renderer@@) attached to them.
       *
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the [group](@@group@@) to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {String} text  String to initialize the [text-renderer](@@text-renderer@@) with.
       * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
       *  ``` { viewport: 'ViewportName', layer: 'LayerName' }
       *  ```                              
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       *
       * @return {Object} The [game-object](@@game-object@@) that was just assembled.
       */
      addText: function(goId, groupId, text, vports) {
        var go = assembler.get(goId);
        groups.get(groupId).add(go);
        addToViewPorts.call(this, go, vports);
        go.renderer.text = text;
        go.start();

        return go;
      },
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>assetMap</strong></p>
       *
       * Wrapper for the [asset-map](@@asset-map@@) module
       * 
       * @return {Object} An object with the local and remote asset URLs
       */
      assetMap: function() {
        return assetMap.get();
      },
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>toggleDebug</strong></p>
       *
       * Toggle the global debug option which triggers a bunch of debug drawing
       * 
       * @param {Boolean} state=false If specified the debug option is set to that value
       */
      toggleDebug: function(state) {
        toggle.call(this, state, 'debug');
      },
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>toggleColliderDebug</strong></p>
       *
       * Toggle the debug drawing of [game-object](@@game-object@@) [collision-components](@@collision-component@@)
       * 
       * @param {Boolean} state=false If specified the debug option is set to that value
       */
      toggleColliderDebug: function(state) {
        toggle.call(this, state, 'colliderDebug');
      },
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>toggleRendererDebug</strong></p>
       *
       * Toggle the debug drawing of [game-object](@@game-object@@) [renderers](@@renderer@@)
       * 
       * @param {Boolean} state=false If specified the debug option is set to that value
       */
      toggleRendererDebug: function(state) {
        toggle.call(this, state, 'rendererDebug');
      },
      /**
       * --------------------------------
       */

      /**
       * <p style='color:#AD071D'><strong>toggleGameObjectDebug</strong></p>
       *
       * Toggle the debug drawinf of [game-object](@@game-object@@) centers
       * 
       * @param {Boolean} state=false If specified the debug option is set to that value
       */
      toggleGameObjectDebug: function(state) {
        toggle.call(this, state, 'gameObjectDebug');
      }
      /**
       * --------------------------------
       */
    }
  }
);

