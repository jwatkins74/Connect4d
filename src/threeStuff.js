import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Scene, PerspectiveCamera, WebGLRenderer, Raycaster, Vector2 } from "three";


export default function setUp() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(2.5,10,2.5);
    camera.lookAt(3,0,3);
    const renderer = new WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
    });
    renderer.setClearColor(0xff00ff, .25);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function animate() {
        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(2.5, 0, 2.5);
    controls.update();

    const ray = new Raycaster();
    const mouse = new Vector2();
    return {scene, camera, renderer, ray, mouse};
    
}