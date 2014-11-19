/**
 * # pre-load.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [font-loader](@@font-loader@@)
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module bootstraps the main module. It makes sure fonts are loaded before initializing the main application
 */

define(['require', 'domready!', 'font-loader'], function(require, dom, fontLoader) {
    // Start loading configured fonts
    fontLoader.start(function() {
      // Now all fonts are loaded, and FOUT has been avoided.
      
      // Create main module
      require(["main"]);
    });
});