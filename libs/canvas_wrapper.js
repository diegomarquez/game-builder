// Canvas doesn't support getCoords() which I really need....
// So I made a wrapper, code mostly taken from excanvas.js by Google - http://code.google.com/p/explorercanvas/
// alias some functions to make (compiled) code shorter

define(function() {
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;
  var abs = m.abs;
  var sqrt = m.sqrt;

  var createMatrixIdentity = function() {
    return [
      [1, 0, 0], [0, 1, 0], [0, 0, 1]
    ];
  };

  var matrixMultiply = function(m1, m2) {
    var result = createMatrixIdentity();
    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;
        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }
        result[x][y] = sum;
      }
    }
    return result;
  };

  var copyState = function(o1, o2) {
    o2.fillStyle = o1.fillStyle;
    o2.lineCap = o1.lineCap;
    o2.lineJoin = o1.lineJoin;
    o2.lineWidth = o1.lineWidth;
    o2.miterLimit = o1.miterLimit;
    o2.shadowBlur = o1.shadowBlur;
    o2.shadowColor = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle = o1.strokeStyle;
    o2.globalAlpha = o1.globalAlpha;
  };

  var CanvasWrapper = function(ctx) {
    this.m_ = createMatrixIdentity();
    this.mStack_ = [];
    this.aStack_ = [];
    this.canvas = ctx;
    // Canvas context properties
    this.strokeStyle = '#000';
    this.fillStyle = '#000';
    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = 1;
    this.globalAlpha = 1;
  };

  CanvasWrapper.prototype.applyContextProperties = function() {
    this.canvas.strokeStyle = this.strokeStyle;
    this.canvas.fillStyle = this.fillStyle;
    this.canvas.lineWidth = this.lineWidth;
    this.canvas.lineJoin = this.lineJoin;
    this.canvas.lineCap = this.lineCap;
    this.canvas.miterLimit = this.miterLimit;
    this.canvas.globalAlpha = this.globalAlpha;
  };

  CanvasWrapper.prototype.beginPath = function() {
    this.canvas.beginPath();
  };

  CanvasWrapper.prototype.moveTo = function(aX, aY) {
    this.canvas.moveTo(aX, aY);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.lineTo = function(aX, aY) {
    this.applyContextProperties();
    this.canvas.lineTo(aX, aY);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.bezierCurveTo = function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
    this.applyContextProperties();
    this.canvas.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    this.applyContextProperties();
    this.canvas.quadraticCurveTo(aCPx, aCPy, aX, aY);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.arc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    this.applyContextProperties();
    this.canvas.arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise);
  };

  CanvasWrapper.prototype.rect = function(aX, aY, aWidth, aHeight) {
    this.applyContextProperties();
    this.canvas.rect(aX, aY, aWidth, aHeight);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    this.applyContextProperties();
    this.canvas.strokeRect(aX, aY, aWidth, aHeight);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.fillRect = function(aX, aY, aWidth, aHeight) {
    this.applyContextProperties();
    this.canvas.fillRect(aX, aY, aWidth, aHeight);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  CanvasWrapper.prototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    this.applyContextProperties();
    return this.canvas.createLinearGradient(aX0, aY0, aX1, aY1);
  };

  CanvasWrapper.prototype.createRadialGradient = function(aX0, aY0, aR0, aX1, aY1, aR1) {
    this.applyContextProperties();
    return this.canvas.createRadialGradient(aX0, aY0, aR0, aX1, aY1, aR1);
  };

  CanvasWrapper.prototype.stroke = function(aFill) {
    this.applyContextProperties();
    this.canvas.stroke(aFill);
  };

  CanvasWrapper.prototype.fill = function() {
    this.applyContextProperties();
    this.canvas.fill();
  };

  CanvasWrapper.prototype.clearRect = function(aX, aY, aWidth, aHeight) {
    this.canvas.clearRect(aX, aY, aWidth, aHeight);
  };

  CanvasWrapper.prototype.closePath = function() {
    this.canvas.closePath();
  };

  CanvasWrapper.prototype.getCoords = function(aX, aY) {
    var m = this.m_;
    return {
      x: aX * m[0][0] + aY * m[1][0] + m[2][0],
      y: aX * m[0][1] + aY * m[1][1] + m[2][1]
    }
  };

  CanvasWrapper.prototype.save = function() {
    this.canvas.save();
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    // is this a no-op?
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  CanvasWrapper.prototype.restore = function() {
    this.canvas.restore();
    copyState(this.aStack_.pop(), this);
    this.m_ = this.mStack_.pop();
  };

  var matrixIsFinite = function(m) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 2; k++) {
        if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
          return false;
        }
      }
    }
    return true;
  };

  var setM = function(ctx, m) {
    if (!matrixIsFinite(m)) {
      return;
    }
    ctx.m_ = m;
  };

  CanvasWrapper.prototype.setMatrix = function(matrix) {
    this.setTransform(matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]);
  };

  CanvasWrapper.prototype.getMatrix = function() {
    return this.m_
  };

  CanvasWrapper.prototype.translate = function(aX, aY) {
    this.canvas.translate(aX, aY);
    
    var m1 = [
      [1, 0, 0],
      [0, 1, 0],
      [aX, aY, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_));
  };

  CanvasWrapper.prototype.rotate = function(aRot) {
    this.canvas.rotate(aRot);
    var c = mc(aRot);
    var s = ms(aRot);
    
    var m1 = [
      [c, s, 0],
      [-s, c, 0],
      [0, 0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_));
  };

  CanvasWrapper.prototype.scale = function(aX, aY) {
    this.canvas.scale(aX, aY);
    
    var m1 = [
      [aX, 0, 0],
      [0, aY, 0],
      [0, 0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_));
  };

  CanvasWrapper.prototype.transform = function(m11, m12, m21, m22, dx, dy) {
    this.canvas.transform(m11, m12, m21, m22, dx, dy);
    
    var m1 = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx, dy, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_));
  };

  CanvasWrapper.prototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
    this.canvas.setTransform(m11, m12, m21, m22, dx, dy);
    
    var m = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx, dy, 1]
    ];

    setM(this, m);
  };

  return CanvasWrapper;
});