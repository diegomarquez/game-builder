$(function() {
	var gameSetup = {
		focus: true,
		blur: true,
		initialized: false,
		lastUpdate: Date.now(),

		manualHardPause: false,
		manualSoftPause: false,
		wasInSoftPause: false
	};

	gameSetup.create = function(mainContainer, canvas, onSetupComplete) {
		this.mainGameSetUp = mainGameSetUp;

		this.mainContainer = mainContainer;
		this.canvas = canvas;

		window.addEventListener('load', function() {
			window.addEventListener('resize', function() {
				resize(mainContainer, canvas);
			}, false);

			resize(mainContainer, canvas);

			function resize(container, canvas) {
				var scale = {
					x: 1,
					y: 1
				};

				scale.x = (window.innerWidth - 5) / canvas.width;
				scale.y = (window.innerHeight - 5) / canvas.height;

				if (scale.x < scale.y) {
					scale = scale.x + ', ' + scale.x;
				} else {
					scale = scale.y + ', ' + scale.y;
				}

				container.style.webkitTransform = 'scale(' + scale + ')';
				container.style.mozTransform = 'scale(' + scale + ')';
				container.style.msTransform = 'scale(' + scale + ')';
				container.style.oTransform = 'scale(' + scale + ')';
			}
		}, false);
	}

	gameSetup.start = function() {
		this.context = this.canvas.getContext("2d");
		
		var frameRequest, mainLoop;

		var self = this;

		var mainGameCreation = FuntionUtils.bindScope(self, function() {
			this.initialized = true;
			this.mainGameSetUp();

			//this.container = new ObjectsContainer(this.context).setDefaultLayer(2);
		});

		//Setting up the onBlur and onFocus events.
		//If the game is not initialized because it has no focus, these will be created anyway.
		//Once the document gains fucos, it will create the game, if it hasn't so already.
		var onBlur = function(event) {
			if (self.blur) {
				self.blur = false;
				self.focus = true;

				//Aca van los callbacks para pausar todos los componenetes

				// TimeOutFactory.pauseAllTimeOuts();
				// ArrowKeyHandler.pause();
				// SoundPlayer.pauseAll();

				if (!self.manualSoftPause) {
					window.cancelAnimationFrame(frameRequest);
				}
			}
		}

		var onFocus = function(event) {
			//A pause made manually can only be undone manually
			if (self.manualHardPause || self.manualSoftPause) {
				return;
			}

			//In the case the game is not already created when the document gains focus for the first time, it is created here.
			if (!self.initialized) {
				mainGameCreation();
			} else {
				if (self.focus) {
					self.blur = true;
					self.focus = false;

					//Aca van los callbacks para re activar todos los componenetes

					// TimeOutFactory.resumeAllTimeOuts();
					// ArrowKeyHandler.resume();
					// SoundPlayer.resumeAll();

					if (!self.wasInSoftPause) {
						frameRequest = window.requestAnimationFrame(mainLoop);
					} else {
						self.wasInSoftPause = true;
					}

				}
			}
		}

		$(window).on("blur", onBlur);
		$(window).on("focus", onFocus);

		if (document.hasFocus()) {
			mainGameCreation();

			mainLoop = function() {
				var now = Date.now();
				var dt = now - self.lastUpdate;
				self.lastUpdate = now;

				if (dt < 30) {
					self.container.update(dt / 1000, self.manualSoftPause);
					self.container.draw();
				}

				frameRequest = window.requestAnimationFrame(mainLoop);
			}

			var vendors = ['ms', 'moz', 'webkit', 'o'];

			for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
			}

			if (!window.requestAnimationFrame) {
				window.requestAnimationFrame = function(callback) {
					return window.setTimeout(callback, 1000 / 60);;
				};
			}

			if (!window.cancelAnimationFrame) {
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
			}

			frameRequest = window.requestAnimationFrame(mainLoop);
		}
	}

	gameSetup.softPause = function() {
		this.manualSoftPause = true;
		this.wasInSoftPause = true;
		this.dispatchUIEvent('blur');
	};

	gameSetup.softResume = function() {
		this.manualSoftPause = false;
		this.dispatchUIEvent('focus');
	};

	gameSetup.hardPause = function() {
		this.manualHardPause = true;
		this.dispatchUIEvent('blur');
	};

	gameSetup.hardResume = function() {
		this.manualHardPause = false;
		this.dispatchUIEvent('focus');
	};

	gameSetup.dispatchUIEvent = function(event) {
		var evt = document.createEvent("UIEvents");
		evt.initUIEvent(event, true, true, window, 1);
		window.dispatchEvent(evt);
	};

	window.GameSetUp = gameSetup;
});

