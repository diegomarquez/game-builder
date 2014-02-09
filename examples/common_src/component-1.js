/**
 * # component-1.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [component](@@component@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is a very basic example of a [component](@@component@@)
 */

/**
 * --------------------------------
 */
define(['component'], function(Component){
	// Here the parent property refers to the [game-object](@@game-object@@) 
	// that has this component attached.
	var Component = Component.extend({
		// As expected this is called when the parent [game-object](@@game-object@@) is started.
		start: function() {
			this.startPos = false;
			this.lastX;
			this.lastY;
		},

		// This is called after the update of the parent [game-object](@@game-object@@)
		update: function() {
			if(this.startPos){
				this.parent.x = this.lastX;
				this.parent.y = this.lastY;
			}else {
				this.lastX = this.parent.x;
				this.lastY = this.parent.y;

				this.amount *= -1

				this.parent.x += Math.random() * this.amount;
				this.parent.y += Math.random() * this.amount;
			}

			this.startPos = !this.startPos;
		}
	});

	return Component;
});