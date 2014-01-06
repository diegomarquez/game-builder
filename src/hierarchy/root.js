define(["game-object-container"], function(Container){
	var Root = Container.extend({
		transformAndDraw: function(context) {
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			this._super(context);
		}
	});

	return new Root();
});