/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 *
 * Depends of:
 * [game](@@game@@)
 * [layers](@@layers@@)
 * [assembler](@@assembler@@)
 * [reclaimer](@@reclaimer@@)
 * [game-object-pool](@@game-object-pool@@)
 * [component-pool](@@component-pool@@)
 * [json-cache](@@json-cache@@)
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

    var addToViewPorts = function(go, vports) {
      var v;

      if (typeof vports == 'string') {
        if (this.viewportsAliases[vports]) {
          v = this.viewportsAliases[vports];
        } else {
          ErrorPrinter.printError('Gb', 'Viewport shortcut ' + vports + ' does not exist.');
        }
      } else {
        v = vports;
      }

      for (var i=0; i<v.length; i++) {
        viewports.get(v[i].viewport).addGameObject(v[i].layer, go);
      }
    };

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
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the group to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {Array} vports An array specifying viewports and corresponding layers the [game-object](@@game-object@@) should be added to.
       *
       * @return {Object} The [game-object](@@game-object@@) that was just assembled.
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
       * @param {Array|String} vports If it is an array specifying [viewports](@@viewport@@) and corresponding [layers](@@layer@@)
       *                              the [game-object](@@game-object@@) should be added to.
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} [args] Object with arguments to be applied to the created [game-object](@@game-object@@)
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
       * @param {Array|String} vports If it is an array specifying [viewports](@@viewport@@) and corresponding [layers](@@layer@@)
       *                              the [game-object](@@game-object@@) should be added to.
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} [args] Object with arguments to be applied to the created [game-object](@@game-object@@)
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
       * Wraps all the steps needed to setup a <a href=@@game-object@@>game-object</a>
       * 
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the [group](@@group@@) to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {Array|String} vports If it is an array specifying [viewports](@@viewport@@) and corresponding [layers](@@layer@@)
       *                              the [game-object](@@game-object@@) should be added to.
       *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
       * @param {Object} [args] Object with arguments to be applied to the created [game-object](@@game-object@@)
       * @param {String} [method] Method to get a [game-object](@@game-object@@), can be either 'get' or 'create'
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
       * <p style='color:#AD071D'><strong>addTextToLayer</strong></p>
       *
       * This method is basically the same as **add** but it is used with [game-objects](@@game-object@@) that have a
       * [text-renderer](@@text-renderer@@) attached to them.
       *
       * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
       * @param {String} groupId Id of the [group](@@group@@) to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
       * @param {String} text  String to initialize the [text-renderer](@@text-renderer@@) with.
       * @param {Array|String} vports If it is an array specifying [viewports](@@viewport@@) and corresponding [layers](@@layer@@)
       *                              the [game-object](@@game-object@@) should be added to.
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
       * Toggle the debug drawing of [game-object](@@game-object@@) [colliders](@@collider-component@@)
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

