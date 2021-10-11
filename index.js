import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = '200px';
stats.dom.style.position = 'fixed';
document.body.appendChild( stats.dom );

var graphs = [
    {
        formulaValue: 'Math.sin((x+t)*Math.PI)',
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


var clock = new THREE.Clock();


camera.position.z = 16;
camera.position.y = 16;



//Create an render loop to allow animation
var render = function () {
    stats.begin();

    requestAnimationFrame( render );

    var t = clock.getElapsedTime();

    for (let graph of graphs){
        renderGraph(graph, t);
    }

    controls.update();
    renderer.render(scene, camera);
    stats.end();
};

render();
initializeGraphs();



function renderGraph(graph,t){

    let f = (x,y,t) => eval(graph.formulaValue);
    const x_min = -4;
    const x_max = 4;
    const resolution = 0.1;
    const width = Math.abs(x_min) + Math.abs(x_max);
    const segments = width / resolution;

    if (graph.mesh == null){
        let plane = new THREE.PlaneGeometry(8, 8, segments, segments);
        graph.mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({color: graph.color, wireframe: graph.wireframe, side: THREE.DoubleSide}));
        graph.mesh.rotation.x = 3*Math.PI/2;
        scene.add(graph.mesh);
    }


    let i = 0;
    for (let y = x_min; y < x_max+resolution;y +=resolution){   

        for (let x = x_min; x < x_max+resolution; x+=resolution){
            const z = f(x, y, t);
            graph.mesh.geometry.vertices[i].z = z;
            i++;
        }
    }   
    graph.mesh.geometry.verticesNeedUpdate = true;
}



function initializeGraphs() {
    for (let graph of graphs) {
        editors.prepend(buildEditorElement(graph));
    }
}


function buildEditorElement(graph){
    let container = document.createElement('div');
    container.className = 'editor-row';
    let input = document.createElement('input');
    input.value = graph.formulaValue;

    input.addEventListener('change', () => {
        graph.formulaValue = input.value;
        renderGraph(graph)
    });

    container.appendChild(input);
    return container;
}