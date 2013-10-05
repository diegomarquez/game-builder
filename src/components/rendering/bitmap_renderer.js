define(["component"], function(Component) {
	var Renderer = Component.extend({
		init: function() {
			this.image = new Image();

			this.offsetX = 0;
			this.offsetY = 0;
		},

		start: function() {
			this.image.src = this.path;
		},

		render: function(context) {
			context.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height);	
		}
	});

	return Renderer;
});