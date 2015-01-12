/**
 * # basic-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/bundle.html)
 *
 * Depends of: 
 * [circle-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/circle-collider.html)
 * [polygon-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/polygon-collider.html)
 * [fixed-polygon-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/fixed-polygon-collider.html)
 * [path-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/path-renderer.html)
 * [bitmap-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/bitmap-renderer.html)
 * [text-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/text-renderer.html)
 * [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
 * [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This bundle configures the [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) and the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html) so that the
 * basic [components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) and [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) are ready to use.
 *
 * If you need a configuration to use a simple [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) or a [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html)
 * there is no need to setup a pool for them, instead you can **require** this module and use the **getGameObjectPoolId** and **getGameObjectContainerPoolId**
 * methods where necessary. 
 *
 * Same goes for [renderers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html) if you need ids for a [bitmap-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/bitmap-renderer.html), 
 * [text-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/text-renderer.html) or [path-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/path-renderer.html) you can use the 
 * **getBitmapRendererPoolId**, **getTextRendererPoolId** and **getPathRendererPoolId** methods respectively.
 *
 * Similarly you can get ids for [collision-components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/collision-component.html), either a [circle-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/circle-collider.html), 
 * [polygon-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/polygon-collider.html) or [fixed-polygon-collider](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/fixed-polygon-collider.html) have their corresponding methods. 
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
		 * This method configures the [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) and the [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html)
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