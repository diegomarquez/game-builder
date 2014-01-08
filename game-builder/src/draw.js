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
 * This is a collection of methods to ease the pain of using HTML5's [Canvas drawing API](http://www.w3schools.com/tags/ref_canvas.asp). 
 * Not by much though, it's still pretty painfull. Believe me, I did I wrote a whole game only relaying
 * on it for graphics [SHAMELESS SELF PUBLICITY](http://www.treintipollo.com/tirador/index.html)
 *
 * There are some stuff missing, like individual method to wrap quadratic and cubic curves. 
 * These methods are hopefully to just ilustrate an idea and you won't be relying on them to get serious things done.
 *
 * **A note on all method. If you don't specify a fill color, a stroke color or a line width, the current value set
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
	 * <p style='color:#AD071D'><strong>circle</strong> Well... you can draw a circle.</p>
	 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	 * @param  {Number} x           X coordinate of the registration point
	 * @param  {Number} y           Y coordinate of the registration point
	 * @param  {Number} radius      Radius of the circle
	 * @param  {String|Number} [fillColor=null the circle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	 * @param  {String|Number} [strokeColor=null the circle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number
	 * @param  {Number} [lineWidth=null] Line width
	 * @return {null}             	
	 */
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
	/**
	 * --------------------------------
	 */

	 /**
	  * <p style='color:#AD071D'><strong>rectangle</strong> A rectangle, yeah!</p>
	  * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	  * @param  {Number} x           X coordinate of the registration point
	  * @param  {Number} y           Y coordinate of the registration point
	  * @param  {Number} width       Width of the rectangle
	  * @param  {Number} height      Height of the rectangle
	  * @param  {String|Number} [fillColor=null]   Fill color for the rectangle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {String|Number} [strokeColor=null] Stroke color for the rectangle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {Number} [lineWidth=null]   Line width
	  * @return {null}            
	  */
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
	/**
	 * --------------------------------
	 */

	 /**
	  * <p style='color:#AD071D'><strong>triangle</strong> A triangle. This is getting interesting. Points of the triangle are drawn clock-wise.</p>
	  * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	  * @param  {Number} centerX     X coordinate of the registration point. The rest of the points are relative to this
	  * @param  {Number} centerY     Y coordinate of the registration point. The rest of the points are relative to this
	  * @param  {Number} x1          X coordinate of the first vertex
	  * @param  {Number} y1          Y coordinate of the first vertex
	  * @param  {Number} x2          X coordinate of the second vertex
	  * @param  {Number} y2          Y coordinate of the second vertex
	  * @param  {Number} x3          X coordinate of the third vertex
	  * @param  {Number} y3          Y coordinate of the third vertex
	  * @param  {String|Number} [fillColor=null]   Fill color for the triangle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {String|Number} [strokeColor=null] Stroke color for the triangle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {Number} [lineWidth=null]   Line width
	  * @param  {Number} [scale=1] Scale of the triangle. This can be usefull to avoid recalculating vertex position
	  * @return {null}             
	  */
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
	/**
	 * --------------------------------
	 */

	 /**
	  * <p style='color:#AD071D'><strong>quadraticTriangle</strong> This one is pretty weird. It lets you define a triangle, with each side being drawn as a quadratic curve. Looks neat!
	  * You might want to look into what a <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves">quadratic curve</a> is.</p>
	  * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	  * @param  {Number} centerX     X coordinate of the registration point. The rest of the points are relative to this
	  * @param  {Number} centerY     Y coordinate of the registration point. The rest of the points are relative to this
	  * @param  {Number} x1          X coordinate of the first vertex
	  * @param  {Number} y1          Y coordinate of the first vertex
	  * @param  {Number} ax1         X coordinate of the first vertex's anchor point
	  * @param  {Number} ay1         Y coordinate of the first vertex's anchor point
	  * @param  {Number} x1          X coordinate of the second vertex
	  * @param  {Number} y1          Y coordinate of the second vertex
	  * @param  {Number} ax1         X coordinate of the second vertex's anchor point
	  * @param  {Number} ay1         Y coordinate of the second vertex's anchor point
	  * @param  {Number} x1          X coordinate of the third vertex
	  * @param  {Number} y1          Y coordinate of the third vertex
	  * @param  {Number} ax1         X coordinate of the third vertex's anchor point
	  * @param  {Number} ay1         Y coordinate of the third vertex's anchor point
	  * @param  {String|Number} [fillColor=null]   Fill color for the triangle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {String|Number} [strokeColor=null] Stroke color for the triangle can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {Number} [lineWidth=null]   Line width
	  * @param  {Number} [scale=1] Scale of the triangle. This can be usefull to avoid recalculating vertex position
	  * @return {null}
	  */
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
	/**
	 * --------------------------------
	 */

	 /**
	  * <p style='color:#AD071D'><strong>polygon</strong> This one is pretty usefull. Send in an array of points and lines will be ploted clock-wise to form the polygon.</p>
	  * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	  * @param  {Number} x           X coordinate registration point. All the points of the polygon are relative to this
	  * @param  {Number} y           Y coordinate registration point. All the points of the polygon are relative to this
	  * @param  {Array} points       An array of objects with the following form, {x:x, y:y}
	  * @param  {String|Number} [fillColor=null]   Fill color for the polygon can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {Number} [lineWidth=null]   Line width
	  * @param  {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	  * @return {null}
	  */
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
	/**
	 * --------------------------------
	 */

	 /**
	  * <p style='color:#AD071D'><strong>quadraticPolygon</strong> This is like the polygon but the lines between vertexes are drawn as quadratic curves.</p>
	  * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
	  * @param  {Number} x           X coordinate registration point. All the points of the polygon are relative to this
	  * @param  {Number} y           Y coordinate registration point. All the points of the polygon are relative to this
	  * @param  {String} points      An array of objects with the following form, {x:x, y:y}. Note that since lines are quadratic curves, you need to provide anchor anchor points in between each pair of vertexes  
	  * @param  {String|Number} [fillColor=null]   Fill color for the polygon can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {String|Number} [strokeColor=null] Stroke color for the polygon can be a [hex string](http://www.w3schools.com/html/html_colors.asp) or a number (If you are into that kind of bullshit)
	  * @param  {Number} [lineWidth=null]   Line width
	  * @param  {Number} [scale=1] Scale of the polygon. This can be usefull to avoid recalculating vertex position
	  * @return {null}
	  */
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
	/**
	 * --------------------------------
	 */

	return new DrawUtils()
});