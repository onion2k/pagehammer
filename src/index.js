import decomp from 'poly-decomp';
window.decomp = decomp;
import Matter from 'matter-js';
import Delaunator from 'delaunator';

const getTriangleCentroid = (coords) => {
	const centerX = (coords[0].x + coords[1].x + coords[2].x) / 3;
	const centerY = (coords[0].y + coords[1].y + coords[2].y) / 3;
	return [Math.round(centerX), Math.round(centerY)];
}

const width = window.innerWidth;
const height = window.innerHeight;

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Runner = Matter.Runner;
const Events = Matter.Events;

const engine = Engine.create({
  width: width,
  height: height
});

const base = document.getElementById('base');

const bodies = [];
const dombods = [];
const points = [[0,0], [width,0], [width,height], [0,height], [width*0.5,0], [width*0.5,height]];

const cellBase = 3;
const randomOffset = 300;
const cellWidth = width / cellBase;
const cellHeight = height / cellBase;
for (let x = 0; x < cellBase*cellBase; x++) {
  points.push(
    [
      Math.floor(randomOffset * 0.5 - Math.random() * randomOffset) + ((x / cellBase) * cellWidth),
      Math.floor(randomOffset * 0.5 - Math.random() * randomOffset) + ((x % cellBase) * cellHeight)
    ]
  );
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

  const domtri = base.cloneNode(true);
  domtri.style.transformOrigin = `${c[0]}px ${c[1]}px`;
  domtri.style.clipPath = `polygon(${v[0].x}px ${v[0].y}px, ${v[1].x}px ${v[1].y}px, ${v[2].x}px ${v[2].y}px)`;
  document.body.appendChild(domtri);
  dombods.push([domtri, c[0], c[1]]);
}

bodies.push(Bodies.rectangle(width/2, height+70, width * 2, 100, { isStatic: true })); // ground
bodies.push(Bodies.rectangle(-40, height/2, 40, height, { isStatic: true })); // left
bodies.push(Bodies.rectangle(width+40, height/2, 40, height, { isStatic: true })); // right

World.add(engine.world, bodies);

const runner = Runner.create();

Events.on(engine, "afterUpdate", ()=>{
  for (let x=0; x<dombods.length; x++) {
    dombods[x][0].style.transform = `translate(${bodies[x].position.x - dombods[x][1]}px, ${bodies[x].position.y - dombods[x][2]}px) rotate(${bodies[x].angle}rad)`;
  }
});

document.getElementById('smash').addEventListener('click', ()=>{
  base.style.display = 'none';
  Runner.run(runner, engine);
})