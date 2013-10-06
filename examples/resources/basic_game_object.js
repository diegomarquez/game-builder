define(["game_object"], function(GameObject){
	//A very basic game_object with some logic, not really usefull at all but as an example.
	var Basic = GameObject.extend({
		update: function(delta) {
			this.rotation += this.rotation_speed;
		},

		//This method needs to be defined if a game_object has a collider component attached
		//Might change in the future, haven't figured out what is the best way to do this yet
		onCollide: function(other) {
			console.log(this.typeId + " Collided with " + other.typeId)
		}
	});

	return Basic;
});