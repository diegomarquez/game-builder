define(['component'], function(Component){
	//Here the parent property refers to the game_object that has this component attached.
	//This logic is rather mundane, but it's just an example.
	var Component = Component.extend({
		//As expected this is called when the parent game_object is started.
		start: function() {
			this.startPos = false;
			this.lastX;
			this.lastY;
		},

		//This is called after the update of the parent game_object
		update: function() {
			if(this.startPos){
				this.parent.x = this.lastX;
				this.parent.y = this.lastY;
			}else {
				this.lastX = this.parent.x;
				this.lastY = this.parent.y;

				this.amount *= -1

				this.parent.x += Math.random() * this.amount;
				this.parent.y += Math.random() * this.amount;
			}

			this.startPos = !this.startPos;
		}
	});

	return Component;
});