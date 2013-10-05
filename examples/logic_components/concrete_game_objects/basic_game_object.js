define(["game_object"], function(GameObject){

	var Basic = GameObject.extend({
		update: function(delta) {
			this.rotation += this.rotation_speed;
		}
	});

	return Basic;
});