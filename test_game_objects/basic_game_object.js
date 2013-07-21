define(["game_object", "draw"], function(GameObject, draw){

	var Basic = GameObject.extend({
		init: function() {
			this._super();
		},

		draw: function(context) {
			draw.rectangle(context, 0, 0, 20, 20, null, "#ffffff", 1);
		}
	});

	return Basic;
});