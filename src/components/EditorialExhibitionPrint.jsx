import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * EditorialExhibitionPrint
 * Renders an original photograph as a tactile, high-end gallery exhibition print:
 * - Archival museum rag paper backing with bevel & realistic thickness
 * - Clean refined ivory gallery border
 * - Exact aspect ratio preservation (portrait or landscape, never stretched)
 * - Subtle hover lift and gentle tilt
 * - Seamless selection focus transition toward the camera
 * - Dimming of background prints when one is actively inspected
 */
export function EditorialExhibitionPrint({
  photo,
  isSelected = false,
  isAnySelected = false,
  onSelect,
  onHover,
}) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Load Akanksha's original photograph directly from read-only /PHOTOS/
  const texture = useLoader(THREE.TextureLoader, photo.url)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter

  // Sizing based on verified aspect ratio
  const isPortrait = photo.aspect < 1.0
  const photoW = isPortrait ? 0.62 : 1.05
  const photoH = photoW / photo.aspect
  const borderMargin = 0.045
  const bottomExtra = 0.06 // gallery archival plate margin at bottom

  const frameW = photoW + borderMargin * 2
  const frameH = photoH + borderMargin + bottomExtra
  const paperThickness = 0.012

  const [baseX, baseY, baseZ] = photo.position
  const [rotX, rotY, rotZ] = photo.rotation

  // Micro parallax & gentle breathing hover
  useFrame(({ clock }) => {
    if (!meshRef.current || isSelected) return
    const t = clock.getElapsedTime()
    const hoverOffsetZ = hovered ? 0.15 : 0
    const hoverRotY = hovered ? rotY * 0.5 : rotY
    const hoverRotX = hovered ? -0.05 : rotX

    meshRef.current.position.z += (baseZ + hoverOffsetZ - meshRef.current.position.z) * 0.1
    meshRef.current.rotation.y += (hoverRotY - meshRef.current.rotation.y) * 0.1
    meshRef.current.rotation.x += (hoverRotX - meshRef.current.rotation.x) * 0.1
  })

  // GSAP animation when focused/selected into viewer examination view
  useEffect(() => {
    if (!meshRef.current) return
    if (isSelected) {
      // Bring directly in front of the lens with zero rotation
      gsap.to(meshRef.current.position, {
        x: 0,
        y: 0,
        z: 1.6,
        duration: 1.4,
        ease: 'power3.out',
      })
      gsap.to(meshRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.4,
        ease: 'power3.out',
      })
    } else {
      // Return smoothly to exhibition wall position
      gsap.to(meshRef.current.position, {
        x: baseX,
        y: baseY,
        z: baseZ,
        duration: 1.2,
        ease: 'power3.out',
      })
      gsap.to(meshRef.current.rotation, {
        x: rotX,
        y: rotY,
        z: rotZ,
        duration: 1.2,
        ease: 'power3.out',
      })
    }
  }, [isSelected, baseX, baseY, baseZ, rotX, rotY, rotZ])

  // Opacity dimming when another photo is selected
  const isDimmed = isAnySelected && !isSelected

  return (
    <group
      ref={meshRef}
      position={[baseX, baseY, baseZ]}
      rotation={[rotX, rotY, rotZ]}
      scale={photo.scale || 1}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(photo)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        if (onHover) onHover(photo)
      }}
      onPointerOut={() => {
        setHovered(false)
        if (onHover) onHover(null)
      }}
    >
      {/* ── Archival Fine Art Paper Slab ────────────────────────────── */}
      <mesh castShadow receiveShadow position={[0, 0, -paperThickness / 2]}>
        <boxGeometry args={[frameW, frameH, paperThickness]} />
        <meshStandardMaterial
          color="#fdfbf7" // museum warm white 300gsm rag paper
          roughness={0.8}
          metalness={0.02}
          transparent={isDimmed}
          opacity={isDimmed ? 0.35 : 1}
        />
      </mesh>

      {/* ── Original Photograph Surface ─────────────────────────────── */}
      <mesh
        position={[0, (bottomExtra - borderMargin) / 2, paperThickness / 2 + 0.001]}
        receiveShadow
      >
        <planeGeometry args={[photoW, photoH]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.25} // satin photographic luster
          metalness={0.02}
          transparent={isDimmed}
          opacity={isDimmed ? 0.35 : 1}
        />
      </mesh>

      {/* ── Fine Gold Foil Embossed Inner Inset ──────────────────────── */}
      <mesh position={[0, (bottomExtra - borderMargin) / 2, paperThickness / 2 + 0.002]}>
        <ringGeometry
          args={[
            Math.min(photoW, photoH) * 0.492,
            Math.min(photoW, photoH) * 0.495,
            4,
          ]}
        />
        <meshBasicMaterial
          color="#c59b38"
          transparent
          opacity={isDimmed ? 0.15 : 0.45}
        />
      </mesh>

      {/* ── Gallery Title Plate Accent ──────────────────────────────── */}
      <mesh position={[0, -frameH / 2 + 0.035, paperThickness / 2 + 0.001]}>
        <planeGeometry args={[frameW * 0.45, 0.016]} />
        <meshStandardMaterial
          color="#e8dfce"
          roughness={0.7}
          transparent={isDimmed}
          opacity={isDimmed ? 0.2 : 0.85}
        />
      </mesh>
    </group>
  )
}
