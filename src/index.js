/**
 * Import poly-decomp. This is used by matter.js to create polygons
 */
import decomp from 'poly-decomp';
window.decomp = decomp;

/**
 * Import Delaunator. This is creates a mesh of polygons from a set of coordinates
 */
import Delaunator from 'delaunator';

/**
 * Import centroid. This is a function for calculating the center of a triangle
 */
import centroid from './centroid.js';

/**
 * Import the width and height of the browser viewport
 */
import { width, height } from './dimensions.js';

/**
 * Import Smash. This is mostly just a wrapper around matter.js
 */
import { Smash } from './matter-init.js'

/**
 * Get the element that's going to be broken up from the page
 */
const base = document.getElementById('base');

/**
 * Set up the cells object. This contains some values that are used to determine the size of the triangles on the page
 */
const cells = {
  base: 3,
  offset: 150,
}
cells.width = width / cells.base;
cells.height = height / cells.base;

/**
 * Set up two arrays to hold 'global' state
 */
const matterbodies = [];
const dombodies = [];

/**
 * Set up the points around the edge of the screen
 */
const points = [[0,0], [width,0], [width,height], [0,height], [width*0.25, 0], [width*0.25, height], [width*0.5, 0], [width*0.5, height], [width*0.75, 0], [width*0.75, height], [0, height*0.5], [width, height*0.5]];

/**
 * Add more points around the middle of the screen for triangulation
 */
for (let x = 0; x < cells.base*cells.base; x++) {
  points.push(
    [
      Math.floor(cells.offset * 0.5 - Math.random() * cells.offset) + ((x / cells.base) * cells.width),
      Math.floor(cells.offset * 0.5 - Math.random() * cells.offset) + ((x % cells.base) * cells.height)
    ]
  );
}

/**
 * Using Delaunator's from() method, create a mesh of triangles using the points generated in the first step.
 */
const del = Delaunator.from(points);

/**
 * Convert the output of Delaunator.from from an array with 3 elements per triangle to something we can use more easily
 */
const tris = [];
for (let i = 0; i < del.triangles.length; i += 3) {
  tris.push([
      points[del.triangles[i]],
      points[del.triangles[i + 1]],
      points[del.triangles[i + 2]]
  ]);
}

/**
 * Loop through the array of triples and create a matter polygon and a DOM node for each one
 */
for (let x=0; x< tris.length; x++) {
  /**
   * Luckily both matter.js and CSS clip-path expect an array of three objects with the shape { x: <int>, y: <int> } to define a polygon
   */
  const v = [
    {x: tris[x][0][0], y: tris[x][0][1]},
    {x: tris[x][1][0], y: tris[x][1][1]},
    {x: tris[x][2][0], y: tris[x][2][1]},
  ];

  /**
   * Find the centroid (2D center) of the triange
   */
  const c = centroid(v);
  
  /**
   * Create a matter.js polygon and push it on to the 'bodies' array that we'll pass to matter.js's World eventually
   */
  matterbodies.push(Smash.Bodies.fromVertices(c[0], c[1], v, {}));

  /**
   * Create a DOM node for the triangle. This is a deep clone of the '#base' div.
   */
  const domtri = base.cloneNode(true);

  /**
   * Set the transform-origin of the node to it's centroid. This means when we rotate it it'll spin around the center of the triangle
   * that it's clipped to.
   */
  domtri.style.transformOrigin = `${c[0]}px ${c[1]}px`;

  /**
   * Clip the DOM to the same coordinates as the triangle in matter.js
   */
  domtri.style.clipPath = `polygon(${v[0].x}px ${v[0].y}px, ${v[1].x}px ${v[1].y}px, ${v[2].x}px ${v[2].y}px)`;
  domtri.style.webkitClipPath = `polygon(${v[0].x}px ${v[0].y}px, ${v[1].x}px ${v[1].y}px, ${v[2].x}px ${v[2].y}px)`;

  /**
   * Add the triangle to the page body
   */
  document.body.appendChild(domtri);

  /**
   * Push the triangle div in to an array with it's centroid coordinates to use in the update loop later.
   */
  dombodies.push([domtri, c[0], c[1]]);
}

/**
 * Add three rectangles outside of the screen edges to represent walls and the ground. These give the triangles some space to
 * move, but stop them falling away completely.
 */
matterbodies.push(Smash.Bodies.rectangle(width/2, height+155, width * 2, 300, { isStatic: true })); // ground
matterbodies.push(Smash.Bodies.rectangle(-120, height/2, 100, height, { isStatic: true })); // left
matterbodies.push(Smash.Bodies.rectangle(width+120, height/2, 100, height, { isStatic: true })); // right

/**
 * Add all the triangles and the edge boxes to the the matter.js World.
 */
Smash.add(matterbodies);

/**
 * Add an event handler to the matter.js World that runs every time the physics engine does an update
 */
Smash.on("afterUpdate", ()=>{
  /**
   * Loop through each of the DOM nodes that we added to the page body and update it.
   */
  for (let x=0; x<dombodies.length; x++) {
    /**
     * Update the node's CSS 'transform' value. CSS transforms are hardware accelerated so they don't force a repaint of the screen. That way they're nice and fast.
     * NOTE: We need to subtract the centroid values from the new position in order to account for the fact that matter.js works using the center of a polygon
     * whereas the CSS code works based on the top left corner of the div 
     */
    dombodies[x][0].style.transform = `translate(${matterbodies[x].position.x - dombodies[x][1]}px, ${matterbodies[x].position.y - dombodies[x][2]}px) rotate(${matterbodies[x].angle}rad)`;
  }
})

/**
 * Set up a click event listener for the button. When the user clicks it hides the #base div and starts the physics engine running
 */
document.getElementById('smash').addEventListener('click', ()=>{
  base.style.display = 'none';
  Smash.run();
})