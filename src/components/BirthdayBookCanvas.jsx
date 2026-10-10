import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { RealisticPhysicalBook3D } from './RealisticPhysicalBook3D'

/**
 * BirthdayBookCanvas
 * Renders the realistic 3D Hardcover Physical Keepsake Book,
 * with real perspective, contact shadows, studio lighting,
 * and spine hinge rotation.
 */
export function BirthdayBookCanvas({
  currentPage = 0,
  isCoverOpen = false,
  isFlipping = false,
  flipDirection = 'forward',
  pointerOffset = { x: 0, y: 0 },
  onCoverClick,
}) {
  // Mobile screens need further camera distance to frame the book proportions
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const cameraZ = isMobile ? 5.4 : 4.4

  return (
    <Canvas
      shadows
      dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      camera={{ position: [0, 0, cameraZ], fov: 38, near: 0.1, far: 20 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ width: '100%', height: '100%', pointerEvents: isCoverOpen ? 'none' : 'auto' }}
    >
      {/* ── Warm Studio Lighting for Vibrant Palette ─────────────────── */}
      <ambientLight intensity={0.7} color="#fff6ed" />

      {/* Main warm key directional light */}
      <directionalLight
        position={[3.2, 4.2, 3.8]}
        intensity={1.9}
        color="#fffaf0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Soft warm fill light */}
      <directionalLight
        position={[-3.2, 2.0, 2.8]}
        intensity={0.75}
        color="#ffe8d6"
      />

      {/* Rim light for paper edge gleam */}
      <directionalLight
        position={[0, -3.5, 2.0]}
        intensity={0.4}
        color="#ffd8a8"
      />

      {/* Top spotlight */}
      <pointLight
        position={[0, 2.8, 2.2]}
        intensity={0.9}
        color="#fff1e0"
        distance={6.5}
      />

      <Suspense fallback={null}>
        {/* Interactive 3D Book */}
        <group
          rotation={[
            pointerOffset.y * 0.04,
            pointerOffset.x * 0.06,
            0,
          ]}
        >
          <RealisticPhysicalBook3D
            currentPage={currentPage}
            isCoverOpen={isCoverOpen}
            isFlipping={isFlipping}
            flipDirection={flipDirection}
            onCoverClick={onCoverClick}
          />
        </group>

        {/* Soft Contact Shadow beneath the book */}
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.42}
          scale={5.8}
          blur={2.2}
          far={1.8}
          color="#380e18"
        />
      </Suspense>
    </Canvas>
  )
}
