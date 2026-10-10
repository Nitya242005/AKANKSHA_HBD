import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates high-detail procedural rose petals with organic curvature,
 * edge rippling, velvety texture map, and delicate translucency.
 */
function useRoseTextures(baseColor = '#d96b79') {
  return useMemo(() => {
    // 1. Petal Color & Micro-Vein Map
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Base radial tone: deeper velvet red at base, delicate pastel toward petal rim
    const grad = ctx.createRadialGradient(256, 450, 40, 256, 256, 280)
    grad.addColorStop(0, '#8c1f2b')
    grad.addColorStop(0.4, baseColor)
    grad.addColorStop(0.85, '#f4a9b2')
    grad.addColorStop(1, '#ffc2ca')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

    // Delicate botanical veins branching outwards
    ctx.lineWidth = 1.2
    for (let i = 0; i < 35; i++) {
      ctx.strokeStyle = 'rgba(150, 30, 45, 0.22)'
      ctx.beginPath()
      ctx.moveTo(256, 480)
      const targetX = 40 + i * 12 + (Math.random() - 0.5) * 15
      ctx.bezierCurveTo(
        256 + (targetX - 256) * 0.4, 340,
        256 + (targetX - 256) * 0.7, 180,
        targetX, 40
      )
      ctx.stroke()
    }

    const diffuse = new THREE.CanvasTexture(canvas)
    return { diffuse }
  }, [baseColor])
}

/**
 * Procedural Realistic Botanical Rose Petal Geometry
 * Spoon-curved with natural cup shape, ruffled perimeter, and realistic thickness
 */
function createCurvedPetalGeometry(width = 0.08, height = 0.11, cupping = 0.035, ripple = 0.008) {
  const geo = new THREE.PlaneGeometry(width, height, 16, 20)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // Normalized coords (-1 to 1)
    const nx = v.x / (width * 0.5)
    const ny = v.y / (height * 0.5)

    // Cupping curve: parabolic depth
    const d = (1 - nx * nx) * (1 - ny * ny * 0.4)
    v.z += d * cupping

    // Curled tip backward at the top
    if (ny > 0.3) {
      const curl = (ny - 0.3) / 0.7
      v.z -= curl * curl * cupping * 1.6
      v.y -= curl * 0.008
    }

    // Natural ruffle on edge
    const edgeWave = Math.sin(nx * 12 + ny * 8) * ripple * Math.abs(nx)
    v.z += edgeWave

    pos.setXYZ(i, v.x, v.y, v.z)
  }

  geo.computeVertexNormals()
  return geo
}

/**
 * Natural English Garden Rose Flower
 * Sculpted with 4 concentric whorls of natural petals, spiraling tight center bud,
 * and realistic sepals.
 */
function RealisticGardenRose({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#d96b79',
}) {
  const { diffuse } = useRoseTextures(color)

  const petalLayers = useMemo(() => {
    // 4 Whorls of petals ranging from inner tight whorl to outer blooming guard petals
    const whorls = []

    // Whorl 1: Tight spiral inner bud (5 small petals)
    const g1 = createCurvedPetalGeometry(0.045, 0.065, 0.022, 0.003)
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 + 0.2
      whorls.push({
        geo: g1,
        pos: [Math.cos(ang) * 0.016, 0.018, Math.sin(ang) * 0.016],
        rot: [0.45 * Math.sin(ang), -ang + Math.PI / 2, 0.45 * Math.cos(ang)],
        scale: 0.85,
      })
    }

    // Whorl 2: Mid-inner whorl (6 petals)
    const g2 = createCurvedPetalGeometry(0.065, 0.085, 0.03, 0.005)
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + 0.5
      whorls.push({
        geo: g2,
        pos: [Math.cos(ang) * 0.035, 0.01, Math.sin(ang) * 0.035],
        rot: [0.65 * Math.sin(ang), -ang + Math.PI / 2, 0.65 * Math.cos(ang)],
        scale: 1.0,
      })
    }

    // Whorl 3: Outer blooming petals (7 petals)
    const g3 = createCurvedPetalGeometry(0.085, 0.105, 0.038, 0.007)
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2 + 0.8
      whorls.push({
        geo: g3,
        pos: [Math.cos(ang) * 0.058, 0.0, Math.sin(ang) * 0.058],
        rot: [0.95 * Math.sin(ang), -ang + Math.PI / 2, 0.95 * Math.cos(ang)],
        scale: 1.15,
      })
    }

    // Whorl 4: Open guard petals (8 petals)
    const g4 = createCurvedPetalGeometry(0.1, 0.12, 0.042, 0.009)
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + 0.3
      whorls.push({
        geo: g4,
        pos: [Math.cos(ang) * 0.082, -0.015, Math.sin(ang) * 0.082],
        rot: [1.25 * Math.sin(ang), -ang + Math.PI / 2, 1.25 * Math.cos(ang)],
        scale: 1.25,
      })
    }

    return whorls
  }, [])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Rose Center Heart/Stamens */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color="#801b26" roughness={0.7} />
      </mesh>

      {/* Handcrafted Layered Botanical Petals */}
      {petalLayers.map((p, idx) => (
        <mesh
          key={idx}
          geometry={p.geo}
          position={p.pos}
          rotation={p.rot}
          scale={p.scale}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={diffuse}
            color={color}
            roughness={0.52} // velvety rose petal texture
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Star Sepals & Calyx Base */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 0.045, -0.032, Math.sin(ang) * 0.045]}
          rotation={[0.6 * Math.sin(ang), ang, 0.6 * Math.cos(ang)]}
          castShadow
        >
          <coneGeometry args={[0.012, 0.08, 5]} />
          <meshStandardMaterial color="#365825" roughness={0.65} />
        </mesh>
      ))}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} scale={[1, 1.2, 1]} />
        <meshStandardMaterial color="#365825" roughness={0.65} />
      </mesh>
    </group>
  )
}

/**
 * Natural Leaf on stem with gentle bend and serrations
 */
function BotanicalLeaf({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const leafGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.06, 0.12, 8, 12)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      // Central fold curve
      const nx = v.x / 0.03
      v.z -= Math.abs(nx) * 0.008
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh
      geometry={leafGeo}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
    >
      <meshStandardMaterial
        color="#325224"
        roughness={0.45}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/**
 * Realistic Ceramic Floral Vase with Master Florist Arrangement:
 * - Hand-thrown ribbed porcelain vase with reactive celadon/cream glaze & brass collar
 * - Natural curving thorny woody stems
 * - Multiple blooming garden roses in Akanksha's palette (blush, cream, rose, apricot)
 * - Layered eucalyptus leaves
 */
export function FloralVase({ position = [0, 0, 0] }) {
  const vaseTextures = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#faf7f0'
    ctx.fillRect(0, 0, 512, 512)

    // Hand-thrown pottery clay rings
    for (let y = 0; y < 512; y += 8) {
      ctx.fillStyle = y % 16 === 0 ? 'rgba(235, 228, 215, 0.35)' : 'rgba(255, 255, 255, 0.3)'
      ctx.fillRect(0, y, 512, 4)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group position={position}>
      {/* ── Fluted Ceramic Vase Body ──────────────────────────────────── */}
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 0.64, 48]} />
        <meshStandardMaterial
          map={vaseTextures}
          color="#fbf8f2"
          roughness={0.35} // semi-gloss glazed porcelain
          metalness={0.08}
        />
      </mesh>

      {/* Solid brass pedestal base foot */}
      <mesh castShadow position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.33, 0.34, 0.036, 48]} />
        <meshStandardMaterial color="#c59b38" roughness={0.28} metalness={0.82} />
      </mesh>

      {/* Polished brass neck ring */}
      <mesh position={[0, 0.64, 0]}>
        <torusGeometry args={[0.22, 0.014, 16, 48]} />
        <meshStandardMaterial color="#c59b38" roughness={0.25} metalness={0.82} />
      </mesh>

      {/* ── Curving Natural Stems ─────────────────────────────────────── */}
      {[
        { pos: [0.03, 0.76, 0.02], rot: [0.15, 0.2, 0.22], len: 0.48 },
        { pos: [-0.04, 0.78, 0.04], rot: [-0.22, 0.1, -0.28], len: 0.52 },
        { pos: [-0.06, 0.77, -0.05], rot: [0.12, -0.3, -0.22], len: 0.5 },
        { pos: [0.05, 0.75, -0.04], rot: [-0.18, 0.4, 0.25], len: 0.46 },
        { pos: [0.0, 0.84, 0.0], rot: [0.0, 0.0, 0.0], len: 0.54 },
      ].map((stem, i) => (
        <group key={i}>
          <mesh position={stem.pos} rotation={stem.rot} castShadow>
            <cylinderGeometry args={[0.009, 0.012, stem.len, 10]} />
            <meshStandardMaterial color="#2d4a20" roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* ── Botanical Leaves along Stems ──────────────────────────────── */}
      <BotanicalLeaf position={[0.16, 0.84, 0.12]} rotation={[0.4, 0.8, -0.2]} scale={1.1} />
      <BotanicalLeaf position={[-0.14, 0.82, 0.08]} rotation={[-0.3, -0.6, 0.4]} scale={1.0} />
      <BotanicalLeaf position={[-0.08, 0.86, -0.12]} rotation={[0.2, -1.2, -0.3]} scale={1.05} />
      <BotanicalLeaf position={[0.12, 0.85, -0.1]} rotation={[-0.4, 1.1, 0.2]} scale={0.95} />

      {/* ── Blooming Garden Roses ─────────────────────────────────────── */}
      {/* 1. Tall Centerpiece Cream Rose */}
      <RealisticGardenRose
        position={[0.0, 1.08, 0.0]}
        rotation={[0.1, 0.3, -0.05]}
        scale={1.22}
        color="#fff0e6"
      />

      {/* 2. Front Center Blush Pink Rose (Facing viewer) */}
      <RealisticGardenRose
        position={[0.14, 0.98, 0.14]}
        rotation={[0.42, 0.4, -0.2]}
        scale={1.14}
        color="#eb8b97"
      />

      {/* 3. Left Rich Velvet Rose */}
      <RealisticGardenRose
        position={[-0.16, 0.96, 0.07]}
        rotation={[0.25, -0.7, 0.35]}
        scale={1.1}
        color="#be3f50"
      />

      {/* 4. Back Warm Apricot Champagne Rose */}
      <RealisticGardenRose
        position={[-0.09, 1.02, -0.15]}
        rotation={[-0.35, -0.2, 0.2]}
        scale={1.12}
        color="#f2ad99"
      />

      {/* 5. Right Delicate Pastel Rose */}
      <RealisticGardenRose
        position={[0.17, 0.95, -0.09]}
        rotation={[-0.2, 0.9, -0.32]}
        scale={1.05}
        color="#faeae3"
      />
    </group>
  )
}

/**
 * Photorealistic Scattered Rose Petals on Tablecloth
 */
export function ScatteredPetals() {
  const petalData = [
    { pos: [-0.5, 0.024, 0.8], rot: [0.1, 0.5, -0.05], col: '#eb8b97' },
    { pos: [-0.64, 0.024, 0.95], rot: [-0.05, -0.8, 0.1], col: '#be3f50' },
    { pos: [0.45, 0.024, 0.65], rot: [0.08, 1.2, 0.05], col: '#fff0e6' },
    { pos: [0.55, 0.024, 0.78], rot: [-0.1, -0.4, -0.05], col: '#eb8b97' },
    { pos: [-0.3, 0.024, 1.25], rot: [0.05, 2.1, 0.1], col: '#be3f50' },
    { pos: [0.25, 0.024, 1.35], rot: [-0.08, -1.5, -0.08], col: '#f2ad99' },
    { pos: [-1.1, 0.024, 0.1], rot: [0.06, 0.7, 0.04], col: '#eb8b97' },
    { pos: [1.1, 0.024, 0.15], rot: [-0.05, -0.9, -0.06], col: '#be3f50' },
    { pos: [0.85, 0.024, -0.2], rot: [0.1, 1.8, 0.05], col: '#fff0e6' },
    { pos: [-0.85, 0.024, -0.15], rot: [-0.07, -2.2, -0.05], col: '#be3f50' },
  ]

  const singlePetalGeo = useMemo(() => createCurvedPetalGeometry(0.065, 0.09, 0.02, 0.005), [])

  return (
    <group>
      {petalData.map((p, idx) => (
        <mesh
          key={idx}
          geometry={singlePetalGeo}
          position={p.pos}
          rotation={[-Math.PI / 2 + p.rot[0], p.rot[1], p.rot[2]]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial
            color={p.col}
            roughness={0.55}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
