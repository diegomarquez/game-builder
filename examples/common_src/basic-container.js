define(["game-object-container"], function(GameObjectContainer){
	//Very basic example of what a container game-object looks like.
	//This one has some logic to demonstrate how childs of it, will follow
	//according to the transformation of the parent.
	var Container = GameObjectContainer.extend({
		update: function(delta) {
			this._super();
			this.rotation++;
		}
	});

	return Container;
});