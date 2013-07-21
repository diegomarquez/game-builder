define(["game_object", "draw"], function(GameObject, draw){

	var Basic = GameObject.extend({
		init: function() {
			this._super();
		},

		reset: function(x, y, rSpeed, color){
			this.x = x;
			this.y = y;

			this.rSpeed = rSpeed;
			this.color = color;

			this.centerX = 10;
			this.centerY = 10;
		},

		update: function(delta) {
			this.rotation += this.rSpeed;
		},

		draw: function(context) {
			draw.rectangle(context, 0, 0, 20, 20, null, this.color, 1);
		}
	});

	return Basic;
});