define(['draw'], function(draw) {
	var p = null;
	var m = null;

	var debugDraw = function(context) {
		if(this.debug) {
			p = this.getTransform(p, m);

			context.save();
			context.setTransform(1, 0, 0, 1, 0, 0);			
			context.translate(p.x, p.y);

			// Draw the center of the object
			draw.circle(context, 0, 0, 3, null, "#FF00FF", 2);

			context.restore();

			if (!this.components) return;

			// Draw whatever the components want to draw
			for(var i=0; i<this.components.length; i++){
				this.components[i].debug_draw(context)
			}
		}
	}

	return debugDraw;
});