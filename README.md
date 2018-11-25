# alchemy
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
