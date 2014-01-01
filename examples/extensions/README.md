# extensions
-------------------

This example deals with adding extensions to the behaviour of the main object that wraps the canvas and sets up the update loop. Up until now all the examples have been using an extension to set the layers used by the application.

This example will show that you can do some more interesting things with extensions, while keeping your code reasonably tidy. 

There are three new extensions in use:
- pause extensions takes care of pausing game object behaviour when the application looses focus.
- resume extensions takes care of resuming game object behaviour when the application gains focus.  
- resize extension resizes the canvas as the viewport changes size while keeping the original aspect ratio. I don't mean to be cocky, but it's pretty fucking great!

There are 4 types of extensions: 
- CREATE. These extensions get called once when the application is initialized. 
- FOCUS. These extensions are called each time the application gains focus.
- BLUR. These extensions are called each time the application looses focus. 
- UPDATE. These extensions are called in the main update loop.

The type of an extension is configured in the file that defines it.

A [GAME-BUILDER][game-builder] project

[game-builder]: http://diegomarquez.github.io/game-builder