define(function() {
	var Keyboard = function() {
		this.keyUpListeners = {};
		this.keyDownTimeOutListeners = {};

		this._pressed = {};
		this._pause = false;

		this.LEFT = 37;
		this.UP = 38;
		this.RIGHT = 39;
		this.DOWN = 40;

		this.CTRL = 17;
		this.ALT = 18;
		this.ESC = 27;
		this.SPACE = 32;

		this.A = 65;
		this.S = 83;
		this.D = 68;
		this.Z = 90;
		this.X = 88;
		this.C = 67;

		this.P = 80;
		this.O = 79;
		this.I = 73;

		this.NUM_0 = 48;
		this.NUM_1 = 49;
		this.NUM_2 = 50;
		this.NUM_3 = 51;
		this.NUM_4 = 52;
		this.NUM_5 = 53;

		this.GAME_LEFT = this.LEFT;
		this.GAME_RIGHT = this.RIGHT;
		this.GAME_UP = this.UP;
		this.GAME_DOWN = this.DOWN;
		this.GAME_BUTTON_1 = this.A;
		this.GAME_BUTTON_2 = this.S;
		this.GAME_BUTTON_PAUSE = this.P;
	};

	Keyboard.prototype.pause = function() {
		this._pause = true;
	};

	Keyboard.prototype.resume = function() {
		this._pause = false;
	};

	Keyboard.prototype.addUpCallback = function(key, callback) {
		if (!this.keyUpListeners.hasOwnProperty(key)) {
			this.keyUpListeners[key] = [];
		}

		this.keyUpListeners[key].push(callback);

		return { key: key, type: "Up", callback: callback };
	};

	Keyboard.prototype.removeUpCallback = function(callbackObject) {
		if (this.keyUpListeners.hasOwnProperty(callbackObject.key)) {
			this.keyUpListeners[callbackObject.key].splice(this.keyUpListeners[callbackObject.key].indexOf(callbackObject.callback), 1);
		}
	};

	Keyboard.prototype.addDownTimeOutCallback = function(key, callback, delay) {
		if (!this.keyDownTimeOutListeners.hasOwnProperty(key)) {
			this.keyDownTimeOutListeners[key] = [];
		}

		this.keyDownTimeOutListeners[key].push({ callback: callback, delay: delay, id: -1 });

		return { key: key, type: "DownTimeOut", callback: callback };
	};

	Keyboard.prototype.removeDownTimeOutCallback = function(callbackObject) {
		if (this.keyDownTimeOutListeners.hasOwnProperty(callbackObject.key)) {
			for (var i = this.keyDownTimeOutListeners[callbackObject.key].length - 1; i >= 0; i--) {
				var c = this.keyDownTimeOutListeners[callbackObject.key][i].callback;

				if (c === callbackObject.callback) {
					clearTimeout(this.keyDownTimeOutListeners[callbackObject.key][i].id);
					this.keyDownTimeOutListeners[callbackObject.key].splice(i, 1);
				}
			}
		}
	};

	Keyboard.prototype.addCallbacks = function(callbacks) {
		for (var i = 0; i < callbacks.length; i++) {
			var c = callbacks[i];

			if (c.type == "DownTimeOut") {
				this.addDownTimeOutCallback(c.key, c.callback, c.delay);
			}

			if (c.type == "Up") {
				this.addUpCallback(c.key, c.callback);
			}
		}
	};

	Keyboard.prototype.removeCallbacks = function(callbacks) {
		for (var i = 0; i < callbacks.length; i++) {
			var c = callbacks[i];

			if (c.type == "DownTimeOut") {
				this.removeDownTimeOutCallback(c.key, c.callback);
			}

			if (c.type == "Up") {
				this.removeUpCallback(c.key, c.callback);
			}
		}

		callbacks.length = 0;
	};

	Keyboard.prototype.isDown = function(keyCode) {
		return this._pressed[keyCode];
	};

	Keyboard.prototype.onKeydown = function(event) {
		var key = event.keyCode;

		this._pressed[key] = true;

		if (this.keyDownTimeOutListeners.hasOwnProperty(key)) {
			for (var i = this.keyDownTimeOutListeners[key].length - 1; i >= 0; i--) {
				if (this.keyDownTimeOutListeners[key][i].id == -1) {
					this.keyDownTimeOutListeners[key][i].id = setTimeout(this.keyDownTimeOutListeners[key][i].callback, this.keyDownTimeOutListeners[key][i].delay);
				}
			}
		}
	};

	Keyboard.prototype.onKeyup = function(event) {
		var key = event.keyCode;

		if (this.keyUpListeners.hasOwnProperty(key)) {
			for (var i = this.keyUpListeners[key].length - 1; i >= 0; i--) {
				this.keyUpListeners[key][i]();
			}
		}

		if (this.keyDownTimeOutListeners.hasOwnProperty(key)) {
			for (var i = this.keyDownTimeOutListeners[key].length - 1; i >= 0; i--) {
				clearTimeout(this.keyDownTimeOutListeners[key][i].id);
				this.keyDownTimeOutListeners[key][i].id = -1;
			}
		}

		delete this._pressed[key];
	};

	var keyboard = new Keyboard();

	window.addEventListener('keyup', function(event) {

		if (event.keyCode == keyboard.GAME_BUTTON_PAUSE) {
			keyboard.onKeyup(event);
			return;
		}

		if (keyboard._pause) return;

		keyboard.onKeyup(event);
	}, false);

	window.addEventListener('keydown', function(event) {
		if (keyboard._pause) return;
		keyboard.onKeydown(event);
	}, false);

	document.onkeydown = function(event) {
		if (event.keyCode == keyboard.LEFT ||
			event.keyCode == keyboard.UP ||
			event.keyCode == keyboard.RIGHT ||
			event.keyCode == keyboard.DOWN ||
			event.keyCode == keyboard.CTRL ||
			event.keyCode == keyboard.ALT ||
			event.keyCode == keyboard.ESC ||
			event.keyCode == keyboard.SPACE ||
			event.keyCode == keyboard.A ||
			event.keyCode == keyboard.S ||
			event.keyCode == keyboard.D ||
			event.keyCode == keyboard.Z ||
			event.keyCode == keyboard.X ||
			event.keyCode == keyboard.C ||
			event.keyCode == keyboard.NUM_0 ||
			event.keyCode == keyboard.NUM_1 ||
			event.keyCode == keyboard.NUM_2 ||
			event.keyCode == keyboard.NUM_3 ||
			event.keyCode == keyboard.NUM_4 ||
			event.keyCode == keyboard.NUM_5) {
			event.preventDefault();
		}
	}

	document.onkeypress = function(event) {
		if (event.keyCode == keyboard.LEFT ||
			event.keyCode == keyboard.UP ||
			event.keyCode == keyboard.RIGHT ||
			event.keyCode == keyboard.DOWN ||
			event.keyCode == keyboard.CTRL ||
			event.keyCode == keyboard.ALT ||
			event.keyCode == keyboard.ESC ||
			event.keyCode == keyboard.SPACE ||
			event.keyCode == keyboard.A ||
			event.keyCode == keyboard.S ||
			event.keyCode == keyboard.D ||
			event.keyCode == keyboard.Z ||
			event.keyCode == keyboard.X ||
			event.keyCode == keyboard.C ||
			event.keyCode == keyboard.NUM_0 ||
			event.keyCode == keyboard.NUM_1 ||
			event.keyCode == keyboard.NUM_2 ||
			event.keyCode == keyboard.NUM_3 ||
			event.keyCode == keyboard.NUM_4 ||
			event.keyCode == keyboard.NUM_5) {
			event.preventDefault();
		}
	}

	return keyboard;
});