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
					child[k].components.update();
				}	
			}
		},

		transformAndDraw: function(context) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);

			context.save();
			
			this._super(context, false);

			if(!this.childs) {
				context.restore();
				return;
			} 
				
			for(var i=0; i<this.childs.length; i++){
				if(!this.childs[i].alive) continue;

				context.save();
				this.childs[i].transformAndDraw(context, false);
				context.restore();
			}

			context.restore();
		}
	});

	return new Root();
});