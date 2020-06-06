import decomp from 'poly-decomp';
window.decomp = decomp;

import Matter from 'matter-js';

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

// // create a renderer
const render = Render.create({
  element: document.body,
  canvas: canvas,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    showAngleIndicator: true
  }
});

// create two boxes and a ground
const ground = Bodies.rectangle(width/2, height-15, width * 2, 30, { isStatic: true });

const tri1 = Bodies.fromVertices(200, 50, [
  {x:0, y: 0}, { x:150, y: 0}, { x:0, y: 300}
], {});
const domtri1 = document.getElementById('tri1');

const tri2 = Bodies.fromVertices(350, 50, [
  {x:150, y: 0}, { x:450, y: 0}, { x:200, y: 200}
], {});
const domtri2 = document.getElementById('tri2');

const tri3 = Bodies.fromVertices(650, 50, [
  {x:450, y: 0}, { x:450, y: 200}, { x:200, y: 450}
], {});
const domtri3 = document.getElementById('tri3');

const tri4 = Bodies.fromVertices(350, 50, [
  {x:150, y: 0}, { x:200, y: 200}, { x:0, y: 300}
], {});
const domtri4 = document.getElementById('tri4');

const tri5 = Bodies.fromVertices(650, 50, [
  {x:450, y: 0}, { x:200, y: 450}, { x:200, y: 200}
], {});
const domtri5 = document.getElementById('tri5');

const tri6 = Bodies.fromVertices(650, 250, [
  {x:450, y: 200}, { x:450, y: 450}, { x:200, y: 450}
], {});
const domtri6 = document.getElementById('tri6');

const tri7 = Bodies.fromVertices(200, 350, [
  {x:0, y: 300}, { x:200, y: 200}, { x:200, y: 450}
], {});
const domtri7 = document.getElementById('tri7');

const tri8 = Bodies.fromVertices(200, 500, [
  {x:0, y: 300}, { x:200, y: 450}, { x:0, y: 450}
], {});
const domtri8 = document.getElementById('tri8');

// angle: 0.7849758432481151
// position: {x: 379.8078365952171, y: 949.1159271850172}

var runner = Runner.create();
Runner.run(runner, engine);

// add all of the bodies to the world
World.add(engine.world, [tri1, tri2, tri3, tri4, tri5, tri6, tri7, tri8, ground]);

// run the renderer
Render.run(render);

Events.on(engine, "afterUpdate", ()=>{
  // console.log(temp)
  // console.log(`translate(${tri1.position.x}px ${tri1.position.y}px) rotate(${tri1.angle}deg)`)
  domtri1.style.transform = `translate(${tri1.position.x}px, ${tri1.position.y}px) rotate(${tri1.angle}rad)`;
  domtri2.style.transform = `translate(${tri2.position.x}px, ${tri2.position.y}px) rotate(${tri2.angle}rad)`;
  domtri3.style.transform = `translate(${tri3.position.x}px, ${tri3.position.y}px) rotate(${tri3.angle}rad)`;
  domtri4.style.transform = `translate(${tri4.position.x}px, ${tri4.position.y}px) rotate(${tri4.angle}rad)`;
  domtri5.style.transform = `translate(${tri5.position.x}px, ${tri5.position.y}px) rotate(${tri5.angle}rad)`;
  domtri6.style.transform = `translate(${tri6.position.x}px, ${tri6.position.y}px) rotate(${tri6.angle}rad)`;
  domtri7.style.transform = `translate(${tri7.position.x}px, ${tri7.position.y}px) rotate(${tri7.angle}rad)`;
  domtri8.style.transform = `translate(${tri8.position.x}px, ${tri8.position.y}px) rotate(${tri8.angle}rad)`;

})