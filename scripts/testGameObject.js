function Test() {}

Test.inheritsFrom( GameObject );

Test.prototype.init = function(x, y) {
	this.x         = x;
	this.y         = y;
}

Test.prototype.draw = function(context) { 	
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	
	context.moveTo(0, -10);	
	context.lineTo(0, 10);

	context.moveTo(-10, 0);
	context.lineTo(10, 0);

	context.moveTo(-5, -5);
	context.lineTo(5, 5);

	context.moveTo(5, -5);
	context.lineTo(-5, 5);

	context.closePath();

	context.stroke();
}