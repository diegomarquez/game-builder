/**
 * # asset-preloader.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [asset-map](@@asset-map@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module is used to preload any type of asset that is required to already be cached by the browser before
 * the application starts. This is mostly used to avoid graphics taking a split second to appear the first time they
 * are requested.
 *
 * This should only be used to avoid graphical or audio glitches. Lazy loading should always be favored.
 *
 *
 * The Asset Preloader object extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **ON_LOAD_ALL_COMPLETE**
 * When loading of resources through the **loadAll** method is complete.
 *
 * ``` javascript
 * assetPreloader.on(assetPreloader.ON_LOAD_ALL_COMPLETE, function() {});
 * ```
 * </br>
 */

/**
 * Preload!
 * --------------------------------
 */

define(['delegate', 'asset-map', 'error-printer'], function(Delegate, AssetMap, ErrorPrinter) {
	var AssetPreloader = Delegate.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.imagesToLoad = [];
			this.audioToLoad = [];

			this.cachedImages = {};
			this.cachedAudio = {};

			this.supportedAudioFormat = "";
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getCachedImage</strong></p>
		 *
		 * Get an image that has been previously cached
		 *
		 * @param {Strin} id The path to the resource
		 * @return {Image}
		 */
		getCachedImage: function(id) {
			return this.cachedImages[id];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getCachedAudio</strong></p>
		 *
		 * Get an audio element or an ArrayBuffer that has been previously cached
		 *
		 * @param {String} id The path to the resource
		 * @return {Audio || ArrayBuffer}
		 */
		getCachedAudio: function(id) {
			return this.cachedAudio[id];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addAsset</strong></p>
		 *
		 * Add an asset to be loaded.
		 *
		 * @param {String} path A path to an asset
		 */
		addAsset: function(path) {
			var match = path.match(/^.+\.(.+?)(?=\?|$)/);

			if (!match) {
				ErrorPrinter.printError('Asset Preloader: path is not a url');
			}

			var extension = match[1];

			if (extension === 'png' || extension === 'gif' || extension === 'jpeg') {
				if (this.cachedImages[path])
					return;

				if (this.imagesToLoad.indexOf(path) === -1) {
					this.imagesToLoad.push(path);
				}

				return;
			}

			if (extension === 'opus' || extension === 'weba' || extension === 'ogg' || extension === "mp3") {
				if (this.cachedAudio[path])
					return;

				if (this.audioToLoad.indexOf(path) === -1) {
					this.audioToLoad.push(path);
				}

				return;
			}

			ErrorPrinter.printError('Asset Preloader: file type is not supported');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>canPreload</strong></p>
		 *
		 * Check if the asset can be prealoded
		 *
		 * @param {String} path A path to an asset
		 */
		canPreload: function(path) {
			var match = path.match(/^.+\.(.+?)(?=\?|$)/);

			if (!match) {
				ErrorPrinter.printError('Asset Preloader: path is not a url');
			}

			var extension = match[1];

			if (extension === 'png' || extension === 'gif' || extension === 'jpeg') {
				return true;
			}

			if (extension === 'opus' || extension === 'weba' || extension === 'ogg' || extension === "mp3") {
				return true;
			}

			return false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>loadAll</strong></p>
		 *
		 * Start loading all the provided assets and fire the ON_LOAD_ALL_COMPLETE when
		 * eerything is done loading
		 *
		 * @param {String} id Id of the sound that has channels assigned
		 */
		loadAll: function() {
			var imagesToLoad = this.imagesToLoad.length;
			var audioToLoad = this.audioToLoad.length;

			if ((imagesToLoad + audioToLoad) === 0) {
				this.execute(this.ON_LOAD_ALL_COMPLETE);
				return;
			}

			for (var i = 0; i < this.imagesToLoad.length; i++) {
				var path = this.imagesToLoad[i];

				var image = document.createElement('img');

				image.addEventListener('load', function(event) {
					this.cachedImages[event.target.gru()] = event.target;

					imagesToLoad--;

					if (imagesToLoad === 0 && audioToLoad === 0) {
						this.imagesToLoad.length = 0;
						this.audioToLoad.length = 0;

						this.execute(this.ON_LOAD_ALL_COMPLETE);
					}
				}.bind(this));

				image.gru = function(p) {
					return function() {
						return p;
					}
				}(path);

				image.crossOrigin = 'Anonymous';

				if (window.location.protocol === 'file:') {
					image.src = 'http://localhost:5000/' + path;
				} else {
					image.src = path;
				}
			}

			var audioContext = window.AudioContext || window.webkitAudioContext;

			for (var i = 0; i < this.audioToLoad.length; i++) {
				var path = this.audioToLoad[i];

				path = this.convertPathToSupportedAudioFormat(path);

				if (audioContext) {
					var request = new XMLHttpRequest();

					if (window.location.protocol === 'file:') {
						request.open('GET', 'http://localhost:5000/' + path);
					} else {
						request.open('GET', path);
					}

					request.responseType = 'arraybuffer';

					request.addEventListener('load', function(event) {
						this.cachedAudio[event.target.gru()] = event.target.response;

						audioToLoad--;

						if (imagesToLoad === 0 && audioToLoad === 0) {
							this.imagesToLoad.length = 0;
							this.audioToLoad.length = 0;

							this.execute(this.ON_LOAD_ALL_COMPLETE);
						}
					}.bind(this));

					request.gru = function(p) {
						return function() {
							return p;
						}
					}(path);

					request.send();
				} else {
					var audio = document.createElement('audio');

					audio.addEventListener('canplaythrough', function(event) {
						this.cachedAudio[event.target.gru()] = event.target;

						audioToLoad--;

						if (imagesToLoad === 0 && audioToLoad === 0) {
							this.imagesToLoad.length = 0;
							this.audioToLoad.length = 0;

							this.execute(this.ON_LOAD_ALL_COMPLETE);
						}
					}.bind(this));

					audio.gru = function(p) {
						return function() {
							return p;
						}
					}(path);

					audio.preload = 'auto';

					if (window.location.protocol === 'file:') {
						audio.src = 'http://localhost:5000/' + path;
					} else {
						audio.src = path;
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */

		convertPathToSupportedAudioFormat: function(path) {
			return path.replace(/(^.+\.)(.+?)(?=(\?.+))/, "$1" + this.supportedAudioFormat);
		},
		/**
		 * --------------------------------
		 */

		findSupportedAudioFormat: function(onComplete) {
			var loadAudioFile = function(path, supportedFormat) {
				var audio = document.createElement('audio');

				audio.addEventListener('canplaythrough', function(event) {
					if (!this.supportedAudioFormat) {
						this.supportedAudioFormat = supportedFormat;

						onComplete();
					}
				}.bind(this));

				audio.preload = 'auto';

				if (window.location.protocol === 'file:') {
					audio.src = 'http://localhost:5000/' + path;
				} else {
					audio.src = path;
				}
			}.bind(this);

			loadAudioFile(AssetMap.get()['AUDIO-SAMPLE.OGG'], "ogg");
			loadAudioFile(AssetMap.get()['AUDIO-SAMPLE.MP3'], "mp3");
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(AssetPreloader.prototype, 'ON_LOAD_ALL_COMPLETE', {
		get: function() {
			return 'load_all_complete';
		}
	});

	return new AssetPreloader();
});
