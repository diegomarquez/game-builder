define(["game_object", "draw"], function(GameObject, draw){

	var Basic = GameObject.extend({
		init: function() {
			this._super();
		},

		reset: function(x, y, rSpeed, color){
			this._super();

			this.x = x;
			this.y = y;

			this.rSpeed = rSpeed;
			this.color = color;
		},

		update: function(delta) {
			this.rotation += this.rSpeed;
		},

		draw: function(context) {
			draw.rectangle(context, -10, -10, 20, 20, null, this.color, 1);
		}
	});

	return Basic;
});