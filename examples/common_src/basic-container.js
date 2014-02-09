/**
 * # basic-container.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [game-object-container](@@game-object-container@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * A very basic example on on hot extend [game-object-containe](@@game-object-containe@@).
 * It's behaviour is not terribly usefull, it just spins in place. It's children will
 * be transformed accordingly.
 */

/**
 * --------------------------------
 */
define(["game-object-container"], function(GameObjectContainer){
	var Container = GameObjectContainer.extend({
		update: function(delta) {
			this._super();
			this.rotation++;
		}
	});

	return Container;
});