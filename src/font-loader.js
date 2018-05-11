/**
 * # font-loader.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 *
 * Depends of:
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module.
 *
 * This module wraps [Web font loader](https://github.com/typekit/webfontloader), it's main purpose is to avoid
 * [FOUT](http://www.paulirish.com/2009/fighting-the-font-face-fout/), which can be particularly annoying if you are
 * trying to cache text into an image.
 *
 * The start method receives an object for configuration as the first argument and a function to be executed
 * once the loading is complete. The configuration object looks like this:
 *
 * ``` javascript
 *
 * {
	// Refer [Web font loader](https://github.com/typekit/webfontloader) for details on how it should look like.
	data: {
		google: {
			families: []
		},
	},

	// Set a version of [Web font loader](https://github.com/typekit/webfontloader) to download from
	// [Google](https://developers.google.com/speed/libraries/)
	// A value of '1' gets the latest 1.x version
	version: '1',

	// Set this to false if you don't want to load any external fonts with the [Web font loader](https://github.com/typekit/webfontloader)
	loadFonts: false
 * }
 * ```
 */

/**
 * Load Fonts
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {

	var FontLoader = function() {}

	/**
	 * <p style='color:#AD071D'><strong>start</strong></p>
	 *
	 * @param {Funtion} onLoad This is called when all fonts have been downloaded.
	 */
	FontLoader.prototype.start = function(onLoad) {
		var config = require('font-data')
			.get();

		if (!config.loadFonts) {
			onLoad();
			return;
		}

		var self = this;
		var oldDefineAmd = define.amd;
		define.amd = null;

		config.data.active = function() {
			define.amd = oldDefineAmd;

			onLoad();
		};

		config.data.inactive = function() {
			define.amd = oldDefineAmd;

			require('error-printer')
				.printError('Font Loader', 'No fonts are available');
			onLoad();
		};

		config.data.fontinactive = function(familyName) {
			require('error-printer')
				.printError('Font Loader', 'Font: ' + familyName + ' could not be loaded');
		};

		var protocol = document.location.protocol === 'https:' ? 'https' : 'http';

		loadScript(protocol + '://ajax.googleapis.com/ajax/libs/webfont/' + config.version + '/webfont.js', function() {
			if (window.WebFont) {
				window.WebFont.load(config.data);
			} else {
				console.log("fail to load web font loader");
				onLoad();
			}
		});
	}
	/**
	 * --------------------------------
	 */

	var loadScript = function(src, callback) {
		var s, r, t;

		s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = src;

		s.onload = function() {
			callback();
		}

		s.onreadystatechange = function() {
			if (this.readyState == 'complete') {
				callback();
			}
		}

		t = document.getElementsByTagName('script')[0];
		t.parentNode.insertBefore(s, t);
	}

	return new FontLoader();
});
