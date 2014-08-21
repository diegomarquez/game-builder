/**
 * # sat.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: [vector-2D](@@vector-2D@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module was not actually made by me, I just took some code in github and made a requireJS module
 * out of it. [The original code is in here](https://github.com/jriecken/sat-js). 
 * The documentation in there should be enough to understand how to use this. 
 *
 * I added a few things, but nothing of true interest. The main code is largely unchanged.
 */

define(['vector-2D'], function(Vector) {

  var T_VECTORS = [];
  for (var i = 0; i < 10; i++) {
    T_VECTORS.push(new Vector());
  }
  
  var T_ARRAYS = [];
  for (var i = 0; i < 5; i++) {
    T_ARRAYS.push([]);
  }


  var Circle = function(pos, r) {
    this['pos'] = this.pos = pos || new Vector();
    this['r'] = this.r = r || 0;
  };

  var Polygon = function(pos, points) {
    this['pos'] = this.pos = pos || new Vector();
    this['points'] = this.points = points || [];
    this.recalc();
  };

  Polygon.prototype.recalc = function() {
    var points = this.points;
    var len = points.length;
    this.edges = [];
    this.normals = [];
    for (var i = 0; i < len; i++) {
      var p1 = points[i];
      var p2 = i < len - 1 ? points[i + 1] : points[0];
      var e = new Vector().copy(p2).sub(p1);
      var n = new Vector().copy(e).perp().normalize();
      this.edges.push(e);
      this.normals.push(n);
    }
  };

  var FixedSizePolygon = function(pos, points) {
    this['pos'] = this.pos = pos || new Vector();
    this['points'] = this.points = points || [];
    
    this.edges = [];
    this.normals = [];

    for(var i=0; i<this.points.length; i++) {
      this.edges.push(new Vector());
      this.normals.push(new Vector());
    }

    this.recalc();
  };

  FixedSizePolygon.prototype.recalc = function() {    
    for (var i = 0; i < this.points.length; i++) {
      var p = i < this.points.length - 1 ? this.points[i + 1] : this.points[0];

      this.edges[i].copy(p).sub(this.points[i]);
      this.normals[i].copy(this.edges[i]).perp().normalize();
    }
  };

  var Response = function() {
    this['a'] = this.a = null;
    this['b'] = this.b = null;
    this['overlapN'] = this.overlapN = new Vector(); // Unit vector in the direction of overlap
    this['overlapV'] = this.overlapV = new Vector(); // Subtract this from a's position to extract it from b
    this.clear();
  };
  
  Response.prototype.clear = function() {
    this['aInB'] = this.aInB = true; // Is a fully inside b?
    this['bInA'] = this.bInA = true; // Is b fully inside a?
    this['overlap'] = this.overlap = Number.MAX_VALUE; // Amount of overlap (magnitude of overlapV). Can be 0 (if a and b are touching)
    return this;
  };

  var flattenPointsOn = function(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++) {
      // Get the magnitude of the projection of the point onto the normal
      var dot = points[i].dot(normal);
      if (dot < min) {
        min = dot;
      }
      if (dot > max) {
        max = dot;
      }
    }
    result[0] = min;
    result[1] = max;
  };

  var isSeparatingAxis = function(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // Get the magnitude of the offset between the two polygons
    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV);
      T_ARRAYS.push(rangeA);
      T_ARRAYS.push(rangeB);
      return true;
    }
    // If we're calculating a response, calculate the overlap.
    if (response) {
      var overlap = 0;
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response.aInB = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) {
          overlap = rangeA[1] - rangeB[0];
          response.bInA = false;
          // B is fully inside A. Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
        // B starts further left than A
      } else {
        response.bInA = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) {
          overlap = rangeA[0] - rangeB[1];
          response.aInB = false;
          // A is fully inside B. Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      var absOverlap = Math.abs(overlap);
      if (absOverlap < response.overlap) {
        response.overlap = absOverlap;
        response.overlapN.copy(axis);
        if (overlap < 0) {
          response.overlapN.reverse();
        }
      }
    }
    T_VECTORS.push(offsetV);
    T_ARRAYS.push(rangeA);
    T_ARRAYS.push(rangeB);
    return false;
  };

  var LEFT_VORNOI_REGION = -1;
  var MIDDLE_VORNOI_REGION = 0;
  var RIGHT_VORNOI_REGION = 1;

  var vornoiRegion = function(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    if (dp < 0) {
      return LEFT_VORNOI_REGION;
    } else if (dp > len2) {
      return RIGHT_VORNOI_REGION;
    } else {
      return MIDDLE_VORNOI_REGION;
    }
  };

  var testCircleCircle = function(a, b, response) {
    var differenceV = T_VECTORS.pop().copy(b.pos).sub(a.pos);
    var totalRadius = a.r + b.r;
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    if (distanceSq > totalRadiusSq) {
      // They do not intersect
      T_VECTORS.push(differenceV);
      return false;
    }
    // They intersect. If we're calculating a response, calculate the overlap.
    if (response) {
      var dist = Math.sqrt(distanceSq);
      response.a = a;
      response.b = b;
      response.overlap = totalRadius - dist;
      response.overlapN.copy(differenceV.normalize());
      response.overlapV.copy(differenceV).scale(response.overlap);
      response.aInB = a.r <= b.r && dist <= b.r - a.r;
      response.bInA = b.r <= a.r && dist <= a.r - b.r;
    }
    T_VECTORS.push(differenceV);
    return true;
  };

  var testPolygonCircle = function(polygon, circle, response) {
    var circlePos = T_VECTORS.pop().copy(circle.pos).sub(polygon.pos);
    var radius = circle.r;
    var radius2 = radius * radius;
    var points = polygon.points;
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();

    // For each edge in the polygon
    for (var i = 0; i < len; i++) {
      var next = i === len - 1 ? 0 : i + 1;
      var prev = i === 0 ? len - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;

      // Get the edge
      edge.copy(polygon.edges[i]);
      // Calculate the center of the cirble relative to the starting point of the edge
      point.copy(circlePos).sub(points[i]);

      // If the distance between the center of the circle and the point
      // is bigger than the radius, the polygon is definitely not fully in
      // the circle.
      if (response && point.len2() > radius2) {
        response.aInB = false;
      }

      // Calculate which Vornoi region the center of the circle is in.
      var region = vornoiRegion(edge, point);
      if (region === LEFT_VORNOI_REGION) {
        // Need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
        edge.copy(polygon.edges[prev]);
        // Calculate the center of the circle relative the starting point of the previous edge
        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
        region = vornoiRegion(edge, point2);
        if (region === RIGHT_VORNOI_REGION) {
          // It's in the region we want. Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            T_VECTORS.push(point2);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap
            response.bInA = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        T_VECTORS.push(point2);
      } else if (region === RIGHT_VORNOI_REGION) {
        // Need to make sure we're in the left region on the next edge
        edge.copy(polygon.edges[next]);
        // Calculate the center of the circle relative to the starting point of the next edge
        point.copy(circlePos).sub(points[next]);
        region = vornoiRegion(edge, point);
        if (region === LEFT_VORNOI_REGION) {
          // It's in the region we want. Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap
            response.bInA = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        // MIDDLE_VORNOI_REGION
      } else {
        // Need to check if the circle is intersecting the edge,
        // Change the edge into its "edge normal".
        var normal = edge.perp().normalize();
        // Find the perpendicular distance between the center of the
        // circle and the edge.
        var dist = point.dot(normal);
        var distAbs = Math.abs(dist);
        // If the circle is on the outside of the edge, there is no intersection
        if (dist > 0 && distAbs > radius) {
          T_VECTORS.push(circlePos);
          T_VECTORS.push(normal);
          T_VECTORS.push(point);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;
          // If the center of the circle is on the outside of the edge, or part of the
          // circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) {
            response.bInA = false;
          }
        }
      }

      // If this is the smallest overlap we've seen, keep it.
      // (overlapN may be null if the circle was in the wrong Vornoi region)
      if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
        response.overlap = overlap;
        response.overlapN.copy(overlapN);
      }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
      response.a = polygon;
      response.b = circle;
      response.overlapV.copy(response.overlapN).scale(response.overlap);
    }
    T_VECTORS.push(circlePos);
    T_VECTORS.push(edge);
    T_VECTORS.push(point);
    return true;
  };
  

  var testCirclePolygon = function(circle, polygon, response) {
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
      // Swap A and B in the response.
      var a = response.a;
      var aInB = response.aInB;
      response.overlapN.reverse();
      response.overlapV.reverse();
      response.a = response.b;
      response.b = a;
      response.aInB = response.bInA;
      response.bInA = aInB;
    }
    return result;
  };

  var testPolygonPolygon = function(a, b, response) {
    var aPoints = a.points;
    var aLen = aPoints.length;
    var bPoints = b.points;
    var bLen = bPoints.length;
    
    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
      if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response)) {
        return false;
      }
    }
    
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0; i < bLen; i++) {
      if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
        return false;
      }
    }

    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis). Calculate the
    // final overlap vector.
    if (response) {
      response.a = a;
      response.b = b;
      response.overlapV.copy(response.overlapN).scale(response.overlap);
    }

    return true;
  };

  var UNIT_SQUARE = new Polygon(new Vector(), [new Vector(0,0), new Vector(1,0), new Vector(1,1), new Vector(0,1)]);
  var T_RESPONSE = new Response();

  var pointInPolygon = function(p, poly) {
    UNIT_SQUARE['pos'].copy(p);
    T_RESPONSE.clear();
    var result = testPolygonPolygon(UNIT_SQUARE, poly, T_RESPONSE);
    if (result) {
      result = T_RESPONSE['aInB'];
    }
    return result;
  };

  var SAT = {}

  SAT['Circle']           = Circle;
  SAT['Polygon']          = Polygon;
  SAT['FixedSizePolygon'] = FixedSizePolygon;
  SAT['Response']         = Response;

  SAT['testCircleCircle']   = testCircleCircle;
  SAT['testPolygonCircle']  = testPolygonCircle;
  SAT['testCirclePolygon']  = testCirclePolygon;
  SAT['testPolygonPolygon'] = testPolygonPolygon;
  
  SAT['pointInPolygon'] = pointInPolygon;

  return SAT;
});