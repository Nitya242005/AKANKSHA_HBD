import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedural realistic rich wood tabletop
 * Features natural plank variation, wood grain texture, warm walnut/amber tones.
 */
export function WoodTable() {
  const { diffuseMap, roughnessMap } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    // Rich warm walnut base
    ctx.fillStyle = '#4a2c16'
    ctx.fillRect(0, 0, 1024, 1024)

    // Wood planks & grain
    const plankWidth = 128
    for (let x = 0; x < 1024; x += plankWidth) {
      // Subtle plank tone variation
      const tint = (Math.sin(x * 0.05) * 15) | 0
      ctx.fillStyle = `rgba(${70 + tint}, ${42 + (tint * 0.6) | 0}, ${22 + (tint * 0.3) | 0}, 0.35)`
      ctx.fillRect(x, 0, plankWidth, 1024)

      // Fine grain streaks
      for (let i = 0; i < 90; i++) {
        const gx = x + Math.random() * plankWidth
        ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(35, 18, 8, 0.45)' : 'rgba(105, 62, 34, 0.35)'
        ctx.lineWidth = 0.8 + Math.random() * 1.5
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.bezierCurveTo(
          gx + (Math.random() - 0.5) * 18, 300,
          gx + (Math.random() - 0.5) * 18, 700,
          gx + (Math.random() - 0.5) * 8, 1024
        )
        ctx.stroke()
      }

      // Plank seam line
      ctx.strokeStyle = 'rgba(20, 10, 5, 0.8)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 1024)
      ctx.stroke()
    }

    const diffuse = new THREE.CanvasTexture(canvas)
    diffuse.wrapS = THREE.RepeatWrapping
    diffuse.wrapT = THREE.RepeatWrapping
    diffuse.repeat.set(3, 3)

    // Roughness map (varnished wood: mostly smooth 0.35 with subtle grain micro-roughness)
    const rCanvas = document.createElement('canvas')
    rCanvas.width = 512
    rCanvas.height = 512
    const rctx = rCanvas.getContext('2d')
    rctx.fillStyle = '#666666'
    rctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 400; i++) {
      rctx.fillStyle = Math.random() > 0.5 ? '#777777' : '#555555'
      rctx.fillRect(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 8, 1)
    }
    const rough = new THREE.CanvasTexture(rCanvas)
    rough.wrapS = THREE.RepeatWrapping
    rough.wrapT = THREE.RepeatWrapping
    rough.repeat.set(3, 3)

    return { diffuseMap: diffuse, roughnessMap: rough }
  }, [])

  return (
    <group position={[0, -0.05, 0]}>
      {/* Table top slab */}
      <mesh receiveShadow position={[0, -0.02, 0]}>
        <boxGeometry args={[7.2, 0.08, 5.2]} />
        <meshStandardMaterial
          map={diffuseMap}
          roughnessMap={roughnessMap}
          roughness={0.42}
          metalness={0.05}
          color="#caa282"
        />
      </mesh>

      {/* Warm linen runner in center */}
      <mesh receiveShadow position={[0, 0.022, 0]}>
        <boxGeometry args={[2.4, 0.004, 4.6]} />
        <meshStandardMaterial
          color="#f6efe4"
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* Decorative gold lace edge on linen runner */}
      <mesh receiveShadow position={[-1.2, 0.024, 0]}>
        <boxGeometry args={[0.04, 0.005, 4.6]} />
        <meshStandardMaterial color="#d4af37" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh receiveShadow position={[1.2, 0.024, 0]}>
        <boxGeometry args={[0.04, 0.005, 4.6]} />
        <meshStandardMaterial color="#d4af37" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  )
}
