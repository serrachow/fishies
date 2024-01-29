import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

import Stats from 'three/addons/libs/stats.module.js';
import { ValueError } from 'zarr';

const jsonFilePath = '4_week_full_labeled_celltype2.json';
// const jsonFilePath = 'cbm2_labeled.json';

const scene = new THREE.Scene();

// Use an orthographic camera for 2D rendering
const camera = new THREE.OrthographicCamera(window.innerWidth / -4, window.innerWidth / 4, window.innerHeight / 4, window.innerHeight / -4, 1, 1000);
camera.position.set(0, 0, 1000);



const renderer = new THREE.WebGLRenderer();

const container = document.getElementById('container');
container.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instance properties
const circleRadius = 1; // Adjust as needed

let jsonData = [];

const lodLevels = [
  new THREE.CircleGeometry(circleRadius, 32), // High detail
  new THREE.CircleGeometry(circleRadius, 16), // Medium detail
  new THREE.CircleGeometry(circleRadius, 8),  // Lower detail
];

let currentDetailLevel = 0;
let instancedMesh;

// fetch(jsonFilePath)
//   .then(response => response.json())
//   .then(data => {
//     jsonData = data;
//     updateInstancedMesh();

//     // get unique cell types and colors
//     let cellTypeColorMap = new Map();

//     jsonData.forEach(item => {
//         // Check if the celltype is already added to the map
//         if (!cellTypeColorMap.has(item.celltype)) {
//             cellTypeColorMap.set(item.celltype, item.color);
//         }
//     });

//     let uniqueCellTypesWithColors = Array.from(cellTypeColorMap, ([celltype, color]) => [celltype, color]);
//     createCheckboxes(uniqueCellTypesWithColors);

//   })
//   .catch(error => console.error('Error fetching JSON data:', error));

// Asynchronous function to fetch data for a given column
async function fetchDataFromAPI(columnName) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/getdata?col=${columnName}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data for', columnName, error);
  }
}

// Columns to be fetched
const columns = ['x_umap_norm', 'y_umap_norm', 'x_spatial_norm', 'y_spatial_norm','y_umap_norm', 'celltype', 'color'];

// Fetch all data and combine
Promise.all(columns.map(fetchDataFromAPI)).then(results => {
  // Combine data from all columns into one object
  let transformedData = {};

  columns.forEach((col, index) => {
    let myString = results[index]["data"];
    myString = myString.replace(/'/g, '"'); // Replace single quotes with double quotes
    transformedData[col] = JSON.parse(myString);
  });
  console.log("trfdata")
  console.log(transformedData)


  for (let i = 0; i < transformedData.celltype.length; i++) {
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
      if (!cellTypeColorMap.has(item.celltype)) {
          cellTypeColorMap.set(item.celltype, item.color);
      }
  });

  let uniqueCellTypesWithColors = Array.from(cellTypeColorMap, ([celltype, color]) => [celltype, color]);
  createCheckboxes(uniqueCellTypesWithColors);
}).catch(error => {
  console.error('Error combining data:', error);
});



let stats = new Stats();
document.body.appendChild(stats.dom);


// OrbitControls might not be necessary for 2D, but keeping it for now
// const controls = new OrbitControls(camera, renderer.domElement);

const controls = new TrackballControls(camera, renderer.domElement);

// Set mouse buttons for controls
controls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.ZOOM,
  RIGHT: THREE.MOUSE.ROTATE
};

controls.rotateSpeed = 0; // Disable rotation
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false; // Enable panning with left mouse button now
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

function animate() {
  requestAnimationFrame(animate);
  // updateLOD();
  controls.update(); // Update the controls

  // Update camera lookAt position based on its current position
  camera.lookAt(camera.position);

  renderer.render(scene, camera);
  stats.update();
}

// function updateLOD() {
//   if (!jsonData) return;

//   const distance = camera.position.z;
//   let detailLevel;

//   // Adjust LOD based on camera distance (Z-axis in this case)
//   if (distance < 5) {
//     detailLevel = 1;
//   } else if (distance < 10) {
//     detailLevel = 2;
//   } else {
//     detailLevel = 3;
//   }

//   if (detailLevel !== currentDetailLevel) {
//     updateInstancedMesh();
//     currentDetailLevel = detailLevel;
//   }
// }

// Event listener for the button
// document.getElementById('toggleDGNeurons').addEventListener('click', function() {
//   updateInstancedMesh("Dentate gyrus neurons");
// });

// document.getElementById('toggleAll').addEventListener('click', function() {
//   updateInstancedMesh();
// });

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


const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
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

async function updateInstancedMesh(filterType = []) {

  // Clear existing mesh
  if (instancedMesh) {
    instancedMesh.geometry.dispose();
    instancedMesh.material.dispose();
    scene.remove(instancedMesh);
  }

  const geometry = lodLevels[0];
  const material = new THREE.MeshBasicMaterial();
  console.log("here");
  console.log(jsonData);
  instancedMesh = new THREE.InstancedMesh(geometry, material, jsonData.length*2);
  console.log(filterType)

  // Update instances
  const dummy1 = new THREE.Object3D();
  const dummy2 = new THREE.Object3D();


  // when plotting gene
  let cts;
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

  jsonData.forEach((item, index) => {
      let color;
      // plotting gene
      if (typeof filterType === 'string') {
        // console.log("here")
        // Calculate the 99th percentile as nmax
        // console.log(nmax)

        // Normalize cts, ensuring values are between 0 and 1
        // const ncts = cts.map(val => Math.min(Math.max(val / nmax, 0), 1));
        // console.log(norm)
        let colorrgb = coolwarm(ctsClipped[index]);
        console.log(colorrgb);
        // console.log(colorrgb)
        color = new THREE.Color(colorrgb);

        let scale = ctsClipped[index]*3+1;

        dummy1.scale.set(scale, scale, 1);
        dummy2.scale.set(scale, scale, 1);

      } else { // plotting celltypes, filterType is list of strings
        if (filterType.includes(item.celltype) || filterType.length == 0) {
          color = new THREE.Color(item.color);
          dummy1.scale.set(2, 2, 1);
          dummy2.scale.set(2, 2, 1);
        } else {
          color = new THREE.Color('#5e5e5e');
          dummy1.scale.set(1, 1, 1);
          dummy2.scale.set(1, 1, 1);
        }
      }
      
      // Position for the first dot
      // dummy1.position.x = item.y_spatial_norm * 20 * 5;
      // dummy1.position.y = item.x_spatial_norm * 10 * 5;

      dummy1.position.x = item.x_spatial_norm * -15 * 5;
      dummy1.position.y = item.y_spatial_norm * -10 * 5;
      dummy1.updateMatrix();
      instancedMesh.setMatrixAt(index * 2, dummy1.matrix); // Use index * 2 for even indices
      
      instancedMesh.setColorAt(index * 2, color);

      // Position for the second dot
      let offsett = 2000;
      dummy2.position.x = item.x_umap_norm * 10 * 10 + offsett;
      dummy2.position.y = item.y_umap_norm * 10 * 10 ;
      dummy2.updateMatrix();
      instancedMesh.setMatrixAt(index * 2 + 1, dummy2.matrix); // Use index * 2 + 1 for odd indices
      instancedMesh.setColorAt(index * 2 + 1, color);
  });

  // Update the mesh
  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.instanceColor.needsUpdate = true;
  scene.add(instancedMesh);
}




animate();
