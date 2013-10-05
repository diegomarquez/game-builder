define(["component"], function(Component) {
	var Renderer = Component.extend({
		init: function() {
			this._super()

			this.image = new Image();

			this.offsetX = 0;
			this.offsetY = 0;
		},

		start: function() {
			this.image.src = this.path;
		},

		draw: function(context) {
			var w, h;

			if(this.width && this.height) {
				w = this.width;
				h = this.height;
			}else {
				w = this.image.width;
				h = this.image.height;
			}

			if(this.offset == 'center'){
				context.drawImage(this.image, -w/2, -h/2, w, h);	
			}
			else{
				context.drawImage(this.image, this.offsetX, this.offsetY, w, h);		
			}
		}
	});

	return Renderer;
});