define(["game_object", "draw"], function(GameObject, draw){

	var Basic = GameObject.extend({
		init: function() {
			this._super();

			this.centerX = 10;
			this.centerY = 10;
		},

		update: function(delta) {
			this.rotation += 2;
		},

		draw: function(context) {
			draw.rectangle(context, 0, 0, 20, 20, null, "#ffffff", 1);
		}
	});

	return Basic;
});