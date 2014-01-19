# fixed-state-machine
-------------------

An example on a different kind of state machine. It is said to be **fixed**, because
a given state can not just pass control flow to any other state, it can only do so to the states
it has been configured to do so. 

The above means, that if coded properly, a state needs to know nothing about the other states
in the state machine, which is good form.

This example also illustrates how to separate state code into different files, if that is what rocks your boat.

A [GAME-BUILDER][game-builder] project

[game-builder]: http://diegomarquez.github.io/game-builder