import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const stage = document.querySelector('.stage');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 1.2, 4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 2));
const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(3, 4, 4);
scene.add(keyLight);

const modelRoot = new THREE.Group();
scene.add(modelRoot);

function resize() {
  const { width, height } = stage.getBoundingClientRect();
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

new ResizeObserver(resize).observe(stage);
resize();

new GLTFLoader().load(
  './public/end_crystal.glb',
  (gltf) => {
    modelRoot.add(gltf.scene);
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    gltf.scene.position.sub(center);
    modelRoot.scale.setScalar(2.4 / Math.max(size.x, size.y, size.z));
    loading.hidden = true;
  },
  undefined,
  () => {
    loading.textContent = 'Unable to load the model.';
  },
);

function animate() {
  modelRoot.rotation.y += 0.006;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
