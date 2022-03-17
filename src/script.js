import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'



/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const disc = textureLoader.load('./textures/disc.png')
const alpha = textureLoader.load('./textures/alphaspark1.png')
const star = textureLoader.load('./textures/star.svg')
const star1 = textureLoader.load('./textures/star1.png')
const snow1 = textureLoader.load('./textures/snowflake4.png')
const snow2 = textureLoader.load('./textures/snowflake5.png')


/**
 * Object
 */

const geometry = new THREE.TorusGeometry(10, 3, 50, 200)

const particles = new THREE.BufferGeometry;
const particlesCnt = 6000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
    //posArray[i] = Math.random()
    //posArray[i] = Math.random() - 0.5
    posArray[i] = (Math.random() - 0.5) * 100
    
}

particles.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3))
//const geometry = new THREE.OctahedronGeometry(20, 1)

const material = new THREE.PointsMaterial({
    size: 0.09
})

const particleMaterial = new THREE.PointsMaterial({ 
    size: 0.1,
    map: star1,
   //alphaMap: alpha,
    //alphaTest: 0.01,
    depthTest: false,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending  
})



const torus = new THREE.Points(geometry, material)
const particleMesh = new THREE.Points(particles, particleMaterial)
scene.add(torus, particleMesh)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Half size windows
let windowHalfX = sizes.width / 2
let windowHalfY = sizes.height/ 2

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update half sizes
    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2


    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 1000)
//camera.position.x = 1
//camera.position.y = 1
camera.position.z = 45
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1)


//Mouse

document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event) {
    if (event.isPrimary === false ) return;

    mouseX = event.clientX 
    mouseY = event.clientY 
}
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Object
    // torus.rotation.x = elapsedTime * 0.5
    // torus.rotation.y = elapsedTime * 0.15
    // torus.rotation.z = elapsedTime * 0.25

    //Update star

    if( mouseX > 0) {
        torus.rotation.x = - ((mouseY - windowHalfY) * 0.2) * (elapsedTime * 0.0009)
        torus.rotation.y = ((mouseX - windowHalfX) * 0.2) * (elapsedTime * 0.0009)
    }
    
    //Camera

    if (mouseX > 0 ) {
    camera.position.x += ((mouseX - windowHalfX) - camera.position.x)* 0.00005
    camera.position.y += (- (mouseY - windowHalfY) - camera.position.y) * 0.00005
    }
 
    camera.lookAt(scene.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()