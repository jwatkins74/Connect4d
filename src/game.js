import * as THREE from "three";
import "./styles.css"
import setUp from "./threeStuff";


export default function game(){
    //Variables
let {scene,camera, renderer, ray, mouse} = setUp();
let placed;
let spot;
let turn;
let grid;
let hoverBoxes;
let placedTiles;
let winningSquares;
start();
clear();


function start() {
    window.addEventListener("mousemove", onHover);
    window.addEventListener("click", onClick);
    window.addEventListener("touchend", onTouch, {passive: false});
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
    hoverBoxes = [];
    for (let i = 0; i <5; i++) {
        let row = [];

        for (let j = 0; j < 5; j++) {
            let cube1 = createSquare(6, i, 3.1, j, true, 0x99ff99, true);
            row.push(cube1);
            cube1.userData = "a";
        }
        hoverBoxes.push(row);
    }
    placed = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
    ];
}

//Interactions
function onHover(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 -1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 +1;
    ray.setFromCamera(mouse, camera);
    const inter = ray.intersectObjects(grid.flat(), false);
    clear();
    if (inter.length > 0) {
        let x = Math.floor(inter[0].object.position.x);
        let z = Math.floor(inter[0].object.position.z);
        let tower = hoverBoxes[x][z];
        let gridbox = grid[x][z];
        //item.material.opacity = 1;
        if (tower.children[0].material.opacity == 0) {
            tower.visible = true;
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
        let item = hoverBoxes[x][z];
        let place = placed[x][z];
        if (place < 5) {
            placedTiles.push(createSquare(1, x, place + .6, z, false, colorchoiceWin()));
            spot[x][place][z] = turn;
            placed[x][z]+=1;
            if (checkWin(x, place, z)) {
                setTimeout( () => {win(winningSquares)}, 50);
            } else {
                turn ^= 1;
            }
        }
        
    }
}
function onTouch(event) {
    event.preventDefault();
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 -1;
    mouse.y = -(event.changedTouches[0].clientY  / window.innerHeight) * 2 +1;
    ray.setFromCamera(mouse, camera);
    const inter = ray.intersectObjects(grid.flat(), false);
    if (inter.length > 0) {
        let x = Math.floor(inter[0].object.position.x);
        let z = Math.floor(inter[0].object.position.z);
        let item = hoverBoxes[x][z];
        let place = placed[x][z];
        if (place < 5) {
            placedTiles.push(createSquare(1, x, place + .6, z, false, colorchoiceWin()));
            spot[x][place][z] = turn;
            
            checkWin(x, place, z);
            placed[x][z]+=1;
            turn ^= 1;
        }
        
    }
}
function createSquare(height = 1, x, y, z, hide = false, color1, box = false) {
    let params;
    let params2;
    if (hide) {
        params = {color: color1, transparent:true, opacity: 0};
        params2 = {color: 0x000000, transparent:true, opacity: 0};
    } else {
        params = {color: color1, transparent:true, opacity: 1};
        params2 = {color: 0x000000, transparent:true, opacity: 1};
    }
    let geo;
    if (!box) {
        geo = new THREE.BoxGeometry( 1, height, 1 );
    } else {
        geo = new THREE.BoxGeometry( .1, 10, .1 );
    }
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


//Color of placed squares
function colorchoiceWin(){
    if (turn) {
        return  "#E3B505" ;
    }
    return "#DE3C4B";
} 

//Check if game is over
function checkWin(x,y,z) {
    let color = spot[x][y][z];
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
                if (i ==0 && j ==0 && k ==0) {
                    continue;
                } 
                if (checkPath(x,y,z, i,j,k, color)) {
                    return true;
                }
            }
        }
    }
    return false;

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
        winningSquares = arr;
        return true;
    }
    return false;
}
function win(arr) {
    clear();
    winSquares(arr);
    window.removeEventListener("click", onClick);
    window.removeEventListener("mousemove", onHover);
    window.removeEventListener("touchend", onTouch);

    const winner = document.getElementById("winner");
    winner.style.backgroundColor = colorchoiceWin();
    const winnertext = document.getElementById("text");
    winnertext.innerText = "Player " + (turn +1) + " Wins "
    const restart= document.getElementById("restart");
    const home = document.getElementById("homebutton");
    home.style.display = "block";
    winner.style.display = "block";
    restart.style.display = "block";

    restart.addEventListener("click", () => {
        winner.style.display = "none";
        restart.style.display = "none";
        deletePlacedSquares();
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

//Clearing Functions
function deletePlacedSquares() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

function clear() {
    for (let row of hoverBoxes) {
            for (let square of row) {
                square.visible = false;
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
};