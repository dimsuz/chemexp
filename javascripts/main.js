
$(function() {
  init();
  animate();
});

var camera, scene, renderer, controls;

function init() {
  var SCENE_WIDTH = 300, SCENE_HEIGHT = 300;

  camera = new THREE.PerspectiveCamera( 75, SCENE_WIDTH / SCENE_HEIGHT, 1, 10000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 500;

  scene = new THREE.Scene();
  //buildAxes(scene);
  buildMolecule(scene);

  var keyLight =
    new THREE.PointLight(0xFFFFFF);
  keyLight.position.x = -20;
  keyLight.position.y = 50;
  keyLight.position.z = 550;
  keyLight.intensity = 0.8;

  var fillLight =
    new THREE.PointLight(0xFFFFFF);
  fillLight.position.x = 50;
  fillLight.position.y = 50;
  fillLight.position.z = 550;
  fillLight.intensity = 0.3;

  var backLight =
    new THREE.PointLight(0xFFFFFF);
  backLight.position.x = 0;
  backLight.position.y = 0;
  backLight.position.z = -200;
  backLight.intensity = 1.0;

  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);

  //renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( SCENE_WIDTH, SCENE_HEIGHT );

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.addEventListener('change', render);
  $('#render_container').html( renderer.domElement );
}

function render() {
  renderer.render( scene, camera );
}

function animate() {
  requestAnimationFrame(animate);
  if(typeof controls !== 'undefined') {
    controls.update();
  }
}

function buildMolecule(scene) {
  var geometry, mesh, atomRadius;
  var bondLength = 60;
  var bondInsideLength = 5; // how much bond is 'inside' an atom
  var x = 0;
  var y = 0;

  // Carbon atom
  var materialCarbon = new THREE.MeshLambertMaterial( { color: 0xBBBBBB } );
  var atomCarbonRadius = 50;
  geometry = new THREE.SphereGeometry(atomCarbonRadius, 16, 16);
  mesh = new THREE.Mesh( geometry, materialCarbon );
  mesh.position.set(x, 0, 0);
  scene.add( mesh );
  // bonds
  createBonds(null, 0, 0, bondLength, bondInsideLength, atomCarbonRadius, materialCarbon);
  x +=  atomCarbonRadius + bondLength - bondInsideLength;

  // brom atom
  var materialBrom = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
  atomRadius = 60;
  x += atomRadius + bondLength - bondInsideLength;
  geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
  mesh = new THREE.Mesh( geometry, materialBrom );
  mesh.position.set(x, 0, 0);
  scene.add( mesh );
  // bonds
  createBonds([ false, false, false, true ], x, 0, bondLength, bondInsideLength, atomRadius, materialBrom);

  // chlor atom
  var materialChlor = new THREE.MeshLambertMaterial( { color: 0x00FF00 } );
  atomRadius = 60;
  x = 0;
  y = atomCarbonRadius + atomRadius + bondLength*2 - bondInsideLength*2;
  geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
  mesh = new THREE.Mesh( geometry, materialChlor );
  mesh.position.set(x, y, 0);
  scene.add( mesh );
  // bonds
  createBonds([ false, false, true, false ], x, y, bondLength, bondInsideLength, atomRadius, materialChlor);

  var materialFtor = new THREE.MeshLambertMaterial( { color: 0xFFFF00 } );
  atomRadius = 45;
  x = 0;
  y = -(atomCarbonRadius + atomRadius + bondLength*2 - bondInsideLength*2);
  geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
  mesh = new THREE.Mesh( geometry, materialFtor );
  mesh.position.set(x, y, 0);
  scene.add( mesh );
  // bonds
  createBonds([ true, false, false, false ], x, y, bondLength, bondInsideLength, atomRadius, materialChlor);

  var materialGray = new THREE.MeshLambertMaterial( { color: 0xEFEFEF } );
  atomRadius = 35;
  x = -(atomCarbonRadius + atomRadius + bondLength*2 - bondInsideLength*2);
  y = 0;
  geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
  mesh = new THREE.Mesh( geometry, materialGray );
  mesh.position.set(x, y, 0);
  scene.add( mesh );
  // bonds
  createBonds([ false, true, false, false ], x, y, bondLength, bondInsideLength, atomRadius, materialGray);
}

// whichBonds is an array of booleans [ showTop, showRight, showBottom, showLeft ]
// if it is null, all are shown
function createBonds(whichBonds, x, y, bondLength, bondInsideLength, atomRadius, material) {
  var bondBottomPosition = bondLength / 2 + atomRadius - bondInsideLength;
  var mesh, geometry;

  geometry = new THREE.CylinderGeometry(8, 8, bondLength, 8, 8, false);

  if(!!!whichBonds || whichBonds[0] === true) {
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x, y+bondBottomPosition, 0);
    scene.add(mesh);
  }
  if(!!!whichBonds || whichBonds[1] === true) {
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x+bondBottomPosition, y, 0);
    mesh.rotation.z = Math.PI/2;
    scene.add(mesh);
  }
  if(!!!whichBonds || whichBonds[2] === true) {
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x, y-bondBottomPosition, 0);
    scene.add(mesh);
  }

  if(!!!whichBonds || whichBonds[3] === true) {
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x-bondBottomPosition, y, 0);
    mesh.rotation.z = Math.PI/2;
    scene.add(mesh);
  }
}

function buildAxes(scene) {
  var geometry = new THREE.Geometry();
  var axisLength = 600;
  geometry.vertices.push(new THREE.Vector3(-axisLength, 0, 0));
  geometry.vertices.push(new THREE.Vector3(axisLength, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, -axisLength, 0));
  geometry.vertices.push(new THREE.Vector3(0, axisLength, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, -axisLength));
  geometry.vertices.push(new THREE.Vector3(0, 0, axisLength));
  scene.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000FF }), THREE.LinePieces));
}
