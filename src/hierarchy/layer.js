/**
 * # layer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object-container](@@game-object-container@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines a special kind of [game-object-container](@@game-object-container@@).
 *
 * It's only purpose it be used by [layers](@@layers@@) as a way to organize visual
 * elements in a way that makes sense.
 *
 * It behaives exactly like a [game-object-container](@@game-object-container@@) except
 * for the fact it redefines the **clear** method so that it only removes all children.
 */

/**
 * Visual organization
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["game-object-container"], function(Container){
	var Layer = Container.extend({
		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * This is normally called through [layers](@@layers@@) to empty a 
		 * layer, but it could be called manually, assuming you can get a hold
		 * of a reference.
		 */
		clear: function() {
			if(this.childs) {	
				while(this.childs.length) {
					this.childs.pop().clear();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this.execute('clear', this);
		}
	});

	return Layer;
});