# loose-state-machine
-------------------

This example will be about setting up a state machine.

State machines can be used to make your code a little less of a nightmare. Particularly effective with video game code. 

This is a **loose** state machine because every state can pass control flow to any state in the
state machine. This means each state needs to know something about the other states, whci is not
so good, but works well to keep a nice organization among samll pieces of code.

A not very complex enemy in some run of the mill video game comes to mind. Those tend to have a bunch
of states, but also tend to have rather short logic in each state. For those cases, this state machine is perfect.

A [GAME-BUILDER][game-builder] project

[game-builder]: http://diegomarquez.github.io/game-builder