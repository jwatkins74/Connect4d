import * as THREE from "three";
import "./styles.css"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xff00ff, .25);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let placed;
let spot;
let turn;
let grid;
let box;
let placedTiles;
start();
clear();

function animate() {
    renderer.render( scene, camera );
}
function start() {
    window.addEventListener("mousemove", onHover);
    window.addEventListener("click", onClick);
    placedTiles = []
    spot = [ 
        [ [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1]],
          [ [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1]],
          [ [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1]],
          [ [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1]],
          [ [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1],
          [-1,-1,-1,-1,-1]],
    ];
    turn = 0;
    grid = [];
    for (let i = 0; i <5; i++) {
        let row = [];
            for (let j = 0; j < 5; j++) {
                let square1 = createSquare(.2, i, 0, j, false, 0xffffff);
                row.push(square1);
        }
        grid.push(row);
    }
    box = [];
    for (let i = 0; i <5; i++) {
        let row = [];

        for (let j = 0; j < 5; j++) {
            let cube1 = createSquare(6, i, 3.1, j, true, 0x99ff99);
            row.push(cube1);
            cube1.userData = "a";
        }
        box.push(row);
    }
    placed = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
    ];
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
    clear();
    if (inter.length > 0) {
        let x = Math.floor(inter[0].object.position.x);
        let z = Math.floor(inter[0].object.position.z);
        let tower = box[x][z];
        let gridbox = grid[x][z];
        //item.material.opacity = 1;
        if (tower.children[0].material.opacity == 0) {
            tower.material.opacity = .3;
            tower.children[0].material.opacity = 1;
            gridbox.material.color.set(0x3377ff);
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
        let item = box[x][z];
        let place = placed[x][z];
        if (place < 5) {
            placedTiles.push(createSquare(1, x, place + .6, z, false, colorchoice()));
            spot[x][place][z] = turn;
            
            checkWin(x, place, z);
            placed[x][z]+=1;
            turn ^= 1;
        }
        
    }
}

function clear() {
    for (let row of box) {
            for (let square of row) {
                square.material.opacity = 0;
                square.children[0].material.opacity = 0;
        }
    }
    for (let row of grid) {
            for (let square of row) {
                square.material.color.set(0xffffff);
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
    line.scale.multiplyScalar(1.001);
    cube.add(line);
    return cube;
}
function checkWin(x,y,z) {
    let color = spot[x][y][z];
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
                if (i ==0 && j ==0 && k ==0) {
                    continue;
                } 
                checkPath(x,y,z, i,j,k, color)
            }
        }
    }

}
function checkPath(x,y,z, dx,dy,dz, color) {
    let count = 1;
    let tempx = x -dx;
    let tempy = y-dy;
    let tempz=z-dz;
    let arr = [];
    arr.push([x,y,z]);
    while (tempx < 5 && tempx > -1 && tempy < 5 && tempy > -1 && tempz < 5 && tempz > -1) {
        if (spot[tempx][tempy][tempz] == color) {
            count +=1;
            arr.push([tempx,tempy,tempz]);
        } else {
            break;
        }
        tempx -= dx;
        tempy -= dy;
        tempz -= dz;
    }

    tempx = x +dx;
    tempy = y+dy;
    tempz=z+dz;
    while (tempx < 5 && tempx > -1 && tempy < 5 && tempy > -1 && tempz < 5 && tempz > -1) {
        if (spot[tempx][tempy][tempz] == color) {
            count +=1;
            arr.push([tempx,tempy,tempz]);
        } else {
            break;
        }
        tempx += dx;
        tempy += dy;
        tempz += dz;
    }
    if (count >= 4) {
        setTimeout( () => {win(arr)}, 50);
    }

}

function colorchoice(){
    if (turn) {
        return 0xffff33;
    }
    return 0xe62e00;
}

function deleteAll() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}
function win(arr) {
    clear();
    winSquares(arr);
    window.removeEventListener("click", onClick);
    window.removeEventListener("mousemove", onHover);

     let winner1 = turn ^ 1;
    const winner = document.getElementById("winner");
    const winnertext = document.getElementById("text");
    winnertext.innerText = "Player " + (winner1 +1) + " Wins "
    const restart= document.getElementById("restart");

    winner.style.display = "block";
    restart.style.display = "block";

    restart.addEventListener("click", () => {
        winner.style.display = "none";
        restart.style.display = "none";
        deleteAll();
        start();
        clear();

    })
}
function winSquares(arr) {
    for (const square of placedTiles) {
        let flag = false;
        for (const winpos of arr) {
            if (square.position.x == winpos[0] && square.position.y -0.6 == winpos[1] && square.position.z == winpos[2] ) {
                flag = true;
            }
        }
        if (!flag) {
            scene.remove(square);
        }
    }
}