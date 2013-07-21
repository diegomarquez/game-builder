define(["game_object_container", "draw"], function(GameObjectContainer, draw){

	var Container = GameObjectContainer.extend({
		init: function() {
			this._super();
		},

		draw: function(context) {
			draw.rectangle(context, 0, 0, 20, 20, null, "#ff0000", 1);
		}
	});

	return Container;
});