define(["game_object_container"], function(Container){
	var Root = Container.extend({
		init: function() {
			this._super();
		},

		update: function(delta) {
			if(!this.childs) return;

			var child = null

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.alive) continue;

				child.update(delta);

				if(!child.components)  continue;

				for(var k=0; k<child.components.length; k++) {
					child.components[k].update();
				}	
			}
		},

		transformAndDraw: function(context) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			this._super(context);
		}
	});

	return new Root();
});