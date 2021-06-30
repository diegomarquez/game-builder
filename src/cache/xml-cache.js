/**
 * # xml-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [cache](@@cache@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module takes care of loading and storing the contents of an XML file so the result is easily injectable into other modules.
 *
 * The cached object is an [XML Document](https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument)
 */

/**
 * Cache XML documents
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var XMLCache = require('cache')
		.extend({
			/**
			 * <p style='color:#AD071D'><strong>name</strong></p>
			 *
			 * @return {String} The name of the cache
			 */
			name: function() {
				return 'XML Cache';
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>cache</strong></p>
			 *
			 * @param {String} path Path to the xml asset to load, can be a local or remote url
			 * @param {Function} done This callback is executed when the asset has been cached
			 */
			cache: function(path, done) {
				if (this.cacheObject[path])
					return;
				
				var assetPreloader = require('asset-preloader');
				var cachedXML = assetPreloader.getCachedXml(path);

				if (cachedXML) {
					this.cacheObject[path] = cachedXML;

					this.execute(this.CACHE, this.cacheObject[path]);

					if (done)
						done();
				} else {
					var request = new XMLHttpRequest();

					if (window.location.protocol === 'file:') {
						request.open('GET', 'http://localhost:5000/' + path);
					} else {
						request.open('GET', path);
					}

					request.responseType = 'document';
					request.overrideMimeType('text/xml');
					
					request.addEventListener('load', (event) => {
						this.cacheObject[path] = event.target.responseXML;

						if (done)
							done();
					});

					request.send();
				}
			}
			/**
			 * --------------------------------
			 */
		});

	return new XMLCache();
});
