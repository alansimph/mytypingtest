import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type CapybaraMood = 'idle' | 'gift' | 'oops'

export const capybaraGiftCount = 6
export const capybaraOopsCount = 6

const gifts = ['A present!', 'An orange!', 'A flower!', 'A balloon!', 'A cupcake!', 'A book!']
const oopses = ['Pie face!', 'A bucket!', 'Splash!', 'Leaves!', 'Bubbles!', 'A rain cloud!']

interface CapybaraProps {
  mood: CapybaraMood
  kind: number
}

interface Bin {
  geos: THREE.BufferGeometry[]
  mats: THREE.Material[]
}

function material(bin: Bin, params: THREE.MeshStandardMaterialParameters) {
  const next = new THREE.MeshStandardMaterial(params)
  bin.mats.push(next)
  return next
}

function mesh(
  parent: THREE.Object3D,
  bin: Bin,
  geometry: THREE.BufferGeometry,
  surface: THREE.Material,
) {
  bin.geos.push(geometry)
  const next = new THREE.Mesh(geometry, surface)
  parent.add(next)
  return next
}

function buildCharacter(bin: Bin, mood: CapybaraMood) {
  const root = new THREE.Group()
  const fur = material(bin, { color: 0xe0b07a, roughness: 0.62 })
  const deep = material(bin, { color: 0xc4894f, roughness: 0.7 })
  const belly = material(bin, { color: 0xfff1dc, roughness: 0.55 })
  const dark = material(bin, { color: 0x3a2a22, roughness: 0.4 })
  const white = material(bin, { color: 0xffffff, roughness: 0.18 })
  const blush = material(bin, { color: 0xff9aaf, roughness: 0.45 })
  const happy = mood === 'gift'
  const dizzy = mood === 'oops'

  const body = mesh(root, bin, new THREE.SphereGeometry(0.72, 32, 24), fur)
  body.scale.set(1.18, 0.78, 0.92)
  body.position.y = -0.18

  const tummy = mesh(root, bin, new THREE.SphereGeometry(0.46, 24, 18), belly)
  tummy.scale.set(1.05, 0.72, 0.5)
  tummy.position.set(0, -0.22, 0.42)

  const head = mesh(root, bin, new THREE.SphereGeometry(0.66, 32, 24), fur)
  head.position.set(0, 0.58, 0.08)

  for (const side of [-1, 1]) {
    const ear = mesh(root, bin, new THREE.SphereGeometry(0.16, 16, 12), deep)
    ear.scale.set(0.72, 1.2, 0.5)
    ear.position.set(side * 0.4, 1.16, -0.02)
    const inner = mesh(root, bin, new THREE.SphereGeometry(0.09, 12, 10), blush)
    inner.scale.set(0.55, 0.95, 0.35)
    inner.position.set(side * 0.4, 1.14, 0.05)

    const eye = mesh(root, bin, new THREE.SphereGeometry(0.22, 20, 16), white)
    eye.scale.y = happy ? 0.42 : 1
    eye.position.set(side * 0.26, happy ? 0.68 : 0.72, 0.62)
    if (!happy) {
      const pupil = mesh(root, bin, new THREE.SphereGeometry(0.1, 16, 12), dark)
      pupil.position.set(side * 0.27, dizzy ? 0.68 : 0.73, 0.78)
      const spark = mesh(root, bin, new THREE.SphereGeometry(0.04, 8, 8), white)
      spark.position.set(side * 0.32, 0.78, 0.84)
    }
    if (dizzy) {
      const slashA = mesh(root, bin, new THREE.BoxGeometry(0.18, 0.035, 0.02), dark)
      slashA.position.set(side * 0.26, 0.72, 0.84)
      slashA.rotation.z = 0.7
      const slashB = mesh(root, bin, new THREE.BoxGeometry(0.18, 0.035, 0.02), dark)
      slashB.position.set(side * 0.26, 0.72, 0.85)
      slashB.rotation.z = -0.7
    }

    const cheek = mesh(root, bin, new THREE.SphereGeometry(0.11, 12, 10), blush)
    cheek.scale.set(1.3, 0.7, 0.4)
    cheek.position.set(side * 0.48, 0.5, 0.58)
  }

  const snout = mesh(root, bin, new THREE.SphereGeometry(0.28, 20, 16), deep)
  snout.scale.set(1.2, 0.72, 0.85)
  snout.position.set(0, 0.38, 0.58)
  for (const side of [-1, 1]) {
    const nostril = mesh(root, bin, new THREE.SphereGeometry(0.045, 10, 8), dark)
    nostril.position.set(side * 0.07, 0.42, 0.82)
  }

  const smile = mesh(root, bin, new THREE.TorusGeometry(0.12, 0.022, 8, 18, Math.PI), dark)
  smile.rotation.z = dizzy ? 0 : Math.PI
  smile.position.set(0, dizzy ? 0.32 : 0.28, 0.86)

  for (const x of [-0.34, 0.32]) {
    const foot = mesh(root, bin, new THREE.SphereGeometry(0.16, 16, 12), deep)
    foot.scale.set(1.25, 0.5, 1.35)
    foot.position.set(x, -0.72, 0.16)
  }

  const tail = mesh(root, bin, new THREE.SphereGeometry(0.12, 12, 10), deep)
  tail.position.set(0, -0.05, -0.62)

  return root
}

function frameCamera(camera: THREE.PerspectiveCamera, subject: THREE.Object3D) {
  subject.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(subject)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const margin = 1.7
  const vFov = (camera.fov * Math.PI) / 180
  const heightDistance = (size.y * margin) / 2 / Math.tan(vFov / 2)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
  const widthDistance = (size.x * margin) / 2 / Math.tan(hFov / 2)
  const distance = Math.max(heightDistance, widthDistance) + size.z / 2
  camera.position.set(center.x, center.y, center.z + distance)
  camera.near = 0.05
  camera.far = distance + size.z + 12
  camera.lookAt(center)
  camera.updateProjectionMatrix()
}

function buildProp(bin: Bin, mood: CapybaraMood, kind: number) {
  const prop = new THREE.Group()
  if (mood === 'idle') return prop

  const red = material(bin, { color: 0xe24b4b, roughness: 0.45 })
  const gold = material(bin, { color: 0xf6d365, roughness: 0.4 })
  const orange = material(bin, { color: 0xf08a24, roughness: 0.4 })
  const leaf = material(bin, { color: 0x2f8a45, roughness: 0.55 })
  const pink = material(bin, { color: 0xf27ca8, roughness: 0.4 })
  const blue = material(bin, { color: 0x7eb6e8, roughness: 0.25, transparent: true, opacity: 0.85 })
  const cream = material(bin, { color: 0xfffaf0, roughness: 0.35 })
  const crust = material(bin, { color: 0xc4844a, roughness: 0.6 })
  const gray = material(bin, { color: 0x8aa4bc, roughness: 0.4 })
  const dark = material(bin, { color: 0x3a2a22, roughness: 0.45 })

  if (mood === 'gift' && kind === 0) {
    const box = mesh(prop, bin, new THREE.BoxGeometry(0.62, 0.42, 0.42), red)
    box.position.set(0, -0.05, 0.95)
    const bandV = mesh(prop, bin, new THREE.BoxGeometry(0.12, 0.44, 0.44), gold)
    bandV.position.set(0, -0.05, 0.95)
    const bandH = mesh(prop, bin, new THREE.BoxGeometry(0.64, 0.1, 0.44), gold)
    bandH.position.set(0, -0.02, 0.95)
    const bow = mesh(prop, bin, new THREE.SphereGeometry(0.1, 12, 10), gold)
    bow.position.set(0, 0.2, 1.05)
  } else if (mood === 'gift' && kind === 1) {
    const fruit = mesh(prop, bin, new THREE.SphereGeometry(0.28, 20, 16), orange)
    fruit.position.set(0, -0.02, 0.95)
    const stem = mesh(prop, bin, new THREE.SphereGeometry(0.1, 12, 10), leaf)
    stem.scale.set(1.4, 0.45, 0.7)
    stem.position.set(0.16, 0.2, 0.95)
    stem.rotation.z = -0.6
  } else if (mood === 'gift' && kind === 2) {
    for (let petal = 0; petal < 5; petal += 1) {
      const angle = (petal / 5) * Math.PI * 2
      const piece = mesh(prop, bin, new THREE.SphereGeometry(0.12, 12, 10), pink)
      piece.position.set(Math.cos(angle) * 0.16, -0.02 + Math.sin(angle) * 0.16, 0.95)
    }
    const center = mesh(prop, bin, new THREE.SphereGeometry(0.1, 12, 10), gold)
    center.position.set(0, -0.02, 1.02)
  } else if (mood === 'gift' && kind === 3) {
    const balloon = mesh(prop, bin, new THREE.SphereGeometry(0.28, 20, 16), pink)
    balloon.scale.y = 1.15
    balloon.position.set(0.42, 1.05, 0.15)
    const knot = mesh(prop, bin, new THREE.SphereGeometry(0.05, 8, 8), pink)
    knot.position.set(0.42, 0.76, 0.15)
    const string = mesh(prop, bin, new THREE.CylinderGeometry(0.012, 0.012, 0.7, 6), dark)
    string.position.set(0.32, 0.4, 0.25)
    string.rotation.z = 0.25
  } else if (mood === 'gift' && kind === 4) {
    const wrap = mesh(prop, bin, new THREE.CylinderGeometry(0.2, 0.24, 0.28, 16), pink)
    wrap.position.set(0, -0.12, 0.95)
    const frosting = mesh(prop, bin, new THREE.SphereGeometry(0.22, 16, 12), cream)
    frosting.scale.y = 0.7
    frosting.position.set(0, 0.06, 0.95)
    const cherry = mesh(prop, bin, new THREE.SphereGeometry(0.07, 10, 8), red)
    cherry.position.set(0, 0.22, 0.95)
  } else if (mood === 'gift' && kind === 5) {
    const cover = mesh(prop, bin, new THREE.BoxGeometry(0.5, 0.34, 0.12), blue)
    cover.position.set(0, -0.05, 0.95)
    cover.rotation.z = -0.15
    const pages = mesh(prop, bin, new THREE.BoxGeometry(0.42, 0.28, 0.08), cream)
    pages.position.set(0.02, -0.05, 1.02)
    pages.rotation.z = -0.15
  } else if (mood === 'oops' && kind === 0) {
    const pie = mesh(prop, bin, new THREE.SphereGeometry(0.48, 20, 16), cream)
    pie.scale.set(1.15, 0.55, 0.7)
    pie.position.set(0, 0.62, 0.72)
    const rim = mesh(prop, bin, new THREE.TorusGeometry(0.42, 0.06, 8, 20), crust)
    rim.position.set(0, 0.58, 0.62)
  } else if (mood === 'oops' && kind === 1) {
    const bucket = mesh(prop, bin, new THREE.CylinderGeometry(0.38, 0.32, 0.42, 20), gray)
    bucket.position.set(0, 1.05, 0.08)
    const rim = mesh(prop, bin, new THREE.TorusGeometry(0.38, 0.04, 8, 20), dark)
    rim.rotation.x = Math.PI / 2
    rim.position.set(0, 1.26, 0.08)
  } else if (mood === 'oops' && kind === 2) {
    const drops = [
      [0.7, 0.4, 0.3],
      [-0.72, 0.55, 0.2],
      [0.2, 1.15, 0.1],
      [-0.25, 0.95, 0.45],
      [0.45, -0.15, 0.7],
    ]
    for (const [x, y, z] of drops) {
      const drop = mesh(prop, bin, new THREE.SphereGeometry(0.1, 12, 10), blue)
      drop.position.set(x ?? 0, y ?? 0, z ?? 0)
    }
    const puddle = mesh(prop, bin, new THREE.SphereGeometry(0.55, 16, 12), blue)
    puddle.scale.set(1.2, 0.12, 0.7)
    puddle.position.set(0, -0.82, 0.2)
  } else if (mood === 'oops' && kind === 3) {
    for (let leafIndex = 0; leafIndex < 4; leafIndex += 1) {
      const piece = mesh(prop, bin, new THREE.SphereGeometry(0.14, 12, 10), leaf)
      piece.scale.set(1.5, 0.35, 0.8)
      piece.position.set((leafIndex - 1.5) * 0.22, 1.22, 0.1)
      piece.rotation.z = (leafIndex - 1.5) * 0.4
    }
  } else if (mood === 'oops' && kind === 4) {
    const spots = [
      [0.45, 0.95, 0.4],
      [-0.4, 1.15, 0.2],
      [0.15, 1.4, 0.15],
      [-0.15, 0.7, 0.6],
    ]
    const bubble = material(bin, {
      color: 0xb9e4fb,
      roughness: 0.05,
      transparent: true,
      opacity: 0.55,
    })
    for (const [x, y, z] of spots) {
      const orb = mesh(prop, bin, new THREE.SphereGeometry(0.12, 16, 12), bubble)
      orb.position.set(x ?? 0, y ?? 0, z ?? 0)
    }
  } else if (mood === 'oops' && kind === 5) {
    const cloud = mesh(prop, bin, new THREE.SphereGeometry(0.26, 16, 12), gray)
    cloud.position.set(0, 1.22, 0.05)
    cloud.scale.set(1.6, 0.8, 0.8)
    const puff = mesh(prop, bin, new THREE.SphereGeometry(0.2, 14, 12), gray)
    puff.position.set(0.2, 1.16, 0.08)
    for (const x of [-0.18, 0.05, 0.24]) {
      const rain = mesh(prop, bin, new THREE.SphereGeometry(0.05, 8, 8), blue)
      rain.scale.y = 1.6
      rain.position.set(x, 0.95, 0.2)
    }
  }

  return prop
}

export function Capybara({ mood, kind }: CapybaraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const giftKind = ((kind % capybaraGiftCount) + capybaraGiftCount) % capybaraGiftCount
  const oopsKind = ((kind % capybaraOopsCount) + capybaraOopsCount) % capybaraOopsCount
  const caption =
    mood === 'gift'
      ? gifts[giftKind] ?? gifts[0]
      : mood === 'oops'
        ? oopses[oopsKind] ?? oopses[0]
        : 'Capy is ready.'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const bin: Bin = { geos: [], mats: [] }
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.width, canvas.height, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, canvas.width / canvas.height, 0.05, 40)

    scene.add(new THREE.HemisphereLight(0xfff7ee, 0xd7b48a, 1.25))
    const key = new THREE.DirectionalLight(0xffffff, 1.7)
    key.position.set(2.4, 4.2, 3.2)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffe4c4, 0.55)
    fill.position.set(-3, 1.2, 2)
    scene.add(fill)

    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x172033,
      transparent: true,
      opacity: 0.12,
    })
    bin.mats.push(shadowMaterial)
    const shadow = mesh(scene, bin, new THREE.CircleGeometry(0.85, 28), shadowMaterial)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -0.92

    const subject = new THREE.Group()
    scene.add(subject)
    shadow.removeFromParent()
    subject.add(shadow)
    const character = buildCharacter(bin, mood)
    const propKind = mood === 'gift' ? giftKind : oopsKind
    const prop = buildProp(bin, mood, propKind)
    character.add(prop)
    subject.add(character)
    frameCamera(camera, subject)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const started = performance.now()
    let frame = 0

    const draw = (now: number) => {
      const elapsed = (now - started) / 1000
      if (mood === 'oops') {
        character.rotation.z = Math.sin(elapsed * 22) * 0.08
        character.position.y = 0
      } else if (mood === 'gift') {
        character.position.y = Math.abs(Math.sin(elapsed * 7)) * 0.14
        character.rotation.z = Math.sin(elapsed * 5) * 0.06
      } else {
        character.position.y = Math.sin(elapsed * 2.2) * 0.045
        character.rotation.z = Math.sin(elapsed * 1.4) * 0.03
      }
      const intro = reduceMotion ? 1 : Math.min(1, elapsed / 0.35)
      const scale = 1 - (1 - intro) ** 3
      prop.scale.setScalar(mood === 'idle' ? 1 : scale)
      renderer.render(scene, camera)
    }

    draw(started)
    if (!reduceMotion) {
      const tick = (now: number) => {
        draw(now)
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      renderer.dispose()
      for (const geometry of bin.geos) geometry.dispose()
      for (const surface of bin.mats) surface.dispose()
    }
  }, [giftKind, mood, oopsKind])

  return (
    <div className={`capy capy--${mood}`} aria-hidden="true">
      <canvas ref={canvasRef} className="capy__stage" width={480} height={420} />
      <p className="capy__caption">{caption}</p>
    </div>
  )
}
