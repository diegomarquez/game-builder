define(["game-object"], function(GameObject){

	var GameObjectContainer = GameObject.extend({
		init: function() {
			this._super();
		},

		start: function() {
			this._super();

			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].start();
			}
		},

		add: function(child) {
			if(!child) return;

			if(!this.childs) this.childs = [];

			if(child.parent) {
				child.parent.remove(child);
			}

			child.parent = this;

			this.childs.push(child);

			return child;	
		},

		remove: function(child) {
			if(!child) return;

			child.parent = null;

			if(!this.childs) return;

			this.childs.splice(this.childs.indexOf(child), 1); 
		},

		update: function(delta) {
			if(!this.childs) return;

			var child = null

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.canUpdate) continue;

				child.update(delta);

				if(!child.components)  continue;

				for(var k=0; k<child.components.length; k++) {
					if(child.components[k].update) {
						child.components[k].update(delta);
					}
				}	
			}
		},

		transformAndDraw: function(context) {
			context.save();
			
			this._super(context);

			if(!this.childs) {
				context.restore();
				return;
			} 
				
			var child = null;

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.canDraw) continue;

				context.save();
				child.transformAndDraw(context);
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
		},

		clear: function() {
			if(this.childs) {				
				while(this.childs.length) {
					this.childs.pop().clear();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this._super();
		}
	});

	return GameObjectContainer;
});