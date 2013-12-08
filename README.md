# Game.js

![game][game]

These are some files I decided to extract from a previous javascript project. It's kind of like a framework to make simple games, things like Asteroids or Galaga.

-----------------------------------

###### Current TODO List:

- Move examples into own repository

- Remove everything that is not the main source code from this repository

- Redo the gh-pages branch build system to accomodate for the new structure
    - Rethink the page layout of the website

- Make Sublime plugin to generate files from templates
    - Make an empty menu structure.
    - Hook yeoman generators into each option

- Anotate example code to generate documentation

- Think about how to handle paths to images/sound

- Use HTML to add some on screen explanation of what is going on

- Add additional debug drawing to game_object
    * global transformed position

- Spike Performance Boost
    - Canvas caching
        * Cache static drawings (Drawing Renderer, NEW)
        * Cache Images (Bitmap renderer)       

- Handle Adding and removing of renderer in a similar fashion to other components

- Sub state machine state. Special state which contains a state machine. Used for branching paths

- Text

- When creating the component pools, infer the amounts from the configurations on the game object pool

- Extensions 2
    * TimerFactory extension, pause and resume all timeout when pausing the game ( No Demo )
    * Keyboard extension, block keyboard keys when pausing the game ( No Demo )

- Figure out how to use r.js

-----------------------------------

#### Status: v2 of examples is complete. This is starting to look good, but there is still yet documentation to be written about the examples. 

-----------------------------------

#### [This is the game][tirador] I put together using the previous encarnation of this set of files.

[game]: http://f.cl.ly/items/3N420I093v3b03051W39/game.png
[tirador]: http://www.treintipollo.com/tirador/index.html
