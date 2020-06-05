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

// create a renderer
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
const boxA = Bodies.rectangle(400, 200, 80, 80);
const boxB = Bodies.rectangle(450, 50, 80, 80);
const ground = Bodies.rectangle(width/2, height-15, width, 30, { isStatic: true });

// create body from vertices
var temp = Bodies.fromVertices(400, 100, [{x:0, y:0}, {x:30, y:0}, {x:0, y:30}], {});




// angle: 0.7849758432481151
// anglePrev: 0.7849758439467257
// angularSpeed:
// 6.91624287840753
// e-10
// angularVelocity:
// -6.912524996849356
// e-10
// area: 450
// axes: (3) [{…}, {…}, {…}]
// bounds: {min: {…}, max: {…}}
// collisionFilter: {category: 1, mask: 4294967295, group: 0}
// constraintImpulse: {x: 0, y: 0, angle: 0}
// density: 0.001
// force: {x: 0, y: 0}
// friction: 0.1
// frictionAir: 0.01
// frictionStatic: 0.5
// id: 4
// inertia: 180
// inverseInertia: 0.005555555555555556
// inverseMass: 2.2222222222222223
// isSensor: false
// isSleeping: false
// isStatic: false
// label: "Body"
// mass: 0.45
// motion: 0
// parent: {id: 4, type: "body", label: "Body", parts: Array(1), plugin: {…}, …}
// parts: [{…}]
// plugin: {}
// position: {x: 379.8078365952171, y: 949.1159271850172}
// positionImpulse: {x: 0, y: 0}
// positionPrev: {x: 379.8078366518164, y: 949.1159271782736}
// region: {id: "7,8,19,19", startCol: 7, endCol: 8, startRow: 19, endRow: 19}
// render: {visible: true, opacity: 1, sprite: {…}, lineWidth: 0, fillStyle: "#FFBC42", …}
// restitution: 0
// sleepCounter: 0
// sleepThreshold: 60
// slop: 0.05
// speed: 0.27785556767601527
// timeScale: 1
// torque: 0
// totalContacts: 0
// type: "body"
// velocity: {x: -6.352411219268106e-8, y: 7.623157216585241e-9}
// vertices: (3) [{…}, {…}, {…}]




var runner = Runner.create();
Runner.run(runner, engine);

// add all of the bodies to the world
World.add(engine.world, [temp, boxA, boxB, ground]);

// run the renderer
Render.run(render);

Events.on(engine, "afterUpdate", ()=>{
  // console.log(temp)
})