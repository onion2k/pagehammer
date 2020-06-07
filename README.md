# Smash

Smash is a breakable web page.

## Running Smash locally

Clone the repo, and run `npm i && npm start` to start the development server. It's built with Snowpack so all the usual snowpack things work.

## How Smash works

Smash uses Delaunator to create a mesh of triangles, and then it uses matter.js to simulate how the triangles would fall apart under the influence of gravity.

The lifecycle of the page is as follows;

* The page loads and index.js runs

* index.js creates a set of points that represent the edges of the page with some additional random points spread out across the viewport.

* Delaunator takes these points and creates a mesh of triangles to connect them all

* For each triangle the base div is cloned and injected in to the page body, and the div is clipped to the triangle using clip-path.

* A matching triangle is also created in the matter.js world.

* When the user clicks the "Smash" button the physics engine is started.

* On each tick of the physics engine the triangle polygons move, and their position and rotation data is converted to a CSS tranform that's applied to the corresponding triangle in the page.

* Everything falls apart.

## Contributing

PRs are welcome, especially for performance fixes.