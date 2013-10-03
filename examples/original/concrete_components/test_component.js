define(['component'], function(Component){
	var Component = Component.extend({
		start: function() {
			this.startPos = false;
			this.lastX;
			this.lastY;
		},

		update: function() {
			if(this.startPos){
				this.parent.x = this.lastX;
				this.parent.y = this.lastY;
			}else {
				this.lastX = this.parent.x;
				this.lastY = this.parent.y;

				this.parent.x += Math.random() * this.rotationSpeed;
				this.parent.y += Math.random() * this.rotationSpeed;
			}

			this.startPos = !this.startPos;
		}
	});

	return Component;
});