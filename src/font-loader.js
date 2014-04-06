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
     * @param  {String} version A string with the version of webfont.js to download from [Google](https://developers.google.com/speed/libraries/).
     * @param  {Object} data An object with font data, refer to [Web font loader](https://github.com/typekit/webfontloader)
     *                       for details on how it shoulf look like.
     * @param {Funtion} onLoad This is called when all fonts have been downloaded.
     *                         It recieves and boolean argument stating wether the specified fonts where downloaded successfuly or not.
     */
    FontLoader.prototype.start = function(version, data, onLoad) {
    	var self = this;

    	if(onLoad) { 
	    	data.active = function() {
	    		onLoad(true);	
	    	};

	    	data.inactive = function() {
	    		onLoad(false);	
	    	};
    	}
		
    	var protocol = document.location.protocol === 'https:' ? 'https' : 'http';

		require([ protocol + '://ajax.googleapis.com/ajax/libs/webfont/' + version + '/webfont.js'], function(){
	        WebFont.load(data);
	    });
    }
    /**
     * --------------------------------
     */

    return new FontLoader();
});

