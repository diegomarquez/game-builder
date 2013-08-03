define(["game_object", "draw"], function(GameObject, draw){

	var Basic = GameObject.extend({
		init: function() {
			this._super();
		},

		start: function(x, y, rSpeed, color){
			this._super();

			this.x 		= x 	 || this.args.x;
			this.y 		= y 	 || this.args.y;
			this.rSpeed = rSpeed || this.args.rSpeed;
			this.color  = color  || this.args.color;
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