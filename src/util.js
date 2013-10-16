define(function() {
	var Utils = function() {}

	Utils.prototype.shallow_merge = function(first, second) {
		var result = {};

		this.shallow_copy(first, result);
		this.shallow_copy(second, result);

		return result;
	};

	Utils.prototype.shallow_copy = function(from, to) {
		from = from || {};
		to   = to || {};

		for(var k in from) {
			to[k] = from[k];
		}
	};	

	Utils.prototype.destroyObject = function(o, nullSelf) {
		for(var propName in o) {
			if(o.hasOwnProperty(propName)){
				delete o[propName];
			}
		}

		if(nullSelf) {
			o = null;
		}
	};

	Utils.prototype.destroyArray = function(a, nullSelf) {
		for(var i=0; i<a.length; i++) {
			a[i] = null;
		}

		if(nullSelf) {
			a = null;
		}
	};

	Utils.prototype.bind = function(func, scope, args) {
		return function() {
			func.apply(scope, args);
		}
	}

	Utils.prototype.rand_f     = function (min, max) { return Math.random() * (max - min) + min; };
	Utils.prototype.rand_i     = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
	Utils.prototype.rand_pair  = function (value1, value2) { return Math.random() >= 0.5 ? value1 : value2; };
	Utils.prototype.rand_b     = function () { return Math.random() >= 0.5 };
	Utils.prototype.rand_color = function () { return '#'+Math.floor(Math.random()*16777215).toString(16); };

	return new Utils();
});