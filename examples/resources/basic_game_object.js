define(["game_object"], function(GameObject){
	//A very basic game_object with some logic, not really usefull at all but as an example.
	var Basic = GameObject.extend({
		update: function(delta) {
			this.rotation += this.rotation_speed;
		}
	});

	return Basic;
});