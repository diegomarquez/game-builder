define(["game_object_container"], function(GameObjectContainer){

	var Container = GameObjectContainer.extend({
		init: function() {
			this._super();
		},

		start: function(x, y) {
			this._super();
			
			this.x = x || this.args.x;
			this.y = y || this.args.y;
		},

		update: function(delta) {
			this._super();
			this.rotation++;
		}
	});

	return Container;
});