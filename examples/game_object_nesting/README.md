[example]: http://diegomarquez.github.io/game/examples/game_object_nesting/index.html
[bundles]: ../resources/bundles
[bundle]: ../resources/bundles/nesting_bundle.js

[css]: ./main.css
[main]: ./main.js
[index]: ./index.html
[bootstrap]: ../src/bootstrap.js

[layers]: ../../src/hierarchy/layers.js
[assembler]: ../../src/pools/assembler.js

[game_object]: ../../src/hierarchy/game_object.js
[renderer]: ../../src/components/rendering/renderer.js
[game_object_container]: ../../src/hierarchy/game_object_container.js

[basic_game_object]: ../resources/basic_game_object.js
[box_renderer]: ../resources/box_renderer.js
[basic_container]: ../resources/basic_container.js

# Nest game objects into game object containers 

#### This example will be using a container. You can add other game objects as childs to these, and they will follow their parent everywhere using matrix transformations I do not understand. God bless them. The childs of a container are drawn on top of it in the order they were added.

#### You can view this [example running][example]

**********
**********
**********

### New things that are happening here

**New Modules used in this example**

[**basic_container.js**][basic_container] => [**game_object_container.js**][game_object_container] => [**game_object.js**][game_object]

**********
**********
**********

[**main.js**][main]

```javascript
require('nesting_bundle').create();  
```
[The bundle used in this example][bundle]

**********

```javascript
//The ID Continer_1 is defined in nesting_bundle.js
gjs.addToLayer('Middle', 'Container_1');
```

This does the same that the previous example, but instead of calling all the methods involved manually, the short-hand method **addToLayer** of the **gjs global** is used.
