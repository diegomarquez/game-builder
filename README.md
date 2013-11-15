# Game.js

![game][game]

These are some files I decided to extract from a previous javascript project. It's kind of like a framework to make simple games, things like Asteroids or Galaga.

-----------------------------------

###### Current TODO List:

- Power-up setModulePath method

- Write a README.md for each example
    * Delegates
        + Overview on all the callbacks available to game_object
        + Overview on all the callbacks available to canvas_wrapper
        + Overview on all the callbacks available to component
        + Overview on all the callbacks available to collider_component

- Think about how to handle paths to images/sound

- Make Sublime plugin to generate files from templates
    - Make an empty menu structure.
    - Add options to create different types of files from templates
    - Button to automatically generate setModulePath calls where needed
    - Code observer to add and remove setModulePath calls automatically

- Use HTML to add some on screen explanation of what is going on
- Add additional debug drawing to game_object
    * global transformed position
- Explain main components in the main README.md
- Rough explanation of each folder in src in respective README.md files
- Spike Performance Boost
    - Canvas caching
        * Cache static drawings (Drawing Renderer, NEW)
        * Cache Images (Bitmap renderer)
- Extensions
    * TimerFactory extension, pause and resume all timeout when pausing the game ( No Demo )
    * Keyboard extension, block keyboard keys when pausing the game ( No Demo )
    * Extension to setup basic layers
    * Move pause and resume logic into an extension
    * Move default layer setup into an extension
- Handle Adding and removing of renderer in a similar fashion to other components
- Sub state machine state. Special state which contains a state machine. Used for branching paths
- Text
- When creating the component pools, infer the amounts from the configurations on the game object pool

-----------------------------------

#### Status: v1 of examples is complete. v2, should be a little less verbose. 

-----------------------------------

#### [This is the game][tirador] I put together using the previous encarnation of this set of files.

[game]: http://f.cl.ly/items/3N420I093v3b03051W39/game.png
[tirador]: http://www.treintipollo.com/tirador/index.html
