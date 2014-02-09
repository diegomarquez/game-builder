/**
 * # basic-game-object.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [game-object](@@game-object@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * A very basic example on how to extend the base [game-object](@@game-object@@).
 * This thing doesn't do anything particularly useful. It just spins.
 */

/**
 * --------------------------------
 */
define(["game-object"], function(GameObject){
	//A very basic game-object with some logic, not really usefull at all but as an example.
	var Basic = GameObject.extend({
		update: function(delta) {
			this.rotation += this.rotation_speed;
		},

		//This method needs to be defined if a game-object has a collider component attached
		//Might change in the future, haven't figured out what is the best way to do this yet
		onCollide: function(other) {
			console.log(this.typeId + " Collided with " + other.typeId)
		}
	});

	return Basic;
});