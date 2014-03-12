# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. 

-----------------------------------

###### TODO List:

- Get a cool logo for Game-Builder

- Extensions 2
    - TimerFactory extension, pause and resume all timeout when pausing the game ( No Demo )
    - Keyboard extension, block keyboard keys when pausing the game ( No Demo )

- Tag latest version of game-builder

- Deploy gh-pages

-Examples v4
    - Use HTML to add some on screen explanation of what is going on

- Spike Performance Boost
    - Canvas caching
        * Cache static drawings (Drawing Renderer, NEW)
        * Cache Images (Bitmap renderer)       

- Sub state machine state. Special state which contains a state machine. Used for branching paths

- Text

- Premade renderer to draw rectangles, circles lines and triangles.

- Figure out how to use r.js

- Do a simple game and get this over with for fucks sake!

- Annoying tasks
    - Rename delegate.js to broadcaster.js
    - Test garbage collection
        - Test delegate.js destroy method properly
    - Links to explanations of known errors, like requireJS
        - Single page in the website

### [This is the prototype game][tirador] which spurred the creation of this project.

[game]: http://f.cl.ly/items/3N420I093v3b03051W39/game.png
[tirador]: http://www.treintipollo.com/tirador/index.html
[generator]: https://github.com/diegomarquez/generator-game-builder
[yeoman]: http://yeoman.io/
[game-builder]: http://diegomarquez.github.io/game-builder