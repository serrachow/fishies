import * as THREE from 'three';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// First scene and orthographic camera
const scene1 = new THREE.Scene();
const camera1 = new THREE.OrthographicCamera(window.innerWidth / -4, window.innerWidth / 4, window.innerHeight / 4, window.innerHeight / -4, 1, 1000);
camera1.position.set(0, 0, 10);

// Second scene and orthographic camera
const scene2 = new THREE.Scene();
const camera2 = new THREE.OrthographicCamera(window.innerWidth / -4, window.innerWidth / 4, window.innerHeight / 4, window.innerHeight / -4, 1, 1000);
camera2.position.set(0, 0, 10);

// Dot properties
const dotGeometry = new THREE.CircleGeometry(1, 32); // Circle geometry for dots
const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Create 100 dots for each scene
for (let i = 0; i < 100; i++) {
    const dot1 = new THREE.Mesh(dotGeometry, dotMaterial);
    dot1.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, 0);
    scene1.add(dot1);

    const dot2 = new THREE.Mesh(dotGeometry, dotMaterial);
    dot2.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, 0);
    scene2.add(dot2);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Render first scene
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
    renderer.render(scene1, camera1);

    // Render second scene
    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    renderer.render(scene2, camera2);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight / 2;
    camera1.left = -aspect * 100;
    camera1.right = aspect * 100;
    camera1.top = 100;
    camera1.bottom = -100;
    camera1.updateProjectionMatrix();

    camera2.left = -aspect * 100;
    camera2.right = aspect * 100;
    camera2.top = 100;
    camera2.bottom = -100;
    camera2.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
