[example]: http://diegomarquez.github.io/game/examples/game_object_nesting/index.html
[bundles]: ../resources/bundles
[nesting_bundle]: ../resources/bundles/nesting_bundle.js

# Nest game objects into game object containers 

#### This examples show how can you nest game object. Nested game objects will follow the transformation matrix of their respective parent.

#### You can view this [example running][example]

**********
**********
**********

##### New things that are happening here

* main.js

```javascript
require('nesting_bundle').create();  
```
[The bundle used in this example][nesting_bundle]

**********

```javascript
//The ID Continer_1 is defined in nesting_bundle.js
gjs.addToLayer('Middle', 'Container_1');
```

This does the same that the previous example, but instead of calling all the methods involved manually, the short-hand method **addToLayer** of the **gjs global object** is used.
