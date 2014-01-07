define(["renderer", "draw"], function(Renderer, Draw) {
	//Really basic renderer for the purpose of this examples.

	//context property is the context of the canvas we are using, somehow it becomes available here.
	var BoxRenderer = Renderer.extend({
		draw: function(context) {
			Draw.rectangle(context, this.offsetX, this.offsetY, this.width, this.height, this.color, this.color, 1);
		}
	});

	return BoxRenderer;
});