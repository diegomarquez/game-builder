/**
 * # font-loader.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * A [requireJS](http://requirejs.org/) module.
 * 
 * This module wraps [Web font loader](https://github.com/typekit/webfontloader), it's main purpose is to avoid
 * [FOUT](http://www.paulirish.com/2009/fighting-the-font-face-fout/), which can be particularly annoying if you are
 * trying to cache text into an image.
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
     * @param  {Object} webfontsConfig A configuration object. See [font-data](@@font-data@@) for more details.
     * @param {Funtion} onLoad This is called when all fonts have been downloaded.
     *                         It recieves and boolean argument stating wether the specified fonts where downloaded successfuly or not.
     */
    FontLoader.prototype.start = function(config, onLoad) {
    	if (!config.loadFonts) {
            onLoad(false); 
            return;
        }

        var self = this;

    	config.data.active = function() {
    		onLoad(true);	
    	};

    	config.data.inactive = function() {
    		onLoad(false);	
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

