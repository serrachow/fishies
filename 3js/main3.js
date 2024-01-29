import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

// const jsonFilePath = 'cbm2_labeled.json';
const jsonFilePath = '4_week_full_labeled_celltype.json';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Changed to body for simplicity

// Instance properties
const instanceCount =60000; // Adjust according to your JSON data
const sphereRadius = 0.015;
const sphereMaterial = new THREE.MeshBasicMaterial(); // Using a basic material for debugging
let jsonData = null; // Store the JSON data globally


const lodLevels = [
  // new THREE.SphereGeometry(sphereRadius, 32, 32), // High detail
  new THREE.SphereGeometry(sphereRadius, 16, 16), // High detail
  new THREE.SphereGeometry(sphereRadius, 8, 8), // Medium detail
  new THREE.SphereGeometry(sphereRadius, 4, 4),    // Low detail
  new THREE.SphereGeometry(sphereRadius, 1, 1)    // Low detail
];

let currentDetailLevel = 0;
let instancedMesh;

fetch(jsonFilePath)
  .then(response => response.json())
  .then(data => {
    console.log("Data loaded", data);
    jsonData = data; // Store the data for later use
    updateInsta
    ncedMesh(); // Initial setup with the loaded data
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
  });

let stats = new Stats();
document.body.appendChild(stats.dom);

camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  updateLOD(); // Update LOD based on camera distance
  renderer.render(scene, camera);
  stats.update();
}


function updateLOD() {
  if (!jsonData) return; // Don't update if data isn't loaded yet

  const distance = camera.position.length();
  let detailLevel;

  if (distance < 3) {
    detailLevel = 0;
  } else if (distance < 5) {
    detailLevel = 1;
  }  else if (distance < 10) {
    detailLevel = 2;
  } else {
    detailLevel = 3;
  }

  if (detailLevel !== currentDetailLevel) {
    updateInstancedMesh();
    currentDetailLevel = detailLevel;
  }
}

function updateInstancedMesh() {
  if (instancedMesh) scene.remove(instancedMesh);

  const detailLevel = currentDetailLevel >= 0 ? currentDetailLevel : 0; // Default to highest detail
  const geometry = lodLevels[detailLevel];
  instancedMesh = new THREE.InstancedMesh(geometry, sphereMaterial, jsonData.length);

  const dummy = new THREE.Object3D();
  jsonData.forEach((item, index) => {
    // Update positions based on your logic (e.g., item.x_spatial_norm)
    // dummy.position.x = item.x_spatial_norm * -1.2;
    // dummy.position.y = item.y_spatial_norm * -1;

    // dummy.position.x = item.y_spatial_norm * 1.5;
    // dummy.position.y = item.x_spatial_norm * 0.8;


    // dummy.position.y = item.y_umap2_norm * -1;
    // dummy.position.z = item.z_umap2_norm * -1;
    // dummy.position.x = item.x_umap2_norm * -1;

    dummy.position.y = item.y_umap_norm * -1;
    dummy.position.z = item.z_umap_norm * -1;
    dummy.position.x = item.x_umap_norm * -1;

    dummy.updateMatrix();

    instancedMesh.setMatrixAt(index, dummy.matrix);
    const color = new THREE.Color(item.color || 'white');
    instancedMesh.setColorAt(index, color);
  });

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.instanceColor.needsUpdate = true;
  scene.add(instancedMesh);
}

animate();
