import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

// Define the path to your JSON file
const jsonFilePath = 'cbm2_labeled.json';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Create a grid of spheres
const gridSize = 200;
const sphereRadius = 0.02;
const spacingFactor = sphereRadius * 4; // Adjust the spacing as needed
const spheres = [];


// Fetch the JSON file
fetch(jsonFilePath)
  .then(response => response.json())
  .then(data => {
    // Loop through each object in the JSON data
    data.forEach(item => {
      // You can access properties of each object here
      // For example: item.propertyName
      console.log(item.x_spatial);
      let modifierx = 1.2;
      let modifiery = 1;
      let modifierz = 1;
      const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 1, 1);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: item.color });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  
      sphere.position.x = item.x_spatial_norm*modifierx*-1;
      sphere.position.y = item.y_spatial_norm*modifiery*-1;

      // sphere.position.x = item.x_umap_norm*modifierx*-1;
      // sphere.position.y = item.y_umap_norm*modifiery*-1;

      // sphere.position.x = item.x_umap2_norm*modifierx*-1;
      // sphere.position.y = item.y_umap2_norm*modifiery*-1;
      // sphere.position.z = item.z_umap2_norm*modifierz*-1;
  
      spheres.push(sphere);
      scene.add(sphere);
    });
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
  });

let stats = new Stats();
document.body.appendChild( stats.dom );

// Calculate the center point of the grid of spheres
const centerX = 0;
const centerY = 0;

// Set camera initial position and target
camera.position.set(centerX, centerY, 10); // Place the camera at the center of the grid
camera.lookAt(centerX, centerY, 0); // Make the camera look at the center

// Create OrbitControls for camera movement with the target at the center
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(centerX, centerY, 0); // Set the orbiting target at the center

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update()
}

animate();
