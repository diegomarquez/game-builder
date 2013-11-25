define(function(require) {
	var pressed = {};

	var Keyboard = require('delegate').extend({
		init: function() {
			this._super();

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
		},

		onKeyDown: function(keyCode, scope, callback) {
			this.on('keydown' + keyCode.toString(), scope, callback);
		},

		onKeyUp: function(keyCode, scope, callback) {
			this.on('keyup' + keyCode.toString(), scope, callback);
		},

		removeKeyDown: function(keyCode, scope, callback) {
			this.remove('keydown' + keyCode.toString(), scope, callback);
		},

		removeKeyUp: function(keyCode, scope, callback) {
			this.remove('keyup' + keyCode.toString(), scope, callback);
		},

		isKeyDown: function(keyCode) {
			return pressed[keyCode];	
		}
	});

	var keyboard = new Keyboard();

	window.addEventListener('keyup', function(event) {
		delete pressed[event.keyCode];

		keyboard.execute('keyup' + event.keyCode.toString(), event);
	}, false);

	window.addEventListener('keydown', function(event){
		if(pressed[event.keyCode]) return;

		pressed[event.keyCode] = true;
		keyboard.execute('keydown' + event.keyCode.toString(), event);
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