/*
 * Copyright (c) 2024FengTaiSEC Corporation.
 * @Description:
 * @Author: 刘宇薇<liuyuwei@fengtaisec.com>
 * @Date: 2024-07-15 18:57:09
 * @LastEditTime: 2024-12-05 10:47:30
 * @LastEditors: 刘宇薇<liuyuwei@fengtaisec.com>
 * @FilePath: \exercise\asset\script.js
 * @AmendmentRecord:
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const textureLoader = new THREE.TextureLoader()
const particles = textureLoader.load('./static/textures/particles/2.png')
// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// // 灯
// // Ambient light
// const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
// scene.add(ambientLight)

// // Directional light
// const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.26)
// moonLight.position.set(4, 5, -2)
// scene.add(moonLight)

const sphereGeometry = new THREE.BufferGeometry()
const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}
sphereGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
sphereGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const sphereMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  alphaMap: particles,
  transparent: true,
  color: '#ff88cc',
  // alphaTest: 0.01,
  // depthTest: false, //关闭层级检测，如果有其他元素存在将不合理
  depthWrite: false, //绘制的时候不放在层级检测缓冲区里面，不会影响其他元素
  vertexColors: true,
})

const sphere = new THREE.Points(sphereGeometry, sphereMaterial)
scene.add(sphere)
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
  for (let i = 0; i < count; i++) {
    let i3 = i * 3
    let x = sphere.geometry.attributes.position.array[i3]
    sphere.geometry.attributes.position.array[i3 + 1] = Math.sin(
      x + elapsedTime
    )
  }
  // sphere.rotation.y = elapsedTime * 0.02
  sphere.geometry.attributes.position.needsUpdate = true
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
