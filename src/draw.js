/**
 * # draw.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is a collection of methods to ease the pain of using HTML5's [Canvas drawing API](https://developer.mozilla.org/en-US/docs/HTML/Canvas).
 * Not by much though, it's still pretty painfull. Believe me, I wrote a whole game only relaying
 * on it for graphics [CHECK IT OUT](http://www.treintipollo.com/tirador/index.html), it's pretty cool.
 *
 * There are some stuff missing, like individual method to wrap quadratic and cubic curves. There
 * are no helpers to draw a single line either.
 * These methods are hopefully to just ilustrate an idea and you won't be relying on them to get serious things done.
 *
 * **A note on all methods. If you don't specify a fill color, a stroke color or a line width, the current value set
 * in the context will be used.**
 */

/**
 * Doodling time
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {
	var DrawUtils = function() {}

	/**
	 * <p style='color:#AD071D'><strong>circle</strong></p>
	 *
	 * Well... you can draw a circle.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate of the registration point
	 * @param {Number} y Y coordinate of the registration point
	 * @param {Number} radius Radius of the circle
	 * @param {String|Number} [fillColor=null the circle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null the circle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.circle = function(context, x, y, radius, fillColor, strokeColor, lineWidth, close) {
		if (fillColor) context.fillStyle = fillColor;
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;

		if (close === undefined) close = true;

		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2, false);

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>rectangle</strong></p>
	 *
	 * A rectangle, yeah!
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate of the registration point
	 * @param {Number} y Y coordinate of the registration point
	 * @param {Number} width Width of the rectangle
	 * @param {Number} height Height of the rectangle
	 * @param {String|Number} [fillColor=null] Fill color for the rectangle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the rectangle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.rectangle = function(context, x, y, width, height, fillColor, strokeColor, lineWidth, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

		context.beginPath();
		context.rect(x, y, width, height);

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>triangle</strong></p>
	 *
	 * A triangle. This is getting interesting. Points of the triangle are drawn clock-wise.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} centerX X coordinate of the registration point. The rest of the points are relative to this
	 * @param {Number} centerY Y coordinate of the registration point. The rest of the points are relative to this
	 * @param {Number} x1 X coordinate of the first vertex
	 * @param {Number} y1 Y coordinate of the first vertex
	 * @param {Number} x2 X coordinate of the second vertex
	 * @param {Number} y2 Y coordinate of the second vertex
	 * @param {Number} x3 X coordinate of the third vertex
	 * @param {Number} y3 Y coordinate of the third vertex
	 * @param {String|Number} [fillColor=null] Fill color for the triangle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the triangle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the triangle. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.triangle = function(context, centerX, centerY, x1, y1, x2, y2, x3, y3, fillColor, strokeColor, lineWidth, scale, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

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

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>quadraticTriangle</strong></p>
	 *
	 * This one is pretty weird. It lets you define a triangle, with each side being drawn as a quadratic curve. Looks neat!
	 * You might want to look into what a <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves">quadratic curve</a> is.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} centerX X coordinate of the registration point. The rest of the points are relative to this
	 * @param {Number} centerY Y coordinate of the registration point. The rest of the points are relative to this
	 * @param {Number} x1 X coordinate of the first vertex
	 * @param {Number} y1 Y coordinate of the first vertex
	 * @param {Number} ax1 X coordinate of the first vertex's anchor point
	 * @param {Number} ay1 Y coordinate of the first vertex's anchor point
	 * @param {Number} x1 X coordinate of the second vertex
	 * @param {Number} y1 Y coordinate of the second vertex
	 * @param {Number} ax1 X coordinate of the second vertex's anchor point
	 * @param {Number} ay1 Y coordinate of the second vertex's anchor point
	 * @param {Number} x1 X coordinate of the third vertex
	 * @param {Number} y1 Y coordinate of the third vertex
	 * @param {Number} ax1 X coordinate of the third vertex's anchor point
	 * @param {Number} ay1 Y coordinate of the third vertex's anchor point
	 * @param {String|Number} [fillColor=null] Fill color for the triangle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the triangle can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the triangle. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.quadraticTriangle = function(context, centerX, centerY, x1, y1, ax1, ay1, x2, y2, ax2, ay2, x3, y3, ax3, ay3, fillColor, strokeColor, lineWidth, scale, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

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

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>polygon</strong> </p>
	 *
	 * This one is pretty usefull. Send in an array of points and lines will be ploted clock-wise to form the polygon.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} y Y coordinate registration point. All the points of the polygon are relative to this
	 * @param {Array} points An array of objects with the following form, {x:x, y:y}
	 * @param {String|Number} [fillColor=null] Fill color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.polygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

		if (!scale) scale = 1;

		context.beginPath();

		context.moveTo((points[0].x * scale) + x, (points[0].y * scale) + y);

		for (var i = 1; i < points.length; i++) {
			context.lineTo((points[i].x * scale) + x, (points[i].y * scale) + y);
		}

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>relativePolygon</strong> </p>
	 *
	 * This one is pretty usefull. Send in an array of points and lines will be ploted clock-wise to form the polygon.
	 * Each point is relative to the last one.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} y Y coordinate registration point. All the points of the polygon are relative to this
	 * @param {Array} points An array of objects with the following form, {x:x, y:y}
	 * @param {String|Number} [fillColor=null] Fill color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.relativePolygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

		if (!scale) scale = 1;

		context.beginPath();

		context.moveTo((points[0].x * scale) + x, (points[0].y * scale) + y);

		var lastAbsoluteX = points[0].x;
		var lastAbsoluteY = points[0].y;

		for (var i = 1; i < points.length; i++) {
			context.lineTo(((points[i].x + lastAbsoluteX) * scale) + x, ((points[i].y + lastAbsoluteY) * scale) + y);

			lastAbsoluteX = points[i].x + lastAbsoluteX;
			lastAbsoluteY = points[i].y + lastAbsoluteY;
		}

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>quadraticPolygon</strong></p>
	 *
	 * This is like the polygon but the lines between vertexes are drawn as quadratic curves.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} y Y coordinate registration point. All the points of the polygon are relative to this
	 * @param {String} points An array of objects with the following form, {x:x, y:y}. Note that since lines are quadratic curves, you need to provide anchor anchor points in between each pair of vertexes
	 * @param {String|Number} [fillColor=null] Fill color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.quadraticPolygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

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

		if (close) context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>quadraticPolygonAuto</strong></p>
	 *
	 * This is like the polygon but the lines between vertexes are drawn as quadratic curves.
	 * The anchor points for the quadratic curves are generated, by calculating the normals between each pair of points.
	 * The anchor points are generated alternating sides.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} y Y coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} anchorDistance Distance to which generated anchor points are placed from thir respective segments
	 * @param {String} points An array of objects with the following form, {x:x, y:y}.
	 * @param {String|Number} [fillColor=null] Fill color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [positive=false] On which side the anchor points should start alternation
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.quadraticPolygonAuto = function(context, x, y, anchorDistance, points, fillColor, strokeColor, lineWidth, scale, positive, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

		if (!scale) scale = 1;

		context.beginPath();

		var midX, midY;
		var anchorX, anchorY;
		var normalSide = positive;

		for (var i = 1; i < points.length; i++) {
			midX = (points[i - 1].x + points[i].x) / 2;
			midY = (points[i - 1].y + points[i].y) / 2;

			var angle = Math.atan2(points[i - 1].y - points[i].y, points[i - 1].x - points[i].x) + Math.PI / 2;

			if (normalSide) {
				anchorX = midX + Math.cos(angle) * anchorDistance;
				anchorY = midY + Math.sin(angle) * anchorDistance;
			} else {
				anchorX = midX + Math.cos(angle) * -anchorDistance;
				anchorY = midY + Math.sin(angle) * -anchorDistance;
			}

			context.moveTo((points[i - 1].x * scale) + x, (points[i - 1].y * scale) + y);
			context.quadraticCurveTo((anchorX * scale) + x, (anchorY * scale) + y, (points[i].x * scale) + x, (points[i].y * scale) + y);

			normalSide = !normalSide;
		}

		if (close) {
			context.moveTo((points[points.length - 1].x * scale) + x, (points[points.length - 1].y * scale) + y);
			context.lineTo((points[0].x * scale) + x, (points[0].y * scale) + y);
		}

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>quadraticPolygonAuto</strong></p>
	 *
	 * This is like the polygon but the lines between vertexes are drawn as quadratic curves.
	 * The anchor points for the quadratic curves are generated, by calculating the normals between each pair of points.
	 * The anchor points are generated alternating sides.
	 * More curves are generated between the connection points to achieve smoother connections
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} y Y coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} anchorDistance Distance to which generated anchor points are placed from thir respective segments
	 * @param {String} points An array of objects with the following form, {x:x, y:y}.
	 * @param {String|Number} [fillColor=null] Fill color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [positive=false] On which side the anchor points should start alternation
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.quadraticPolygonAutoSmooth = function(context, x, y, anchorDistance, points, fillColor, strokeColor, lineWidth, scale, positive, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

		if (!scale) scale = 1;

		context.beginPath();

		var normalSide = positive;

		var firstMidX, firstMidY;
		var secondMidX, secondMidY;
		var firstAnchorX, firstAnchorY;
		var secondAnchorX, secondAnchorY;

		var firstSmoothX, firstSmoothY;
		var secondSmoothX, secondSmoothY;
		var thirdSmoothX, thirdSmoothY;

		var begin = points[0];
		var end = points[points.length - 1];

		for (var i = 0; i < points.length; i++) {
			var last;
			var current;
			var next;

			if (i === points.length - 1) {
				last = points[i - 1];
				current = points[i];
				next = points[0];
			} else if (i === 0) {
				last = points[points.length - 1];
				current = points[i];
				next = points[1]
			} else {
				last = points[i - 1];
				current = points[i];
				next = points[i + 1];
			}

			firstMidX = (last.x + current.x) / 2;
			firstMidY = (last.y + current.y) / 2;

			secondMidX = (current.x + next.x) / 2;
			secondMidY = (current.y + next.y) / 2;

			var firstAngle = Math.atan2(last.y - current.y, last.x - current.x) + Math.PI / 2;
			var secondAngle = Math.atan2(current.y - next.y, current.x - next.x) + Math.PI / 2;

			// Generate the first anchor point
			if (normalSide) {
				firstAnchorX = firstMidX + Math.cos(firstAngle) * anchorDistance;
				firstAnchorY = firstMidY + Math.sin(firstAngle) * anchorDistance;
			} else {
				firstAnchorX = firstMidX + Math.cos(firstAngle) * -anchorDistance;
				firstAnchorY = firstMidY + Math.sin(firstAngle) * -anchorDistance;
			}

			normalSide = !normalSide;

			// Generate the second anchor point
			if (normalSide) {
				secondAnchorX = secondMidX + Math.cos(secondAngle) * anchorDistance;
				secondAnchorY = secondMidY + Math.sin(secondAngle) * anchorDistance;
			} else {
				secondAnchorX = secondMidX + Math.cos(secondAngle) * -anchorDistance;
				secondAnchorY = secondMidY + Math.sin(secondAngle) * -anchorDistance;
			}

			// Generate the points for the smoothing curve
			firstSmoothX = this.calculatePointInQuadraticCurveX(last.x, last.y, firstAnchorX, firstAnchorY, current.x, current.y, 0.2);
			firstSmoothY = this.calculatePointInQuadraticCurveY(last.x, last.y, firstAnchorX, firstAnchorY, current.x, current.y, 0.2);

			secondSmoothX = this.calculatePointInQuadraticCurveX(last.x, last.y, firstAnchorX, firstAnchorY, current.x, current.y, 0.8);
			secondSmoothY = this.calculatePointInQuadraticCurveY(last.x, last.y, firstAnchorX, firstAnchorY, current.x, current.y, 0.8);

			thirdSmoothX = this.calculatePointInQuadraticCurveX(current.x, current.y, secondAnchorX, secondAnchorY, next.x, next.y, 0.2);
			thirdSmoothY = this.calculatePointInQuadraticCurveY(current.x, current.y, secondAnchorX, secondAnchorY, next.x, next.y, 0.2);

			context.moveTo((firstSmoothX * scale) + x, (firstSmoothY * scale) + y);
			context.quadraticCurveTo((firstAnchorX * scale) + x, (firstAnchorY * scale) + y, (secondSmoothX * scale) + x, (secondSmoothY * scale) + y);
			context.quadraticCurveTo((current.x * scale) + x, (current.y * scale) + y, (thirdSmoothX * scale) + x, (thirdSmoothY * scale) + y);
		}

		if (close)
			context.closePath();

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>realtiveQuadraticPolygonAuto</strong></p>
	 *
	 * This is like the polygon but the lines between vertexes are drawn as quadratic curves.
	 * The anchor points for the quadratic curves are generated, by calculating the normals between each pair of points.
	 * The anchor points are generated alternating sides.
	 * Each point is relative to the last one.
	 *
	 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
	 * @param {Number} x X coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} y Y coordinate registration point. All the points of the polygon are relative to this
	 * @param {Number} anchorDistance Distance to which generated anchor points are placed from thir respective segments
	 * @param {String} points An array of objects with the following form, {x:x, y:y}.
	 * @param {String|Number} [fillColor=null] Fill color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.javascripter.net/faq/hextorgb.htm) or a number (If you are into that kind of bullshit)
	 * @param {Number} [lineWidth=null] Line width
	 * @param {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	 * @param {Boolean} [positive=false] On which side the anchor points should start alternation
	 * @param {Boolean} [close=true] Whether the path should be closed or not
	 */
	DrawUtils.prototype.realtiveQuadraticPolygonAuto = function(context, x, y, anchorDistance, points, fillColor, strokeColor, lineWidth, scale, positive, close) {
		if (strokeColor) context.strokeStyle = strokeColor;
		if (lineWidth) context.lineWidth = lineWidth;
		if (fillColor) context.fillStyle = fillColor;

		if (close === undefined) close = true;

		if (!scale) scale = 1;

		context.beginPath();

		var diffX, diffY;
		var anchorX, anchorY;
		var normalSide = positive;

		var lastAbsoluteX = points[0].x;
		var lastAbsoluteY = points[0].y;
		var currentAbsoluteX, currentAbsoluteY;

		for (var i = 1; i < points.length; i++) {
			diffX = ((points[i].x + lastAbsoluteX) + lastAbsoluteX) / 2;
			diffY = ((points[i].y + lastAbsoluteY) + lastAbsoluteY) / 2;

			var angle = Math.atan2(diffY, diffX) + Math.PI / 2;

			if (normalSide) {
				anchorX = diffX + Math.cos(angle) * anchorDistance;
				anchorY = diffY + Math.sin(angle) * anchorDistance;
			} else {
				anchorX = diffX + Math.cos(angle) * -anchorDistance;
				anchorY = diffY + Math.sin(angle) * -anchorDistance;
			}

			context.moveTo((lastAbsoluteX * scale) + x, (lastAbsoluteY * scale) + y);
			context.quadraticCurveTo((anchorX * scale) + x, (anchorY * scale) + y, ((points[i].x + lastAbsoluteX) * scale) + x, ((points[i].y + lastAbsoluteY) * scale) + y);

			normalSide = !normalSide;

			lastAbsoluteX = points[i].x + lastAbsoluteX;
			lastAbsoluteY = points[i].y + lastAbsoluteY;
		}

		if (close) {
			context.moveTo((points[points.length - 1].x * scale) + x, (points[points.length - 1].y * scale) + y);
			context.lineTo((points[0].x * scale) + x, (points[0].y * scale) + y);
		}

		if (fillColor) context.fill();
		if (strokeColor) context.stroke();
	}
	/**
	 * --------------------------------
	 */

	DrawUtils.prototype.calculatePointInQuadraticCurveX = function(startX, startY, anchorX, anchorY, endX, endY, p) {
		return (1 - p) * (1 - p) * startX + 2 * (1 - p) * p * anchorX + p * p * endX;
	}

	DrawUtils.prototype.calculatePointInQuadraticCurveY = function(startX, startY, anchorX, anchorY, endX, endY, p) {
		return (1 - p) * (1 - p) * startY + 2 * (1 - p) * p * anchorY + p * p * endY;
	}

	return new DrawUtils()
});
