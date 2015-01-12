/**
 * # basic-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](@@bundle@@)
 *
 * Depends of: 
 * [circle-collider](@@circle-collider@@)
 * [polygon-collider](@@polygon-collider@@)
 * [fixed-polygon-collider](@@fixed-polygon-collider@@)
 * [path-renderer](@@path-renderer@@)
 * [bitmap-renderer](@@bitmap-renderer@@)
 * [text-renderer](@@text-renderer@@)
 * [game-object](@@game-object@@)
 * [game-object-container](@@game-object-container@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This bundle configures the [game-object-pool](@@game-object-pool@@) and the [component-pool](@@component-pool@@) so that the
 * basic [components](@@component@@) and [game-objects](@@game-object@@) are ready to use.
 *
 * If you need a configuration to use a simple [game-object](@@game-object@@) or a [game-object-container](@@game-object-container@@)
 * there is no need to setup a pool for them, instead you can **require** this module and use the **getGameObjectPoolId** and **getGameObjectContainerPoolId**
 * methods where necessary. 
 *
 * Same goes for [renderers](@@renderer@@) if you need ids for a [bitmap-renderer](@@bitmap-renderer@@), 
 * [text-renderer](@@text-renderer@@) or [path-renderer](@@path-renderer@@) you can use the 
 * **getBitmapRendererPoolId**, **getTextRendererPoolId** and **getPathRendererPoolId** methods respectively.
 *
 * Similarly you can get ids for [collision-components](@@collision-component@@), either a [circle-collider](@@circle-collider@@), 
 * [polygon-collider](@@polygon-collider@@) or [fixed-polygon-collider](@@fixed-polygon-collider@@) have their corresponding methods. 
 * **getCircleColliderPoolId**, **getPolygonColliderPoolId** and **getFixedPolygonColliderPoolId**.
 *
 * Ej.
 * ```
 * var basicBundle = require('basic-bundle');
 *
 * basicBundle.getGameObjectPoolId() // returns 'game-object'
 * basicBundle.getGameObjectContainerPoolId() // returns 'game-object-container'
 * basicBundle.getBitmapRendererPoolId() // returns 'bitmap-renderer'
 * basicBundle.getTextRendererPoolId() // returns 'text-renderer'
 * basicBundle.getPathRendererPoolId() // returns 'path-renderer'
 * basicBundle.getCircleColliderPoolId() // returns 'circle-collider'
 * basicBundle.getPolygonColliderPoolId() // returns 'polygon-collider'
 * basicBundle.getFixedPolygonColliderPoolId() // returns 'fixed-polygon-collider'
 * ```
 */

/**
 * --------------------------------
 */
define(function(require) {
	var BasicBundle = require('bundle').extend({
	
		/**
		 * <p style='color:#AD071D'><strong>create</strong></p>
		 *
		 * This method configures the [game-object-pool](@@game-object-pool@@) and the [component-pool](@@component-pool@@)
		 * with the basic objects so it is not needed to define them repeatedly on other bundles
		 * 
		 * @param  {Object} [args=null] 
		 */
		create: function(args) {
			this.createComponentPool(function() { return require('circle-collider') });
			this.createComponentPool(function() { return require('polygon-collider') });
			this.createComponentPool(function() { return require('fixed-polygon-collider') });

			this.createComponentPool(function() { return require('path-renderer') });
			this.createComponentPool(function() { return require('bitmap-renderer') });
			this.createComponentPool(function() { return require('text-renderer') });

			this.createDynamicGameObjectPool(function() { return require('game-object') });
			this.createDynamicGameObjectPool(function() { return require('game-object-container') });
		},
		/**
		 * --------------------------------
		 */
	});

	return BasicBundle;
});