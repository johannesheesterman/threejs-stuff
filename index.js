import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


var graphs = [
    {
        formulaValue: 'Math.sin(x*Math.PI)',
        color: 0x00ffff,
        wireframe: true
    },
];

var addGraphBtn = document.getElementById('add-graph-btn');
addGraphBtn.addEventListener('click', () => {
    let newGraph = {
        formulaValue: 'x**2',
        color: 0xff0000,
        wireframe: true
    };
    graphs.push(newGraph);
    editors.appendChild(buildEditorElement(newGraph));
    renderGraph(newGraph);
});

var graphContainer = document.getElementById('graph');

var scene = new THREE.Scene();  
var camera = new THREE.PerspectiveCamera( 75, graphContainer.clientWidth/graphContainer.clientHeight, 0.1, 1000 ); 

var renderer = new THREE.WebGLRenderer(); 
renderer.setSize( graphContainer.clientWidth, graphContainer.clientHeight ); 
graphContainer.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement )
controls.update();
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
var mesh = null;



camera.position.z = 16;
camera.position.y = 16;



//Create an render loop to allow animation
var render = function () {
    requestAnimationFrame( render );

    controls.update();
    renderer.render(scene, camera);
};

render();
initializeGraphs();



function renderGraph(graph){

    if (graph.mesh != null){
        scene.remove(graph.mesh);
    }

    let f = (x,y) => eval(graph.formulaValue);

    const x_min = -4;
    const x_max = 4;
    const resolution = 0.1;
    const width = Math.abs(x_min) + Math.abs(x_max);
    const segments = width / resolution;

    let plane = new THREE.PlaneGeometry(8, 8, segments, segments);

    let i = 0;
    for (let y = x_min; y < x_max+resolution;y +=resolution){   

        for (let x = x_min; x < x_max+resolution; x+=resolution){
            const z = f(x, y);
            plane.vertices[i].z = z;
            i++;
        }
    }

  

    graph.mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({color: graph.color, wireframe: graph.wireframe, side: THREE.DoubleSide}));
    graph.mesh.rotation.x = 3*Math.PI/2;
    scene.add(graph.mesh);
}



function initializeGraphs() {
    for (let graph of graphs){
        
        editors.prepend(buildEditorElement(graph));
        renderGraph(graph);
    }
}


function buildEditorElement(graph){
    let container = document.createElement('div');
    container.className = 'editor-row';
    let input = document.createElement('input');
    input.value = graph.formulaValue;

    input.addEventListener('change', () => {
        console.log('change');
        graph.formulaValue = input.value;
        renderGraph(graph)
    });

    container.appendChild(input);
    return container;
}