import * as THREE from "three";
import "./styles.css"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xff00ff, .25);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let placed = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];
let turn = 0;
function colorchoice(){
    if (turn) {
        return 0xffff33;
    }
    return 0xe62e00;
}
const grid = [];
for (let i = 0; i <5; i++) {
    let row = [];
    for (let j = 0; j < 5; j++) {
        let square1 = createSquare(.2, i, 0, j, false, 0xffffff);
        row.push(square1);
    }
    grid.push(row);
}
const box = [];
for (let i = 0; i <5; i++) {
    let row = [];

    for (let j = 0; j < 5; j++) {
        let cube1 = createSquare(6, i, 3.1, j, true, 0x99ff99);
        row.push(cube1);
        cube1.userData = "a";
    }
    box.push(row);
}
clear();
function animate() {
    renderer.render( scene, camera );
}
camera.position.set(2.5,10,2.5);
camera.lookAt(3,0,3);
renderer.setAnimationLoop( animate );
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(2.5, 0, 2.5);
controls.update();

//Ray cast
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onHover(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 -1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 +1;
    ray.setFromCamera(mouse, camera);
    const inter = ray.intersectObjects(grid.flat(), false);
    if (inter.length > 0) {
        clear();
        let x = Math.floor(inter[0].object.position.x);
        let z = Math.floor(inter[0].object.position.z);
        let item = box[x][z];
        //item.material.opacity = 1;
        if (item.children[0].material.opacity == 0) {
            item.material.opacity = .3;
            item.children[0].material.opacity = 1;
        }

    }
}

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 -1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 +1;
    ray.setFromCamera(mouse, camera);
    const inter = ray.intersectObjects(grid.flat(), false);
    if (inter.length > 0) {
        let x = Math.floor(inter[0].object.position.x);
        let z = Math.floor(inter[0].object.position.z);

        console.log(x);
        console.log(z);
        let item = box[x][z];
        let place = placed[x][z];
        createSquare(1, x, place + .6, z, false, colorchoice());
        placed[x][z]+=1;
        if (turn) {
            turn = 0;
        } else {
            turn = 1;
        }
        //item.material.opacity = 1;
        
    }
}
window.addEventListener("mousemove", onHover);
window.addEventListener("click", onClick);

function clear() {
    for (let row of box) {
            for (let square of row) {
                square.material.opacity = 0;
                square.children[0].material.opacity = 0;
        }
    }
}

function createSquare(height = 1, x, y, z, hide = false, color1) {
    let params;
    let params2;
    if (hide) {
        params = {color: color1, transparent:true, opacity: 0};
        params2 = {color: 0x000000, transparent:true, opacity: 0};
    } else {
        params = {color: color1, transparent:true, opacity: 1};
        params2 = {color: 0x000000, transparent:true, opacity: 1};
    }
    let geo = new THREE.BoxGeometry( 1, height, 1 );
    const mat = new THREE.MeshBasicMaterial( params );
    const cube = new THREE.Mesh( geo, mat );
    scene.add( cube );
    cube.position.set(x, y, z);
    const edge = new THREE.EdgesGeometry(geo);
    const mat2 = new THREE.LineBasicMaterial(params2);
    const line = new THREE.LineSegments(edge, mat2);
    line.scale.multiplyScalar(1.01);
    cube.add(line);
    if (hide) {

    }
    return cube;
}