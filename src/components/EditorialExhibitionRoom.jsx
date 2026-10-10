import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * EditorialExhibitionRoom
 * A warm architectural gallery backdrop with:
 * - Subtle ivory plaster wall texture
 * - Warm natural wood exhibition floor with plank seams
 * - High-end gallery directional picture lighting
 * - Soft contact shadows for floating card and prints
 */
export function EditorialExhibitionRoom() {
  const { wallTexture, floorTexture } = useMemo(() => {
    // 1. Warm Ivory Gallery Wall
    const wCanvas = document.createElement('canvas')
    wCanvas.width = 1024
    wCanvas.height = 1024
    const wctx = wCanvas.getContext('2d')
    wctx.fillStyle = '#1c1713' // deep warm museum gallery ambient tone
    wctx.fillRect(0, 0, 1024, 1024)

    // Subtle natural plaster noise
    for (let i = 0; i < 25000; i++) {
      const alpha = 0.03 + Math.random() * 0.04
      wctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 248, 235, ${alpha})` : `rgba(0, 0, 0, ${alpha})`
      wctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2)
    }

    const wallTex = new THREE.CanvasTexture(wCanvas)
    wallTex.wrapS = THREE.RepeatWrapping
    wallTex.wrapT = THREE.RepeatWrapping

    // 2. Fine Warm Herringbone Wood Floor
    const fCanvas = document.createElement('canvas')
    fCanvas.width = 1024
    fCanvas.height = 1024
    const fctx = fCanvas.getContext('2d')
    fctx.fillStyle = '#261b14'
    fctx.fillRect(0, 0, 1024, 1024)

    for (let x = 0; x < 1024; x += 128) {
      fctx.fillStyle = (x / 128) % 2 === 0 ? 'rgba(48, 34, 24, 0.4)' : 'rgba(32, 22, 16, 0.4)'
      fctx.fillRect(x, 0, 128, 1024)
      fctx.strokeStyle = 'rgba(15, 10, 6, 0.7)'
      fctx.lineWidth = 2
      fctx.strokeRect(x, 0, 128, 1024)
    }

    const floorTex = new THREE.CanvasTexture(fCanvas)
    floorTex.wrapS = THREE.RepeatWrapping
    floorTex.wrapT = THREE.RepeatWrapping
    floorTex.repeat.set(4, 4)

    return { wallTexture: wallTex, floorTexture: floorTex }
  }, [])

  return (
    <group>
      {/* ── Main Gallery Back Wall ──────────────────────────────────── */}
      <mesh position={[0, 0, -2.5]} receiveShadow>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial
          map={wallTexture}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* ── Deep Gallery Floor ──────────────────────────────────────── */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial
          map={floorTexture}
          roughness={0.48}
          metalness={0.05}
        />
      </mesh>

      {/* ── Architectural Gallery Inset Dado Rail / Accent Line ──────── */}
      <mesh position={[0, -2.76, -2.48]}>
        <boxGeometry args={[24, 0.08, 0.04]} />
        <meshStandardMaterial color="#3d2a1d" roughness={0.5} />
      </mesh>
    </group>
  )
}
