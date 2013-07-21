define(["game_object"], function(GameObject){

	var GameObjectContainer = GameObject.extend({
		init: function() {
			this._super();

			this.childs = null;
		},

		add: function(child) {
			if(!child) return;

			if(!this.childs) this.childs = [];

			child.parent = this;

			this.childs.push(child);	
		},

		remove: function(child) {
			if(!child) return;

			child.parent = null;

			if(!this.childs) return;

			this.childs.splice(this.childs.indexOf(child), 1);
		},

		update: function(delta) {
			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].update(delta);
			}
		},

		transformAndDraw: function(context) {
			context.save();

			this._super(context);

			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				context.save();
				this.childs[i].transformAndDraw(context);
				context.restore();
			}

			context.restore();
		},
		
		destroy: function() {
			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].destroy();
			}

			this.childs.length = 0;
			this.childs = null;
		}
	});

	return GameObjectContainer;
});