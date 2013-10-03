define(["renderer", "draw"], function(Renderer, Draw) {
	var BoxRenderer = Renderer.extend({
		draw: function(context) {
			Draw.rectangle(context, -50, -50, 100, 100, this.color, this.color, 1);
		}
	});

	return BoxRenderer;
});