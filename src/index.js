import decomp from 'poly-decomp';
window.decomp = decomp;

import Matter from 'matter-js';
import Delaunator from 'delaunator';

function getTriangleCentroid(coords){
	const centerX = (coords[0].x + coords[1].x + coords[2].x) / 3;
	const centerY = (coords[0].y + coords[1].y + coords[2].y) / 3;
	return [Math.round(centerX), Math.round(centerY)];
}

const canvas = document.getElementById("canvas");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

// module aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Runner = Matter.Runner;
const Events = Matter.Events;

// create an engine
const engine = Engine.create({
  width: width,
  height: height
});

const page = document.getElementById('base');

const bodies = [];
const dombods = [];
const points = [[0,0], [width,0], [width,height], [0,height], [width*0.5,0], [width*0.5,height]];
for (let x = 0; x < 10; x++) {
  points.push([Math.floor(Math.random()*width), Math.floor(Math.random()*height)]);
}
const del = Delaunator.from(points);
const tris = [];
for (let i = 0; i < del.triangles.length; i += 3) {
  tris.push([
      points[del.triangles[i]],
      points[del.triangles[i + 1]],
      points[del.triangles[i + 2]]
  ]);
}

for (let x=0; x< tris.length; x++) {
  const v = [
    {x: tris[x][0][0], y: tris[x][0][1]},
    {x: tris[x][1][0], y: tris[x][1][1]},
    {x: tris[x][2][0], y: tris[x][2][1]},
  ];
  const c = getTriangleCentroid(v);
  bodies.push(Bodies.fromVertices(c[0], c[1], v, {}));

  const domtri = page.cloneNode(true);
  domtri.style.transformOrigin = `${c[0]}px ${c[1]}px`;
  domtri.style.display = 'block';
  domtri.style.clipPath = `polygon(${v[0].x}px ${v[0].y}px, ${v[1].x}px ${v[1].y}px, ${v[2].x}px ${v[2].y}px)`;
  document.body.appendChild(domtri);

  dombods.push([domtri, c[0], c[1]]);

}

bodies.push(Bodies.rectangle(width/2, height+50, width * 2, 100, { isStatic: true })); // ground

var runner = Runner.create();
Runner.run(runner, engine);

// add all of the bodies to the world
World.add(engine.world, bodies);

Events.on(engine, "afterUpdate", ()=>{
  for (let x=0; x<dombods.length; x++) {
    dombods[x][0].style.transform = `translate(${bodies[x].position.x - dombods[x][1]}px, ${bodies[x].position.y - dombods[x][2]}px) rotate(${bodies[x].angle}rad)`;
  }
})