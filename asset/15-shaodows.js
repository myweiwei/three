import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Canvas
const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../static/simpleShadow.jpg');

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);

const cube = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
cube.castShadow = true;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
// plane.receiveShadow = true;
const plane1 = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: texture,
  })
);
plane1.rotation.x = -Math.PI * 0.5;
plane1.position.y = plane.position.y + 0.01;
scene.add(cube, plane1, plane);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  cube.position.x = Math.cos(elapsedTime) * 1.5;
  cube.position.z = Math.sin(elapsedTime) * 1.5;
  cube.position.y = Math.abs(Math.sin(elapsedTime * 3));
  plane1.position.x = cube.position.x;
  plane1.position.z = cube.position.z;
  plane1.material.opacity = (1 - Math.abs(cube.position.y)) * 0.3;

  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
