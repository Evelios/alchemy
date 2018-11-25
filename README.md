# alchemy
A bunch of alchemy arrays and transmutation like algorithms focusing on capturing the geometry associated with alchemical works

```js
Vector : [
 {number} x,
 {number} y
]

Circle : {
  {Vector} center,
  {number} radius,
  {number} nsides,
  {number} rotation,
}
 
Polygon : [
  {Vector}...
]
```

A transmutation is an object is of the following structure

+ {tree<strokes>} rendering : The paths that need to be drawn in order to render a transmutation
+ {list<Circle>}  forks     : All the possible algorithm branching points off of a transmutation
+ {Polygon}       interior  : The center polygon to run the algorithm inward towards the center
