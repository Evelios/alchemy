# Circular Alchemy Array Generation

## Usage

```js
const Alchemy = require('transmutation');

const paths = Alchemy.transmute(options);
```

**Options**
+ center {Vector} : The starting center point of the algorithm
+ starting\_size {number} : The starting size of the initial node
+ max\_size {number} : The maximum size to stop branching the algorithm
+ min\_size {number} : The minimum size of a circle to stop working inwards


# Object Types

A bunch of alchemy arrays and transmutation like algorithms focusing on capturing the geometry associated with alchemical works

```js
Vector : [
 {number} x,
 {number} y
]

// Must be length 2 or greater
Stroke : [
  ...Vector
]

Circle : {
  {Vector} center,
  {number} radius,
}

Polygon : {
  {Vector} center,
  {number} radius,
  {number} nsides,
  {number} rotation,
}
```

A transmutation is an object is of the following structure

+ {tree<Stroke>} rendering : The paths that need to be drawn in order to render a transmutation
+ {list<Polygon>}  forks    : All the possible algorithm branching points off of a transmutation
+ {Polygon}       interior  : The center polygon to run the algorithm inward towards the center
