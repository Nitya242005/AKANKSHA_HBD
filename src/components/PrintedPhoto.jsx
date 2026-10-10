import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * PrintedPhoto
 * Renders Akanksha's real photograph as a tangible printed photographic print
 * with paper cardstock thickness, fine Polaroid-style border, subtle natural tilt,
 * hover elevation & slight rotation, and smooth camera target focus.
 */
export function PrintedPhoto({
  photo,
  isSelected,
  onSelect,
  onHover,
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Load the actual photograph directly from read-only /PHOTOS/
  const texture = useLoader(THREE.TextureLoader, photo.url)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter

  // Aspect ratio preservation
  const isPortrait = photo.aspect < 1.0
  const photoW = isPortrait ? 0.44 : 0.64
  const photoH = isPortrait ? 0.44 / photo.aspect : 0.64 / photo.aspect
  const borderMargin = 0.035
  const bottomExtra = 0.07 // classic Polaroid aesthetic bottom note margin

  const frameW = photoW + borderMargin * 2
  const frameH = photoH + borderMargin + bottomExtra
  const paperThickness = 0.008

  // Base tabletop position and rotation
  const [baseX, baseY, baseZ] = photo.tablePos
  const [rotX, rotY, rotZ] = photo.tableRot

  // Hover elevation effect
  useFrame(() => {
    if (!groupRef.current) return
    if (!isSelected) {
      const targetY = hovered ? baseY + 0.08 : baseY
      const targetRotX = hovered ? rotX - 0.15 : rotX
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.12
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.12
    }
  })

  // GSAP animation when focused/selected
  useEffect(() => {
    if (!groupRef.current) return
    if (isSelected) {
      // Bring up to viewer eye level
      gsap.to(groupRef.current.position, {
        x: 0,
        y: 1.15,
        z: 2.1,
        duration: 1.2,
        ease: 'power3.out',
      })
      gsap.to(groupRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: 'power3.out',
      })
    } else {
      // Return to natural spot on the table
      gsap.to(groupRef.current.position, {
        x: baseX,
        y: baseY,
        z: baseZ,
        duration: 1.1,
        ease: 'power3.out',
      })
      gsap.to(groupRef.current.rotation, {
        x: rotX,
        y: rotY,
        z: rotZ,
        duration: 1.1,
        ease: 'power3.out',
      })
    }
  }, [isSelected, baseX, baseY, baseZ, rotX, rotY, rotZ])

  return (
    <group
      ref={groupRef}
      position={[baseX, baseY, baseZ]}
      rotation={[rotX, rotY, rotZ]}
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
      {/* ── Thick Ivory Photo Paper Backing & Borders ─────────────────── */}
      <mesh castShadow receiveShadow position={[0, 0, -paperThickness / 2]}>
        <boxGeometry args={[frameW, frameH, paperThickness]} />
        <meshStandardMaterial
          color="#fbf7ef" // heavy archival photographic paper
          roughness={0.7}
          metalness={0.03}
        />
      </mesh>

      {/* ── Real Photograph Surface ─────────────────────────────────── */}
      <mesh
        position={[
          0,
          (bottomExtra - borderMargin) / 2,
          paperThickness / 2 + 0.001,
        ]}
      >
        <planeGeometry args={[photoW, photoH]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.25} // gentle semi-gloss photo sheen
          metalness={0.02}
        />
      </mesh>

      {/* Subtle fine gold embossed outline on the photo border */}
      <mesh
        position={[
          0,
          (bottomExtra - borderMargin) / 2,
          paperThickness / 2 + 0.002,
        ]}
      >
        <ringGeometry
          args={[Math.min(photoW, photoH) * 0.49, Math.min(photoW, photoH) * 0.495, 4]}
        />
        <meshBasicMaterial color="#dfc384" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
