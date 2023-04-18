import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "lil-gui";
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const group = new THREE.Group();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// load matcap textures from 1 to 8 png
const matcapTextures = Array.from({ length: 8 }, (_, i) => {
  return textureLoader.load(`/textures/matcaps/${i + 1}.png`);
});

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 2,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  //   same thing as above
  textGeometry.center();

  const materials = Array.from({ length: 8 }, () => {
    return new THREE.MeshMatcapMaterial();
  }).map((material, idx) => {
    material.matcap = matcapTextures[idx];
    return material;
  });

  //   textMaterial.wireframe = true;

  const text = new THREE.Mesh(textGeometry, materials[materials.length - 1]);

  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const sphereGeomtry = new THREE.SphereGeometry(0.5, 32, 32);

  const geometries = [donutGeometry, sphereGeomtry];

  for (let i = 0; i < 8000; i++) {
    const material = materials[Math.floor(Math.random() * materials.length)];
    const geometry = new THREE.Mesh(
      geometries[Math.floor(Math.random() * geometries.length)],
      material
    );

    geometry.position.x = (Math.random() - 0.5) * 100;
    geometry.position.y = (Math.random() - 0.5) * 100;
    geometry.position.z = (Math.random() - 0.5) * 100;

    geometry.rotation.x = Math.random() * Math.PI;
    geometry.rotation.y = Math.random() * Math.PI;

    const scale = (Math.random() + 0.5) * 0.5;
    geometry.scale.set(scale, scale, scale);

    group.add(geometry);
  }
});

scene.add(group);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  camera.position.x += Math.sin(elapsedTime) * 0.25;
  camera.position.z += Math.sin(elapsedTime) * 0.25;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
