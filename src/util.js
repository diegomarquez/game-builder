define(function() {
	var Utils = function() {}

	Utils.prototype.shallow_merge = function(first, second) {
		var result = {};

		this.shallow_copy(first, result);
		this.shallow_copy(second, result);

		return result;
	}

	Utils.prototype.shallow_copy = function(from, to) {
		from = from || {}
		to   = to || {}

		for(var k in from) {
			to[k] = from[k]			
		}
	}	

	return new Utils()
});