/* 
 * # class.js
 * 
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 * 
 * Inherits from:
 * 
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is just a straight port into a requireJS module of this [file](http://stackoverflow.com/questions/15050816/is-john-resigs-javascript-inheritance-snippet-deprecated),
 * which in turn is an adaptation of [this](http://ejohn.org/blog/simple-javascript-inheritance/)
 * 
 * This is at the core of everything [Game-Builder](http://diegomarquez.github.io/game-builder). 
 * The main feature it provides as opposed to more crud inheritance implementations in Javascript,
 * is a **_super** method, which is extremely usefull. 
 */

/**
 * Simple JavaScript Inheritance
 * --------------------------------
 */
define(function() {
  var initializing = false; 
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  var Class = function() {};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = Object.create(_super);
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function DummyClass() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    DummyClass.prototype = prototype;

    // Enforce the constructor to be what we expect
    DummyClass.prototype.constructor = DummyClass;

    // And make this class extendable
    DummyClass.extend = Class.extend;

    return DummyClass;
  }

  return Class;
});