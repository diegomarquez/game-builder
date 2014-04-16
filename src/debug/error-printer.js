/**
 * # error-printer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module is used all around [Game-Builder](http://diegomarquez.github.io/game-builder) to print out errors to console.
 *
 * In the spirit of [requireJS](http://requirejs.org/), the error has a link to a more detailed explanation on what happened.
 */

/**
 * Error Printing
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {
	var ErrorPrinter = function() {}

	/**
	 * <p style='color:#AD071D'><strong>printError</strong></p>
	 *
	 * Prints a nice error to console and link to the corresponding place in [Game-Builder](http://diegomarquez.github.io/game-builder)
	 * website for a more detailed explanation.
	 * 
	 * @param  {String} origin An id to determine from which place this method was called.
	 * @param  {String} message Error message
	 * @param  {Object} [e=null] Optional Error argument, it is thrown if sent.
	 *
	 * @throws {Error} Always
	 */
	ErrorPrinter.prototype.printError = function(origin, message, e) {
		throw new Error(origin + ' => ' + message + '\nhttp://diegomarquez.github.io/game-builder/errors.html#' + origin);

		if (e) {
			throw e	
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>mustOverrideError</strong></p>
	 *
	 * Defines an error thrown by top level modules in methods that must be overriden by child modules.
	 * 
	 * @param  {String} origin An id to determine from which place this method was called.
	 *
	 * @throws {Error} Always
	 */
	ErrorPrinter.prototype.mustOverrideError = function(origin) {
		throw new Error(origin + ' => ' + 'This method must be overriden' + '\nhttp://diegomarquez.github.io/game-builder/errors.html#common');
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>missingArgumentError</strong></p>
	 *
	 * Defines an error thrown when arguments are missing.
	 * 
	 * @param  {String} origin An id to determine from which place this method was called.
	 *
	 * @throws {Error} Always
	 */
	ErrorPrinter.prototype.missingArgumentError = function(origin) {
		var args = Array.prototype.slice.call(arguments, 1);

		for(var i=0; i<args.length; i++) {
			throw new Error(origin + ' => ' + 'Missing argument:' + args[i] + '\nhttp://diegomarquez.github.io/game-builder/errors.html#' + origin.toLowerCase().replace('', '_'));
		}
	};
	/**
	 * --------------------------------
	 */
	
	

	return new ErrorPrinter;
});