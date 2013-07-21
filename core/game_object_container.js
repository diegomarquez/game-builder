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
			this._super(context);

			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].transformAndDraw(context);
			}
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