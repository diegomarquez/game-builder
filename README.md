# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. 

-----------------------------------

###### Current TODO List:

- Tag game-builder and set as default option in generator
    - Handle Adding and removing of renderer in a similar fashion to other components
    - When creating the component pools, infer the amounts from the configurations on the game object pool
    - Add additional debug drawing to game_object
        * global transformed position

- Examples v3
    -Move into own repository
    -Redo them with the generator
    
- Remove everything that is not the main source code from this repository

- Redo the gh-pages branch build system to accomodate for the new structure
    - Rethink the page layout of the website

- Anotate example code to generate documentation

- Make Sublime plugin to generate files from templates
    - Make an empty menu structure.
    - Hook yeoman generators into each option

- Think about how to handle paths to images/sound
    Yeoman subgenerator to create a file with name/paths pairs.
    Pick up urls from another file to create mappings for remote resources.
    This could eb loaded as a text file when needed, or maybe a module. In any case, should be lightweight. 

- Extensions 2
    * TimerFactory extension, pause and resume all timeout when pausing the game ( No Demo )
    * Keyboard extension, block keyboard keys when pausing the game ( No Demo )

-Examples v4
    - Use HTML to add some on screen explanation of what is going on
    - Or anything to make them look prettier.
    - Some CSS to decorate the sorroundings?

- Spike Performance Boost
    - Canvas caching
        * Cache static drawings (Drawing Renderer, NEW)
        * Cache Images (Bitmap renderer)       

- Sub state machine state. Special state which contains a state machine. Used for branching paths

- Text

- Figure out how to use r.js

#### [This is the prototype game][tirador] which spurred the creation of this project.

[game]: http://f.cl.ly/items/3N420I093v3b03051W39/game.png
[tirador]: http://www.treintipollo.com/tirador/index.html
[generator]: https://github.com/diegomarquez/generator-game-builder
[yeoman]: http://yeoman.io/
[game-builder]: http://diegomarquez.github.io/game-builder