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

define(['require', 'domready!', 'font-loader', 'asset-preloader', 'preload-assets'], function(require, dom, fontLoader, assetPreloader, preloadAssets) {
	var assetsToPreload = preloadAssets.get();

	for (var filename in assetsToPreload) {
		var path = assetsToPreload[filename];

		if (assetPreloader.canPreload(path)) {
			assetPreloader.addAsset(path);
		}
	}

	// Wait for assets to be ready
	assetPreloader.once(assetPreloader.ON_LOAD_ALL_COMPLETE, this, function() {
		// Create main module
		require(['main']);
	});

	var jobCount = 2;

	// Start loading configured fonts
	fontLoader.start(function() {
		// Now all fonts are loaded, and FOUT has been avoided.
		jobCount--;

		// Preload all configured assets
		if (jobCount === 0)
			assetPreloader.loadAll();
	});

	// Determine the audio format supported by the browser
	assetPreloader.findSupportedAudioFormat(function() {
		jobCount--;

		// Preload all configured assets
		if (jobCount === 0)
			assetPreloader.loadAll();
	});
});
