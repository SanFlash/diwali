import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Lantern = { group: THREE.Group; speed: number; phase: number; radius: number; baseY: number }

export default function FestivalUniverse() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = host.current
    if (!root) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      root.classList.add('universe-fallback')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(root.clientWidth, root.clientHeight)
    renderer.setClearColor(0x000000, 0)
    root.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, root.clientWidth / Math.max(root.clientHeight, 1), .1, 100)
    camera.position.set(0, 0, 17)
    scene.add(new THREE.AmbientLight(0xffffff, 1.5))
    const goldLight = new THREE.PointLight(0xffb85c, 18, 22)
    goldLight.position.set(4, 2, 5)
    scene.add(goldLight)
    const blueLight = new THREE.PointLight(0x668bff, 9, 20)
    blueLight.position.set(-5, -2, 3)
    scene.add(blueLight)

    const world = new THREE.Group()
    world.position.set(3.8, -.1, -1.5)
    scene.add(world)
    const gold = new THREE.MeshBasicMaterial({ color: 0xe7bd78, transparent: true, opacity: .48, wireframe: true })
    const softGold = new THREE.MeshBasicMaterial({ color: 0xf4c77d, transparent: true, opacity: .25 })
    const violet = new THREE.MeshBasicMaterial({ color: 0x9a8bdf, transparent: true, opacity: .25, wireframe: true })

    const mandala = new THREE.Group()
    world.add(mandala)
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1 + i * .34, .009 + i * .002, 6, 180), i % 2 ? violet : gold)
      ring.rotation.z = i * .18
      mandala.add(ring)
    }
    const petalGeometry = new THREE.SphereGeometry(.17, 12, 10)
    for (let i = 0; i < 16; i++) {
      const angle = i * Math.PI * 2 / 16
      const petal = new THREE.Mesh(petalGeometry, i % 3 === 0 ? violet : softGold)
      petal.position.set(Math.cos(angle) * 1.72, Math.sin(angle) * 1.72, .08)
      petal.scale.set(.65, 2.3, .42)
      petal.rotation.z = angle - Math.PI / 2
      mandala.add(petal)
    }
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), new THREE.MeshBasicMaterial({ color: 0xffd58a, wireframe: true, transparent: true, opacity: .45 }))
    mandala.add(core)

    const lanterns: Lantern[] = []
    for (let i = 0; i < 9; i++) {
      const group = new THREE.Group()
      const body = new THREE.Mesh(new THREE.SphereGeometry(.16 + (i % 3) * .035, 16, 12), new THREE.MeshBasicMaterial({ color: [0xffbd67, 0x8cc9d2, 0xc5a3f0][i % 3], transparent: true, opacity: .62 }))
      body.scale.y = 1.45
      const halo = new THREE.Mesh(new THREE.TorusGeometry(.25, .012, 6, 32), gold)
      halo.rotation.x = Math.PI / 2
      group.add(body, halo)
      const cap = new THREE.Mesh(new THREE.ConeGeometry(.12, .16, 6), softGold)
      cap.position.y = .28
      group.add(cap)
      world.add(group)
      lanterns.push({ group, speed: .12 + i * .012, phase: i * .72, radius: 3.1 + (i % 3) * .65, baseY: (i % 4 - 1.5) * .8 })
    }

    const starCount = 360
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - .5) * 23
      positions[i * 3 + 1] = (Math.random() - .5) * 14
      positions[i * 3 + 2] = (Math.random() - .5) * 8 - 2
    }
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffdba0, size: .025, transparent: true, opacity: .7 }))
    scene.add(stars)

    let pointerX = 0, pointerY = 0, frame = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - .5) * 2
      pointerY = (event.clientY / window.innerHeight - .5) * 2
    }
    const resize = () => {
      const width = Math.max(root.clientWidth, 1), height = Math.max(root.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('resize', resize)
    const clock = new THREE.Clock()
    const render = () => {
      frame = requestAnimationFrame(render)
      const t = clock.getElapsedTime()
      if (!reduced) {
        mandala.rotation.z = t * .035
        mandala.rotation.x = Math.sin(t * .16) * .08
        core.rotation.y = t * .22
        world.rotation.y += (pointerX * .055 - world.rotation.y) * .018
        world.rotation.x += (-pointerY * .035 - world.rotation.x) * .018
        lanterns.forEach(({ group, speed, phase, radius, baseY }) => {
          const a = t * speed + phase
          group.position.set(Math.cos(a) * radius, baseY + Math.sin(a * 1.4) * .3, Math.sin(a) * .65)
          group.rotation.y = a
        })
        stars.rotation.y = t * .003
      }
      renderer.render(scene, camera)
    }
    render()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', resize)
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const material = object.material
          if (Array.isArray(material)) material.forEach(item => item.dispose())
          else material.dispose()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])
  return <div ref={host} className="festival-universe" aria-hidden="true" />
}
