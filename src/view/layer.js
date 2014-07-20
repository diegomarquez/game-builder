/**
 * # layer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [delegate](@@delegate@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is the type of objects that [videport](@@videport@@) uses to determine the order in which [game-objects](@@game-object@@)
 * should be drawn
 */

/**
 * Visual organization
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate"], function(Delegate){
	var Layer = Delegate.extend({
		init: function() {
			this.name = "";
			this.gameObjects = [];
			this.visible = true;
		},

		add: function(go) { 
			this.gameObjects.push(go); 
		},

		remove: function(go) { 
			this.gameObjects.splice(this.gameObjects.indexOf(go), 1); 
		},

		removeAll: function(go) { 
			this.gameObjects = []; 
		},

		draw: function(context, x, y, offsetX, offsetY, width, height) {
			if (!this.visible) return;

			for (var i = 0; i < this.gameObjects.length; i++) {
				this.gameObjects[i].draw(context, x, y, offsetX, offsetY, width, height);
			}
		},

		show: function() { 
			this.visible = true; 
		},

		hide: function() { 
			this.visible = false; 
		},

		isVisible: function() { 
			return this.visible; 
		}
	});

	return Layer;
});