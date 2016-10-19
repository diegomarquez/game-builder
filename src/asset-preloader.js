/**
 * # asset-preloader.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
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

define(['delegate', 'error-printer'], function(Delegate, ErrorPrinter) {
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
		},
		/**
		* --------------------------------
		*/

		/**
		* <p style='color:#AD071D'><strong>addAsset</strong></p>
		*
		* Add an asset to be loaded.
		*
		* @param {String} path A path to a graphical asset
		*/
		addAsset: function(path) {
			var match = path.match(/^.+\.(.+?)(?=\?|$)/);

			if (!match) {
				ErrorPrinter.printError('Asset Preloader: path is not a url');
			}

			var extension = match[1];

			if (extension === 'png' || extension === 'gif' || extension === 'jpeg') {
				if (this.imagesToLoad.indexOf(path) === -1) {
					this.imagesToLoad.push(path);
				}

				return;
			}

			if (extension === 'opus' || extension === 'weba' || extension === 'ogg') {
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

				image.addEventListener('load', function() {
					imagesToLoad--;

					if (imagesToLoad === 0 && audioToLoad === 0) {
						this.imagesToLoad.length = 0;
						this.audioToLoad.length = 0;

						this.execute(this.ON_LOAD_ALL_COMPLETE);
					}
				}.bind(this));

				image.crossOrigin = 'Anonymous';

				if (window.location.protocol === 'file:') {
					image.src = 'http://localhost:5000/' + path;
				}
				else {
					image.src = path;
				}
			}

			var audioContext = window.AudioContext || window.webkitAudioContext;

			for (var i = 0; i < this.audioToLoad.length; i++) {
				var path = this.audioToLoad[i];

				if (audioContext) {
					var request = new XMLHttpRequest();

					if (window.location.protocol === 'file:') {
						request.open('GET', 'http://localhost:5000/' + path);
					} else {
						request.open('GET', path);
					}

					request.responseType = 'arraybuffer';

					request.onload = function() {
						audioToLoad--;

						if (imagesToLoad === 0 && audioToLoad === 0) {
							this.imagesToLoad.length = 0;
							this.audioToLoad.length = 0;

							this.execute(this.ON_LOAD_ALL_COMPLETE);
						}
					}.bind(this);

					request.send();
				} else {
					var audio = document.createElement('audio');

					audio.addEventListener('canplaythrough', function() {
						audioToLoad--;

						if (imagesToLoad === 0 && audioToLoad === 0) {
							this.imagesToLoad.length = 0;
							this.audioToLoad.length = 0;

							this.execute(this.ON_LOAD_ALL_COMPLETE);
						}
					}.bind(this));

					audio.preload = 'auto';

					if (window.location.protocol === 'file:') {
						audio.src = 'http://localhost:5000/' + path;
					}
					else {
						audio.src = path;
					}
				}
			}
		}
		/**
		* --------------------------------
		*/
	});

	Object.defineProperty(AssetPreloader.prototype, 'ON_LOAD_ALL_COMPLETE', { get: function() { return 'load_all_complete'; } });

	return new AssetPreloader();
});