define(function() {
	var DrawUtils = function() {}

	DrawUtils.prototype.circle = function(context, x, y, radius, fillColor, strokeColor, lineWidth) {
		if (fillColor) context.fillStyle = fillColor;
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;

		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2, false);
		context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}

	DrawUtils.prototype.rectangle = function(context, x, y, width, height, fillColor, strokeColor, lineWidth) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		context.beginPath();
		context.rect(x, y, width, height);
		context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}

	DrawUtils.prototype.triangle = function(context, centerX, centerY, x1, y1, x2, y2, x3, y3, fillColor, strokeColor, lineWidth, scale) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (!scale) scale = 1;

		x1 *= scale;
		x2 *= scale;
		x3 *= scale;
		y1 *= scale;
		y2 *= scale;
		y3 *= scale;

		x1 += centerX;
		x2 += centerX;
		x3 += centerX;
		y1 += centerY;
		y2 += centerY;
		y3 += centerY;

		context.beginPath();

		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineTo(x3, y3);

		context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}

	DrawUtils.prototype.quadraticTriangle = function(context, centerX, centerY, x1, y1, ax1, ay1, x2, y2, ax2, ay2, x3, y3, ax3, ay3, fillColor, strokeColor, lineWidth, scale) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (!scale) scale = 1;

		x1 *= scale;
		x2 *= scale;
		x3 *= scale;
		y1 *= scale;
		y2 *= scale;
		y3 *= scale;
		ax1 *= scale;
		ax2 *= scale;
		ax3 *= scale;
		ay1 *= scale;
		ay2 *= scale;
		ay3 *= scale;

		x1 += centerX;
		x2 += centerX;
		x3 += centerX;
		y1 += centerY;
		y2 += centerY;
		y3 += centerY;
		ax1 += centerX;
		ax2 += centerX;
		ax3 += centerX;
		ay1 += centerY;
		ay2 += centerY;
		ay3 += centerY;

		context.beginPath();

		context.moveTo(x1, y1);
		context.quadraticCurveTo(ax1, ay1, x2, y2);
		context.quadraticCurveTo(ax2, ay2, x3, y3);
		context.quadraticCurveTo(ax3, ay3, x1, y1);

		context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}

	DrawUtils.prototype.polygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (!scale) scale = 1;

		context.beginPath();

		context.moveTo((points[0].x * scale) + x, (points[0].y * scale) + y);

		for (var i = 1; i < points.length; i++) {
			context.lineTo((points[i].x * scale) + x, (points[i].y * scale) + y);
		}

		context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}

	DrawUtils.prototype.quadraticPolygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (!scale) scale = 1;

		context.beginPath();

		context.moveTo((points[0].x * scale) + x, (points[0].y * scale) + y);

		for (var i = 1; i < points.length; i += 2) {

			var next = i + 1;

			if (next >= points.length) {
				next = 0;
			}

			context.quadraticCurveTo((points[i].x * scale) + x, (points[i].y * scale) + y, (points[next].x * scale) + x, (points[next].y * scale) + y);
		}

		context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}

	return new DrawUtils()
});