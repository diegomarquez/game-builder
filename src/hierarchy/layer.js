define(["game-object-container"], function(Container){
	var Layer = Container.extend({
		clear: function() {
			if(this.childs) {	
				while(this.childs.length) {
					this.childs.pop().clear();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this.execute('cleared', this);
		}
	});

	return Layer;
});