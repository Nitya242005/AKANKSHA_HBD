import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Generates high-res photorealistic textures for artisan buttercream cake frosting:
 * - Subtle spatula sweeps, peaks, micro-porosity, whipped texture
 * - Warm vanilla/champagne tone with slight translucency
 */
function useCakeTextures() {
  return useMemo(() => {
    // 1. Frosting Diffuse Map
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    // Base delicate whipped cream tone
    ctx.fillStyle = '#fdfbf7'
    ctx.fillRect(0, 0, 1024, 1024)

    // Hand-piped spatula swatches / subtle natural tonal gradient
    for (let y = 0; y < 1024; y += 40) {
      const grad = ctx.createLinearGradient(0, y, 1024, y + 60)
      const alpha = 0.04 + Math.sin(y * 0.05) * 0.02
      grad.addColorStop(0, `rgba(245, 236, 222, ${alpha})`)
      grad.addColorStop(0.5, `rgba(255, 253, 248, ${alpha * 0.5})`)
      grad.addColorStop(1, `rgba(240, 228, 212, ${alpha})`)
      ctx.fillStyle = grad
      ctx.fillRect(0, y, 1024, 60)
    }

    // Whipped cream micro-bubbles and natural porous texture
    for (let i = 0; i < 18000; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 1024
      const r = 0.5 + Math.random() * 1.5
      const brightness = Math.random() > 0.45 ? 255 : 230
      ctx.fillStyle = `rgba(${brightness}, ${brightness - 8}, ${brightness - 18}, 0.22)`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Edible 24k gold leaf flakes scattered naturally
    for (let i = 0; i < 45; i++) {
      const gx = Math.random() * 1024
      const gy = Math.random() * 1024
      const gw = 4 + Math.random() * 12
      const gh = 3 + Math.random() * 8
      ctx.fillStyle = 'rgba(218, 172, 60, 0.85)'
      ctx.beginPath()
      ctx.ellipse(gx, gy, gw, gh, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }

    const diffuse = new THREE.CanvasTexture(canvas)
    diffuse.wrapS = THREE.RepeatWrapping
    diffuse.wrapT = THREE.RepeatWrapping

    // 2. Normal / Bump Map for tactile frosting ridges & spatula swirls
    const bumpCanvas = document.createElement('canvas')
    bumpCanvas.width = 512
    bumpCanvas.height = 512
    const bctx = bumpCanvas.getContext('2d')
    bctx.fillStyle = '#808080'
    bctx.fillRect(0, 0, 512, 512)

    for (let y = 0; y < 512; y += 16) {
      bctx.strokeStyle = Math.sin(y * 0.1) > 0 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'
      bctx.lineWidth = 6 + Math.random() * 6
      bctx.beginPath()
      bctx.moveTo(0, y)
      bctx.bezierCurveTo(170, y + 8, 340, y - 8, 512, y + 4)
      bctx.stroke()
    }

    // Fine frosting noise
    for (let i = 0; i < 8000; i++) {
      bctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
      bctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2)
    }

    const bumpMap = new THREE.CanvasTexture(bumpCanvas)
    bumpMap.wrapS = THREE.RepeatWrapping
    bumpMap.wrapT = THREE.RepeatWrapping

    return { diffuse, bumpMap }
  }, [])
}

/**
 * Creates custom organic cake tier geometry with natural spatula hand-finished surface variation
 */
function createOrganicCakeGeometry(radiusTop, radiusBottom, height, radialSegments = 64, heightSegments = 32) {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // Add organic soft undulating displacement typical of hand-smoothed whipped frosting
    const angle = Math.atan2(v.z, v.x)
    const wave = Math.sin(angle * 7) * 0.007 + Math.cos(angle * 13) * 0.004 + Math.sin(v.y * 22) * 0.005
    // Apply displacement mainly to outer cylindrical sides
    const isSide = Math.abs(v.y) < height * 0.48
    if (isSide) {
      const r = Math.sqrt(v.x * v.x + v.z * v.z) + wave
      v.x = Math.cos(angle) * r
      v.z = Math.sin(angle) * r
    } else if (v.y > 0) {
      // Top flat crown subtle dip and spatula sweep
      v.y += Math.sin(v.x * 6 + v.z * 6) * 0.004
    }
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

/**
 * Star-piped shell frosting border (rococo artisan cake piping)
 */
function PipedShellBorder({ radius, count = 38, y = 0, scale = 0.024 }) {
  const pipingGeo = useMemo(() => {
    // Teardrop shell shape
    const geo = new THREE.SphereGeometry(1, 14, 12)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      // Taper back to a curved tail
      if (v.z < 0) {
        v.x *= (1 + v.z * 0.6)
        v.y *= (1 + v.z * 0.6)
      } else {
        v.y *= 1.25
      }
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <mesh
            key={i}
            geometry={pipingGeo}
            position={[x, 0, z]}
            rotation={[-0.2, -angle + Math.PI / 2, 0.35]}
            scale={[scale * 0.9, scale * 1.1, scale * 1.4]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#fffcf5"
              roughness={0.48}
              metalness={0.03}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * Realistic Hand-Drawn Strawberry with seeded skin and detailed calyx leaves
 */
function ArtisanStrawberry({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { strawberryGeo, calyxGeo } = useMemo(() => {
    // 1. Berry heart shape
    const geo = new THREE.ConeGeometry(0.045, 0.095, 24, 16)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      // Round top shoulder
      if (v.y > 0) {
        v.x *= 1.15
        v.z *= 1.15
      }
      // Natural slight asymmetric bend
      v.x += Math.sin(v.y * 15) * 0.004
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()

    // 2. Calyx star leaves
    const cgeo = new THREE.CylinderGeometry(0.038, 0.005, 0.012, 6)
    return { strawberryGeo: geo, calyxGeo: cgeo }
  }, [])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Berry Fruit Body */}
      <mesh geometry={strawberryGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#a81c22"
          roughness={0.28} // glossy glazed berry
          metalness={0.04}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Fresh Green Stem & Calyx Crown */}
      <mesh geometry={calyxGeo} position={[0, 0.048, 0]} castShadow>
        <meshStandardMaterial color="#2d521e" roughness={0.65} />
      </mesh>
      {/* Natural Little Stem stalk */}
      <mesh position={[0, 0.065, 0]} rotation={[0.2, 0.3, 0.1]} castShadow>
        <cylinderGeometry args={[0.0035, 0.004, 0.026, 6]} />
        <meshStandardMaterial color="#3f6628" roughness={0.7} />
      </mesh>
    </group>
  )
}

/**
 * Realistic Candle with sculpted wax drippings and flame
 */
function ArtisanCandle({ position = [0, 0, 0], lit = true, onBlow }) {
  const flameGroupRef = useRef()
  const innerFlameRef = useRef()
  const lightRef = useRef()

  useFrame(({ clock }) => {
    if (!lit || !flameGroupRef.current) return
    const t = clock.getElapsedTime()
    // Organic, realistic flame flicker
    const f1 = Math.sin(t * 16.0) * 0.06 + Math.cos(t * 26.0) * 0.04
    const f2 = Math.sin(t * 8.0) * 0.08

    flameGroupRef.current.scale.set(
      1.0 + f1 * 0.5,
      1.0 + (f1 + f2) * 0.6,
      1.0 + f1 * 0.5
    )
    flameGroupRef.current.rotation.z = Math.sin(t * 12.0) * 0.08
    flameGroupRef.current.rotation.x = Math.cos(t * 10.0) * 0.05

    if (innerFlameRef.current) {
      innerFlameRef.current.scale.set(1 + f1 * 0.3, 1 + f1 * 0.4, 1 + f1 * 0.3)
    }

    if (lightRef.current) {
      lightRef.current.intensity = 1.45 + (f1 + f2) * 0.35
    }
  })

  return (
    <group position={position}>
      {/* Candle Body - Hand-poured warm ivory wax */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.019, 0.021, 0.30, 24]} />
        <meshStandardMaterial
          color="#fff6eb"
          roughness={0.32}
          metalness={0.04}
        />
      </mesh>

      {/* Elegant embossed spiral gold foil pinstripe */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.0215, 0.0215, 0.015, 24]} />
        <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.0215, 0.0215, 0.015, 24]} />
        <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Wax drip drop near top edge */}
      <mesh position={[0.018, 0.26, 0.005]} castShadow>
        <sphereGeometry args={[0.007, 8, 8]} scale={[1, 1.8, 0.8]} />
        <meshStandardMaterial color="#fff4e3" roughness={0.35} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.31, 0]} rotation={[0.05, 0, 0.08]}>
        <cylinderGeometry args={[0.004, 0.005, 0.028, 8]} />
        <meshStandardMaterial color="#211812" roughness={0.9} />
      </mesh>

      {/* Flame System */}
      {lit ? (
        <group ref={flameGroupRef} position={[0, 0.34, 0]}>
          {/* Blue base flame */}
          <mesh position={[0, 0.006, 0]}>
            <coneGeometry args={[0.016, 0.022, 16]} />
            <meshBasicMaterial
              color="#3388ff"
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Outer glowing warm amber flame */}
          <mesh position={[0, 0.042, 0]}>
            <coneGeometry args={[0.028, 0.085, 16]} />
            <meshBasicMaterial
              color="#ff7b12"
              transparent
              opacity={0.88}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Inner brilliant incandescent white/gold core */}
          <mesh ref={innerFlameRef} position={[0, 0.032, 0]}>
            <coneGeometry args={[0.016, 0.052, 16]} />
            <meshBasicMaterial
              color="#fff7c2"
              transparent
              opacity={0.98}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Candle Light source */}
          <pointLight
            ref={lightRef}
            color="#ff9933"
            distance={2.6}
            decay={2}
            intensity={1.45}
            castShadow
            shadow-bias={-0.002}
            shadow-mapSize={[512, 512]}
          />
        </group>
      ) : (
        /* Extinguished charred state with delicate smoke plume */
        <group position={[0, 0.33, 0]}>
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#b8b2a8" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, 0.065, 0]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshBasicMaterial color="#d4cec5" transparent opacity={0.2} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/**
 * Photorealistic Birthday Cake
 * - Rich sculpted porcelain and brass pedestal stand
 * - 2 organic textured cake tiers with spatula swirls, edible gold leaf
 * - Delicate rosettes, piped pearl shell borders
 * - Fresh glazed strawberries, sculpted sugar flowers
 * - 3 artisan candles with animated flame physics
 */
export function BirthdayCake({
  position = [0, 0, 0],
  candlesLit = true,
  onBlowCandles,
  onHover,
  isFocused = false,
}) {
  const { diffuse, bumpMap } = useCakeTextures()

  const tier1Geo = useMemo(() => createOrganicCakeGeometry(0.66, 0.67, 0.34, 64, 32), [])
  const tier2Geo = useMemo(() => createOrganicCakeGeometry(0.44, 0.45, 0.28, 64, 32), [])

  return (
    <group position={position}>
      {/* ── Cake Pedestal Stand (Antique White Porcelain & Polished Brass) ── */}
      {/* Stand base plate */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.58, 0.68, 0.04, 64]} />
        <meshStandardMaterial
          color="#f7f3ec"
          roughness={0.22}
          metalness={0.12}
        />
      </mesh>
      {/* Brass baluster stem */}
      <mesh castShadow position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.14, 0.22, 0.16, 48]} />
        <meshStandardMaterial
          color="#c59b38"
          roughness={0.25}
          metalness={0.82}
        />
      </mesh>
      {/* Top porcelain platter */}
      <mesh castShadow receiveShadow position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.84, 0.82, 0.038, 64]} />
        <meshStandardMaterial
          color="#fdfbf7"
          roughness={0.18}
          metalness={0.08}
        />
      </mesh>
      {/* Delicate scalloped gold rim */}
      <mesh position={[0, 0.222, 0]}>
        <torusGeometry args={[0.835, 0.012, 16, 64]} />
        <meshStandardMaterial color="#c59b38" roughness={0.22} metalness={0.85} />
      </mesh>

      {/* ── TIER 1 (Base Tier) ────────────────────────────────────────── */}
      <mesh
        geometry={tier1Geo}
        position={[0, 0.39, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={diffuse}
          bumpMap={bumpMap}
          bumpScale={0.018}
          color="#fffdfa"
          roughness={0.62}
          metalness={0.02}
        />
      </mesh>

      {/* Tier 1 bottom piped shell border */}
      <PipedShellBorder radius={0.68} count={42} y={0.226} scale={0.026} />
      {/* Tier 1 top piped shell border */}
      <PipedShellBorder radius={0.65} count={38} y={0.555} scale={0.022} />

      {/* ── TIER 2 (Top Tier) ─────────────────────────────────────────── */}
      <mesh
        geometry={tier2Geo}
        position={[0, 0.705, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={diffuse}
          bumpMap={bumpMap}
          bumpScale={0.018}
          color="#fffdfa"
          roughness={0.6}
          metalness={0.02}
        />
      </mesh>

      {/* Tier 2 bottom piped shell border */}
      <PipedShellBorder radius={0.46} count={32} y={0.57} scale={0.022} />
      {/* Tier 2 top piped crown border */}
      <PipedShellBorder radius={0.435} count={28} y={0.84} scale={0.02} />

      {/* ── FRESH TOP DECORATIONS ────────────────────────────────────── */}
      {/* 5 Fresh Glazed Strawberries */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => {
        const rad = 0.28
        return (
          <ArtisanStrawberry
            key={i}
            position={[Math.cos(angle) * rad, 0.87, Math.sin(angle) * rad]}
            rotation={[0.15, angle + 0.3, 0.1]}
            scale={0.95}
          />
        )
      })}

      {/* Center Handcrafted Blush Sugar Rose */}
      <group position={[0, 0.865, 0]}>
        {/* Rose core */}
        <mesh castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#de7480" roughness={0.68} />
        </mesh>
        {/* Curled sugar petals */}
        {[0, 1.3, 2.6, 3.9, 5.2].map((ang, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(ang) * 0.042, 0.01, Math.sin(ang) * 0.042]}
            rotation={[0.35 * Math.sin(ang), ang, 0.35 * Math.cos(ang)]}
            castShadow
          >
            <sphereGeometry args={[0.032, 12, 12]} scale={[1, 0.6, 1.2]} />
            <meshStandardMaterial color="#e8919b" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ── 3 ARTISAN BIRTHDAY CANDLES ───────────────────────────────── */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          if (onBlowCandles) onBlowCandles()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          if (onHover) onHover(true)
        }}
        onPointerOut={() => {
          if (onHover) onHover(false)
        }}
      >
        <ArtisanCandle position={[-0.14, 0.85, -0.12]} lit={candlesLit} />
        <ArtisanCandle position={[0.14, 0.85, -0.12]} lit={candlesLit} />
        <ArtisanCandle position={[0.0, 0.85, 0.16]} lit={candlesLit} />
      </group>
    </group>
  )
}
