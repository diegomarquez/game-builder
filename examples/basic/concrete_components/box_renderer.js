define(["renderer", "draw"], function(Renderer, Draw) {
	var BoxRenderer = Renderer.extend({
		draw: function(context) {
			Draw.rectangle(context, -10, -10, 20, 20, this.color, this.color, 1);
		}
	});

	return BoxRenderer;
});