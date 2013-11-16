# The empty example

#### There isn't much of anything going on in here. 
#### Basically just what an empty project would look like.

**********

##### New things that are happening here

* main.css

Nothing of mention in this file, and nothing of mention about it in any other example.

* index.html

There aren't that many things in index.html. 
The file has enough comments on everything that is going on.
Go take a look if you are interested.

* main.js

This is the main requirejs module for the application. 
Of particular interes is the following code.

```javascript
	gjs.game.on("init", this, function() {
		console.log("Hi!")
	});	
```

When that callback is executed everything related to the framework 
has been loaded and we are good to go.

The most interesting part here is the 'gjs' global object which contains a bunch of things
that will be usefull and will be explained in later examples.
