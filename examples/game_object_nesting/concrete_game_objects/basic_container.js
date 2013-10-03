define(["game_object_container"], function(GameObjectContainer){
	var Container = GameObjectContainer.extend({
		update: function(delta) {
			this._super();
			this.rotation++;
		}
	});

	return Container;
});