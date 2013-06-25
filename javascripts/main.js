
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
  backLight.position.y = 100;
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
  var H = Math.sqrt(6)*edgeSize/3;
  var R = Math.sqrt(6)*edgeSize/4;
  var rBotTri = Math.sqrt(3)*edgeSize/6;

  var vertexes = [];
  // center point
  vertexes.push(new THREE.Vector3(0, 0, 0));

  vertexes.push(new THREE.Vector3(0, R - H, -Math.sqrt(3)*edgeSize/3));
  vertexes.push(new THREE.Vector3(edgeSize/2, R - H, rBotTri));
  vertexes.push(new THREE.Vector3(-edgeSize/2, R - H, rBotTri));
  vertexes.push(new THREE.Vector3(0, R, 0));

  return vertexes;
}

function buildMolecule1(scene) {
  var vertexes = createTetrahedronCoords(200);
  var atomRadius = 30;

  // C, Br, Cl, F, H
  var atomColors = [ 0xBBBBBB, 0xFF0000, 0x00FF00, 0xFFFF00, 0xEFEFEF ];

  vertexes.forEach(function(v, i) {
    var material = new THREE.MeshLambertMaterial( { color: atomColors[i] } );
    var geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position = v;
    scene.add(mesh);

    // bond
    if(i > 0) {
      var material1 = new THREE.MeshLambertMaterial( { color: atomColors[0] } );
      var material2 = new THREE.MeshLambertMaterial( { color: atomColors[i] } );

      var vHalf = vertexes[0].clone().lerp(vertexes[i], 0.5);
      scene.add(cylinderBetweenPoints(vertexes[0], vHalf, 8, material1));
      scene.add(cylinderBetweenPoints(vHalf, vertexes[i], 8, material2));
    }
  });

}

// returns a cylinder mesh
function cylinderBetweenPoints(point1, point2, radius, material) {
  var direction = new THREE.Vector3().subVectors(point2, point1);
  var arrow = new THREE.ArrowHelper(direction.clone().normalize(), point1);

  var rotation = new THREE.Vector3().setEulerFromQuaternion(arrow.quaternion);

  var edgeGeometry = new THREE.CylinderGeometry( radius, radius, direction.length(), 10, 4 );

  var edge = new THREE.Mesh(edgeGeometry, material);
  edge.rotation = rotation.clone();
  edge.position = new THREE.Vector3().addVectors(point1, direction.multiplyScalar(0.5));

  return edge;
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
