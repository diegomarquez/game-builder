/**
 * # pre-load.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [font-loader](@@font-loader@@)
 * [asset-preloader](@@asset-preloader@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module bootstraps the main module. It makes sure fonts are loaded before initializing main application
 * and determines which is the audio format supported by the browser.
 */

define(['require', 'domready!', 'font-loader', 'asset-preloader'], function(require, dom, fontLoader, assetPreloader) {
	var jobCount = 2;

	// Start loading configured fonts
	fontLoader.start(function() {
		// Now all fonts are loaded, and FOUT has been avoided.
		jobCount--;

		// Create main module
		if (jobCount === 0)
			require(['main']);
	});

	// Determine the audio format supported by the browser
	assetPreloader.findSupportedAudioFormat(function() {
		jobCount--;

		// Create main module
		if (jobCount === 0)
			require(['main']);
	});
});
