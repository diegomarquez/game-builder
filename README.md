# Game.js

![game][game]

These are some files I decided to extract from a previous javascript project. It's kind of like a framework to make simple games, things like Asteroids or Galaga.

-----------------------------------

###### Current TODO List:

- Write some example code. Should have examples for each individual aspect of the framework
    * Game Object Hierarchy
        + Basic ( Done )
        + Nesting ( Done )
            - Containers ( Done )
            - Layers ( Done )
    * Components ( DONE )
        + Misc Logic ( Done )
    * Renderers
        + Image Renderer ( Done )
    * Collision 
        + Circle ( Done )
        + Polygon ( Done )
        + Fixed Polygon ( Done )
    * Input ( DONE )
    * Timers
        + Method to destroy all callbacks of a timer when it is removed and destroyed ( DONE )
        + Utility method to perform that object destruction ( DONE )
    * State Machine
    * Delegates
        + Overview on all the callbacks available to game_object
        + Overview on all the callbacks available to canvas_wrapper
        + Overview on all the callbacks available to component
        + Overview on all the callbacks available to collider_component
        + Bubbling
    * Canvas Wrapper 
        + Extensions
            - TimerFactory extension, pause and resume all timeout when pausing the game
            - Keyboard extension, block keyboard keys when pausing the game
            - Canvas resize extension, that
    * Different ways to send in arguments to a game_object
        + Configuration Type
        + Through assembler.get
        + Through game_object.start ( This will be no more, doesn't make sense )
    * Layer Manager
        + Other features
    * Demos requiring more than one module
        + Demo: Dynamic add and remove of childs in containers
        + Demo: Dynamic add and remove of components
        + Pausing/Resuming
        + Reclaiming of game_objects    
    * Text
        + Use this in all the examples to explain what is going on Screen
    * Sound

- Write a README.md for each example
- Use HTML to add some on screen explanation of what is going on.
- Add additional debug drawing to game_object
    * global transformed position

- Explain main components in the main README.md

- Spike Performance Boost
    - Back Buffer (Another canvas in memory)
        - Stress example
            - Current rendering Vs. Back buffer rendering
    - Canvas caching
        * Cache static drawings (Drawing Renderer, NEW)
        * Cache Images (Bitmap renderer)

- Remove canvas_wrapper pause in favour of the layer manager pause

- Handle Adding and removing of renderer in a similar fashion to other components

- Organization, Recycling and Destruction
    * Cleanup of pools. 
    * Bundles of pool setups
    * Reclaimer. This guy will be used to get the specified game_objects back into their pools for re-use.

-----------------------------------

#### Status: Not usable. Working on example code.

* Right now you could use this to do something, if you could take a look inside my mind that is. 
* Examples are in the making.

-----------------------------------

#### [This is the game][tirador] I put together using the previous encarnation of this set of files.

[game]: http://f.cl.ly/items/3N420I093v3b03051W39/game.png
[tirador]: http://www.treintipollo.com/tirador/index.html
