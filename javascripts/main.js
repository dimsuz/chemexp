
$(function() {
  init();
  animate();
});

var camera, scene, renderer, controls;

function init() {
  var SCENE_WIDTH = 600, SCENE_HEIGHT = 500;

  camera = new THREE.PerspectiveCamera( 75, SCENE_WIDTH / SCENE_HEIGHT, 1, 10000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 500;
  controls = new THREE.TrackballControls(camera);
  controls.addEventListener('change', render);

  scene = new THREE.Scene();
  buildAxes(scene);
  buildMolecule(scene);

  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  //renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( SCENE_WIDTH, SCENE_HEIGHT );

  $('#render_container').html( renderer.domElement );
}

function render() {
  renderer.render( scene, camera );
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function buildMolecule(scene) {
  var geometry, mesh;

  var materialCarbon = new THREE.MeshLambertMaterial( { color: 0xBBBBBB } );
  geometry = new THREE.SphereGeometry(50, 16, 16);
  mesh = new THREE.Mesh( geometry, materialCarbon );
  mesh.position.set(0, 0, 0);
  scene.add( mesh );

  var materialBrom = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
  geometry = new THREE.SphereGeometry(60, 16, 16);
  mesh = new THREE.Mesh( geometry, materialBrom );
  mesh.position.set(110, 0, 0);
  scene.add( mesh );
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
