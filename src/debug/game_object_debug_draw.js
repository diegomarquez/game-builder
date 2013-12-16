define(['draw'], function(draw) {
	var debugDraw = function(context) {
		if(this.debug) {
			// Draw the center of the object
			draw.circle(context, 0, 0, 3, null, "#FF00FF", 2);

			if (!this.components) return;

			// Draw whatever the components want to draw
			for(var i=0; i<this.components.length; i++){
				if(this.components[i].draw) {
					this.components[i].draw(context)
				}
			}
		}
	}

	return debugDraw;
});