# The empty example

#### There isn't much of anything going on in here. 
#### Basically just what an empty project would look like.

##### 1. New things that are happening here.
	1. Setup of callback to the main initialization

```javascript
	gjs.game.on("init", this, function() {
		console.log("Hi!")
	});	
```

When that callback is executed everything related to the framework 
has been loaded and we are goog to go.

The most interesting part here is the 'gjs' global object which contains a bunch of things
that will be usefull later and will be explained in later examples.


	

