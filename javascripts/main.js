$(function() {
  init();
});

var camera, scene, renderer;
var geometry, material, mesh;

function init() {
  var SCENE_WIDTH = 600, SCENE_HEIGHT = 500;

  camera = new THREE.PerspectiveCamera( 75, SCENE_WIDTH / SCENE_HEIGHT, 1, 10000 );
  camera.position.z = 100;

  scene = new THREE.Scene();

  var radius = 50, segments = 16, rings = 16;
  geometry = new THREE.SphereGeometry(radius, segments, rings);
  material = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

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

  renderer.render( scene, camera );
}
