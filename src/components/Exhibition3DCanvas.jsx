import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { EditorialGreetingCard3D } from './EditorialGreetingCard3D'
import { EditorialExhibitionPrint } from './EditorialExhibitionPrint'
import { EditorialExhibitionRoom } from './EditorialExhibitionRoom'
import { ExhibitionCameraController } from './ExhibitionCameraController'
import { GALLERY_SUITES } from '../galleryData'

/**
 * Master 3D Experience Environment
 * Exclusively focused on the physical greeting card & photographic memory exhibition.
 * No cake. No artificial 3D models. Authentic materials, subtle gallery lighting, and real photography.
 */
export function Exhibition3DCanvas({
  currentView = 'card', // 'card', 'gallery', 'photo', 'reveal'
  activeSuiteIndex = 0,
  cardOpen = false,
  onToggleCard,
  selectedPhoto = null,
  onSelectPhoto,
  onHoverObject,
  pointerOffset = { x: 0, y: 0 },
}) {
  const currentSuite = GALLERY_SUITES[activeSuiteIndex] || GALLERY_SUITES[0]

  return (
    <Canvas
      shadows
      dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      camera={{ position: [0, 0, 2.9], fov: 42, near: 0.1, far: 30 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <ExhibitionCameraController
        currentView={currentView}
        selectedPhoto={selectedPhoto}
        pointerOffset={pointerOffset}
      />

      {/* ── Refined Museum Gallery Lighting ─────────────────────────── */}
      {/* Soft warm ivory ambient wash */}
      <ambientLight intensity={0.48} color="#fff6ea" />

      {/* Key warm picture spotlight from top-right */}
      <directionalLight
        position={[3.2, 4.5, 4.0]}
        intensity={1.8}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.001}
      />

      {/* Gentle champagne bounce light */}
      <directionalLight
        position={[-3.5, 2.0, 2.0]}
        intensity={0.6}
        color="#fcefdc"
      />

      {/* Soft overhead warm accent light */}
      <pointLight
        position={[0, 2.8, 1.8]}
        intensity={0.9}
        color="#ffecd4"
        distance={7}
      />

      <Suspense fallback={null}>
        {/* Exhibition Room Backdrop & Floor */}
        <EditorialExhibitionRoom />

        {/* ── 1. The Physical Greeting Card ─────────────────────────── */}
        {/* Visible during 'card' view, smoothly centered */}
        {currentView === 'card' && (
          <group position={[cardOpen ? -0.58 : -0.58, 0, 0]}>
            <EditorialGreetingCard3D
              isOpen={cardOpen}
              onToggleOpen={onToggleCard}
              onPointerHover={onHoverObject}
            />

            {/* Dynamic Contact Shadows for card */}
            <ContactShadows
              position={[cardOpen ? 0 : 0.58, -0.85, 0]}
              opacity={0.55}
              scale={3.5}
              blur={2.0}
              far={1.2}
              color="#1a1109"
            />
          </group>
        )}

        {/* ── 2. The Photographic Exhibition Gallery ─────────────────── */}
        {/* Active during 'gallery', 'photo', and 'reveal' views */}
        {currentView !== 'card' && (
          <group position={[0, 0, 0]}>
            {/* Render the curated suite of photos */}
            {currentSuite.photos.map((photo) => (
              <EditorialExhibitionPrint
                key={photo.id}
                photo={photo}
                isSelected={selectedPhoto?.id === photo.id}
                isAnySelected={!!selectedPhoto}
                onSelect={onSelectPhoto}
                onHover={(p) => onHoverObject(p ? `View: ${p.title}` : null)}
              />
            ))}

            {/* Subtle soft contact shadows beneath floating gallery prints */}
            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={0.4}
              scale={8.0}
              blur={2.4}
              far={3.0}
              color="#120c06"
            />
          </group>
        )}
      </Suspense>
    </Canvas>
  )
}
