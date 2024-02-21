import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    mountRef.current.appendChild(renderer.domElement);

    // will be all data here
    let jsonData = [];


    // Asynchronous function to fetch data for a given column
    async function fetchDataFromAPI(columnName) {
        try {
        // const response = await fetch(`http://127.0.0.1:8000/getdata?col=${columnName}`);
        const response = await fetch(`https://fisheyes.techkyra.com/getdata?col=${columnName}`);
        // console.log(response)
        const data = await response.json();
        return data;
        } catch (error) {
        console.error('Error fetching data for', columnName, error);
        }
    }

    // Columns to be fetched
    const columns = [
    'X_umap0_norm', 
    'X_umap1_norm', 
    'global_sphere0_norm', 
    'global_sphere1_norm',
    'global_sphere2_norm', 
    'global_sphere0', 
    'global_sphere1',
    'global_sphere2', 
    'clusters', 
    'clusters_colors'];

    let stats = new Stats();
    mountRef.current.appendChild(stats.dom);

    // Fetch all data and combine
    Promise.all(columns.map(fetchDataFromAPI)).then(results => {
    // Combine data from all columns into one object
    let transformedData = {};

    console.log(results);

    columns.forEach((col, index) => {
        let myString = results[index]["data"];
        myString = myString.replace(/'/g, '"'); // Replace single quotes with double quotes
        transformedData[col] = JSON.parse(myString);
    });
    console.log("trfdata")
    console.log(transformedData)


    for (let i = 0; i < transformedData.clusters.length; i++) {
        let row = {};
        for (let key in transformedData) {
            row[key] = transformedData[key][i];
        }
        jsonData.push(row);
    }

    console.log("jsondata")
    console.log(jsonData)

    updateInstancedMesh();

    // get unique cell types and colors
    let cellTypeColorMap = new Map();

    jsonData.forEach(item => {
        // Check if the celltype is already added to the map
        if (!cellTypeColorMap.has(item.clusters)) {
            cellTypeColorMap.set(item.clusters, item.clusters_colors);
        }
    });

    let uniqueCellTypesWithColors = Array.from(cellTypeColorMap, ([celltype, color]) => [celltype, color]);
    createCheckboxes(uniqueCellTypesWithColors);
    }).catch(error => {
    console.error('Error combining data:', error);
    });

    // Toggle the checkbox container visibility
    document.getElementById('toggleCheckboxContainer').addEventListener('click', () => {
        const checkboxContainer = document.getElementById('checkboxContainer');
        checkboxContainer.style.display = checkboxContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Array to hold the currently checked cell types
    let checkedCellTypes = [];

    // Function to update instanced mesh based on checked items
    function updateCheckedItems(celltype, isChecked) {
        if (isChecked) {
            // Add celltype to the list if checked
            checkedCellTypes.push(celltype);
        } else {
            // Remove celltype from the list if unchecked
            checkedCellTypes = checkedCellTypes.filter(item => item !== celltype);
        }
        updateInstancedMesh(checkedCellTypes);
    }


    // Function to create checkboxes
    function createCheckboxes(cellTypesWithColors) {
    const container = document.getElementById('checkboxContainer');

    // Sort cellTypesWithColors alphabetically by celltype
    cellTypesWithColors.sort((a, b) => {
        if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
        if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
        return 0;
    });

    cellTypesWithColors.forEach(([celltype, color]) => {
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = celltype;
        checkbox.value = celltype;

        // Create label
        const label = document.createElement('label');
        label.htmlFor = celltype;
        label.textContent = celltype;
        label.style.color = color;

        // Append checkbox and label to container
        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br'));

        // Attach event listener
        checkbox.addEventListener('change', (e) => {
            updateCheckedItems(celltype, e.target.checked);
        });
    });
    }


    // For a more accurate colormap, consider using a library or a more complex function.
    function coolwarm(value) {
    // Define start and end colors (cool: blue, warm: red)
    const startColor = { r: 0, g: 0, b: 255 }; // Blue
    const middleColor = { r: 255, g: 255, b: 255 }; // White
    const endColor = { r: 255, g: 0, b: 0 }; // Red

    if (value <0.5) { // blue to white
        return "rgb(" + Math.floor(middleColor.r*value*2) + ", " + Math.floor(middleColor.g*value*2) + ", " + startColor.b + ")"
    } else if (value == 0.5) { // white
        return "rgb(" + middleColor.r + ", " + middleColor.g + ", " + middleColor.b + ")"
    } else { // white to red
        return "rgb(" + endColor.r + ", " + Math.floor(middleColor.g-(middleColor.g*(value-0.5)*2)) + ", " + Math.floor(middleColor.b-(middleColor.b*(value-0.5)*2)) + ")"
    }


    }

    // Add event listener to the button
    document.getElementById('myButton').addEventListener('click', () => {
    // Get the value from the textbox
    const textboxValue = document.getElementById('myTextbox').value;

    updateInstancedMesh(textboxValue);
    });

    function calculate99thPercentile(arr) {
    // Create a copy of the array and sort the copy
    const sortedArr = arr.slice().sort((a, b) => a - b);

    // Calculate the index for the 99th percentile
    const index = Math.floor(sortedArr.length * 0.99) - 1;

    // Return the value at the 99th percentile
    return sortedArr[index];
    }

    function normalizeArray(arr, nmax) {
    return arr.map(value => Math.min(value / nmax, 1));
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Adjust aspect ratios for each camera
    const cameraOneAspectRatio = (width * 0.75) / height;
    const cameraTwoAspectRatio = (width * 0.25) / height;


    const cameraOne = new THREE.PerspectiveCamera(75, cameraOneAspectRatio, 0.1, 1000);
    const cameraTwo = new THREE.PerspectiveCamera(75, cameraTwoAspectRatio, 0.1, 1000);
    // Two cameras
    // const aspectRatio = window.innerWidth / window.innerHeight;
    // const cameraOne = new THREE.PerspectiveCamera(75, aspectRatio / 2, 0.1, 1000);
    // const cameraTwo = new THREE.PerspectiveCamera(75, aspectRatio / 2, 0.1, 1000);



    // how far away the cameras are
    const offset = 1000;
    // Position the cameras
    cameraOne.position.x = 0;
    cameraOne.position.y = 50;
    cameraOne.position.z = 200; // how far away the camera is

    cameraTwo.position.x = offset;
    cameraTwo.position.z = 180;

    // Define a shared target position for both cameras to look at
    const sharedTarget = new THREE.Vector3(0, 0, 0); // Adjust as needed for your scene

    // Initialize OrbitControls with cameraOne
    let controls = new OrbitControls(cameraOne, renderer.domElement);
    controls.target.copy(sharedTarget); // Initially set target for cameraOne
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.update();

    function switchControls() {
        const isCameraOneActive = controls.object === cameraOne;
        controls.dispose(); // Dispose current controls

        if (isCameraOneActive) {
            // Switch to cameraTwo
            controls = new OrbitControls(cameraTwo, renderer.domElement);
            // Set specific properties for cameraTwo controls
            controls.enableRotate = false; // Disable rotation for cameraTwo
            controls.enableZoom = true; // Assuming you want zoom
            controls.target.copy(sharedTarget); // Ensure cameraTwo looks at the shared target
            controls.enablePan = true; // Enable panning
        } else {
            // Switch back to cameraOne
            controls = new OrbitControls(cameraOne, renderer.domElement);
            // Reset or set specific properties for cameraOne controls
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.target.copy(sharedTarget); // Ensure cameraOne looks at the shared target
        }

        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.update(); // Important to apply the changes made to controls
    }

    // Bind switchControls to a keyboard event (e.g., pressing 'c')
    document.addEventListener('keydown', (event) => {
        if (event.key === 'c') {
            switchControls();
        }
    });

    // Geometry and material for the instanced mesh

    let instancedMesh = new THREE.InstancedMesh(new THREE.CircleGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial(), 1);
    let instancedMeshUmap;

    async function updateInstancedMesh(filterType = []) {
    // Clear existing mesh
    if (instancedMesh) {
        instancedMesh.geometry.dispose();
        instancedMesh.material.dispose();
        scene.remove(instancedMesh);
    }

    if (instancedMeshUmap) {
        instancedMeshUmap.geometry.dispose();
        instancedMeshUmap.material.dispose();
        scene.remove(instancedMeshUmap);
    }

    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const count = 10;
    // const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereGeometry = new THREE.CircleGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial();
    const count = jsonData.length;
    // instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, count*2);
    instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, count);
    instancedMeshUmap = new THREE.InstancedMesh(sphereGeometry, material, count);

    // Position each instance
    const proj = new THREE.Object3D();
    const umap = new THREE.Object3D();

    let color;

    // when plotting gene (diff is just color and size)
    let cts; // stands for counts
    let ctsClipped;
    let nmax;
    if (typeof filterType === 'string') {
        // cts = jsonData.map(item => item[filterType]);
        try {
        let data = await fetchDataFromAPI(filterType);
        cts = JSON.parse(data["data"])
        // You can use cts here
        nmax = calculate99thPercentile(cts);
        console.log(nmax);
        console.log(cts);
        ctsClipped = normalizeArray(cts, nmax);
        console.log(ctsClipped);

        } catch (error) {
            // Handle errors if the promise is rejected
            console.error('Error fetching data:', error);
        }
    }

    let mod = 100;
    let umapmod = 0.5;

    // plotting function
    for (let i = 0; i < count; i++) {

        // plotting gene
        if (typeof filterType === 'string') {
        let colorrgb = coolwarm(ctsClipped[i]);
        console.log(colorrgb);
        color = new THREE.Color(colorrgb);

        let scale = ctsClipped[i]*5+1;

        proj.scale.set(scale, scale, scale);
        umap.scale.set(scale*umapmod, scale*umapmod, scale*umapmod);

        } else {
        // plotting cell type
        if (filterType.includes(jsonData[i]["clusters"]) || filterType.length == 0) {
            color = new THREE.Color(jsonData[i]["clusters_colors"]);
            proj.scale.set(5, 5, 5);
            umap.scale.set(5*umapmod, 5*umapmod, 5*umapmod);
        } else {
            color = new THREE.Color('#5e5e5e');
            proj.scale.set(1, 1, 1);
            umap.scale.set(1*umapmod, 1*umapmod, 1*umapmod);
        }
        }

        //plot projection
        // proj.position.set(jsonData[i]["global_sphere0_norm"], jsonData[i]["global_sphere1_norm"], jsonData[i]["global_sphere2_norm"]);
        proj.position.set(jsonData[i]["global_sphere0_norm"] * mod, jsonData[i]["global_sphere1_norm"] * mod, jsonData[i]["global_sphere2_norm"]*mod);
        proj.updateMatrix();
        instancedMesh.setMatrixAt(i, proj.matrix);
        instancedMesh.setColorAt(i, color);

        //plot umap
        umap.position.set(jsonData[i]["X_umap0_norm"]*5+offset, jsonData[i]["X_umap1_norm"]*5, 10);
        umap.updateMatrix();
        instancedMeshUmap.setMatrixAt(i, umap.matrix);
        instancedMeshUmap.setColorAt(i, color);
    }

    scene.add(instancedMesh);
    scene.add(instancedMeshUmap);
    }

    function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only needed if controls.enableDamping is true

    // Assume your instanced mesh is global or accessible within this scope
    const cameraQuaternion = cameraOne.quaternion;

    for (let i = 0; i < jsonData.length * 2; i++) {
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const scale = new THREE.Vector3();
        
        // Extract position and scale from the current instance matrix
        instancedMesh.getMatrixAt(i, matrix);
        matrix.decompose(position, new THREE.Quaternion(), scale);

        // Rebuild the matrix using the camera's quaternion for rotation
        matrix.compose(position, cameraQuaternion, scale);
        instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true; // Important!

    // Your rendering logic...
    renderer.setViewport(0, 0, width * 0.75, height);
    renderer.setScissor(0, 0, width * 0.75, height);
    renderer.setScissorTest(true);
    renderer.render(scene, cameraOne);

    renderer.setViewport(width * 0.75, 0, width * 0.25, height);
    renderer.setScissor(width * 0.75, 0, width * 0.25, height);
    renderer.setScissorTest(true);
    renderer.render(scene, cameraTwo);

    renderer.setScissorTest(false); // Disable scissor test after rendering

    stats.update();
    }

    animate();


    animate();


    // Clean up
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}

export default ThreeScene;