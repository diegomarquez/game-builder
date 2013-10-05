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
        + Image Renderer
        + Drawing Renderer
    * Input
        + Demo: Collision
            + Circle
            + Polygon
            + Fixed Polygon
        + Demo: Dynamic add and remove of childs in containers
        + Demo: Dynamic add and remove of components
        + Pausing/Resuming
    * Sound
    * Timers
    * State Machine
    * Delegates
        + Overview on all the callbacks available to game_object
        + Overview on all the callbacks available to canvas_wrapper
        + Overview on all the callbacks available to component
    * Canvas Wrapper 
        + Pause & Resume
        + Extensions
    * Different ways to send in arguments to a game_object
        + Configuration Type
        + Through assembler.get
        + Through game_object.start
    * Layer Manager
        + Other features
    * Text
        + Use this in all the examples to explain what is going on Screen

- Write a README.md for each example

- Have a common folder with all the game_objects and components used in all the examples.
    * Having them duplicated in every example is getting retarded.

- Spike Canvas caching.
    * Cache static drawings
    * Cache Images

- Handle Adding and removing of renderer in a similar fashion to other components

- Method to merge objects

-----------------------------------

#### Status: Not usable. Working on example code.

* Right now you could use this to do something, if you could take a look inside my mind that is. 
* Examples are in the making.

-----------------------------------

#### [This is the game][tirador] I put together using the previous encarnation of this set of files.

[game]: http://f.cl.ly/items/3N420I093v3b03051W39/game.png
[tirador]: http://www.treintipollo.com/tirador/index.html
