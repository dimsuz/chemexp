
$(function() {
  init();
  animate();
});

var camera, scene, renderer, controls;

function init() {
  var SCENE_WIDTH = 500, SCENE_HEIGHT = 500;

  camera = new THREE.PerspectiveCamera( 75, SCENE_WIDTH / SCENE_HEIGHT, 1, 10000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 500;

  scene = new THREE.Scene();
  buildAxes(scene);
  buildMolecule1(scene);

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

/**
 * takes a tetrahedron edge side and builds a set of vertexes for its coords
 */
function createTetrahedronCoords(edgeSize) {
  var vertexes = [];
  vertexes.push(new THREE.Vector3(0, 0, -Math.sqrt(3)*edgeSize/3));
  vertexes.push(new THREE.Vector3(edgeSize/2, 0, Math.sqrt(3)*edgeSize/6));
  vertexes.push(new THREE.Vector3(-edgeSize/2, 0, Math.sqrt(3)*edgeSize/6));
  var H = Math.sqrt(6)*edgeSize/3;
  var R = Math.sqrt(6)*edgeSize/4;
  vertexes.push(new THREE.Vector3(0, H, 0));

  // center point
  vertexes.push(new THREE.Vector3(0, H - R, 0));

  return vertexes;
}

function buildMolecule1(scene) {
  var vertexes = createTetrahedronCoords(200);
  var atomRadius = 30;
  vertexes.forEach(function(v) {
    var material = new THREE.MeshLambertMaterial( { color: 0xBBBBBB } );
    var geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position = v;
    scene.add(mesh);
  });

  buildBonds(scene, vertexes, atomRadius);
}

function buildBonds(scene, vertexes, atomRadius) {
  var center = vertexes[vertexes.length - 1];
  var bondLength = 60;
  var material = new THREE.MeshLambertMaterial( { color: 0xBBBBBB } );
  var geometry = new THREE.CylinderGeometry(8, 8, bondLength, 8, 8, false);
  // transfer origin to end of cylinder
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, bondLength/2, 0) );
  var mesh = new THREE.Mesh(geometry, material);
  var angle = vertexes[1].angleTo(new THREE.Vector3(1, 0, 0));
  console.log(angle);
  mesh.position.set(center.x, center.y + atomRadius, center.z);
  rotateAroundWorldAxis(mesh, new THREE.Vector3(0, 0, 1), Math.PI*-90/180);
  //rotateAroundWorldAxis(mesh, new THREE.Vector3(0, 1, 0), Math.PI*45/180);
  //rotateAroundWorldAxis(mesh, new THREE.Vector3(0, 1, 0), angle);
  scene.add(mesh);

  geometry = new THREE.Geometry();
  geometry.vertices.push(center);
  geometry.vertices.push(vertexes[1]);
  var line = new THREE.Line(geometry, material, parameters = { linewidth: 400 });
  scene.add(line);
}


var rotWorldMatrix;
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;

    // new code for Three.js v50+
    object.rotation.setEulerFromRotationMatrix(object.matrix);

    // old code for Three.js v49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
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
