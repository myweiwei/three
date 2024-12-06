/*
 * Copyright (c) 2024FengTaiSEC Corporation.
 * @Description:
 * @Author: 刘宇薇<liuyuwei@fengtaisec.com>
 * @Date: 2024-07-15 18:57:09
 * @LastEditTime: 2024-12-05 17:25:36
 * @LastEditors: 刘宇薇<liuyuwei@fengtaisec.com>
 * @FilePath: \exercise\asset\script.js
 * @AmendmentRecord:
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
const gui = new GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const parameters = {
  count: 100000,
  size: 0.01,
  branches: 3,
  radius: 5,
  spin: 1,
  randomNess: 0.2,
  randomNessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
}

let geometry = null
let points = null
let material = null
const positions = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)
const generateGalaxy = () => {
  if (points) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }
  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)
  for (let i = 0; i < parameters.count; i++) {
    let i3 = i * 3
    const radius = Math.random() * parameters.radius
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
    let branchAngle =
      ((i % parameters.branches) / parameters.branches).toFixed(2) * Math.PI * 2
    const spinAngle = radius * parameters.spin
    const randomX =
      Math.pow(Math.random(), parameters.randomNessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      (Math.random() - 0.5) *
      parameters.randomNess
    const randomY =
      Math.pow(Math.random(), parameters.randomNessPower) *
      (Math.random() < 0.5 ? 1 : -1)
    const randomZ =
      Math.pow(Math.random(), parameters.randomNessPower) *
      (Math.random() < 0.5 ? 1 : -1)
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
  }
  geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  material = new THREE.PointsMaterial({
    color: '#ff5588',
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  points = new THREE.Points(geometry, material)
  scene.add(points)
}
generateGalaxy()
gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomNess')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomNessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setClearColor('#000')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  controls.update()
  // points.rotation.x = Math.sin(elapsedTime * 0.2)
  points.rotateY(Math.PI * 0.001)
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
