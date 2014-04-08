/**
 * # font-loader.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
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
     * @param  {Object} config A configuration object.
     * @param {Funtion} onLoad This is called when all fonts have been downloaded.
     */
    FontLoader.prototype.start = function(config, onLoad) {
    	if (!config.loadFonts) {
            onLoad(); 
            return;
        }

        var self = this;

    	config.data.active = function() {
    		onLoad();	
    	};

    	config.data.inactive = function() {
    		onLoad();	
    	};

        config.data.fontinactive = function(familyName) {
            throw new Error('Font Loader: Font ' + familyName + 'could not be loaded');   
        };
    	
    	var protocol = document.location.protocol === 'https:' ? 'https' : 'http';

		require([protocol + '://ajax.googleapis.com/ajax/libs/webfont/' + config.version + '/webfont.js'], function() {
	        WebFont.load(config.data);
	    });
    }
    /**
     * --------------------------------
     */

    return new FontLoader();
});

