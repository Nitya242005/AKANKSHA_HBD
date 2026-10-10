import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { SoftShadows, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { WoodTable } from './WoodTable'
import { BirthdayCake } from './BirthdayCake'
import { PhysicalBirthdayCard } from './PhysicalBirthdayCard'
import { PrintedPhoto } from './PrintedPhoto'
import { FloralVase, ScatteredPetals } from './FloralArrangement'
import { CelebrationPetals } from './CelebrationPetals'
import { CinematicCameraController } from './CinematicCameraController'
import { PHOTOS } from '../photoData'

/**
 * BirthdayEnvironment
 * Master 3D scene containing the complete handcrafted environment:
 * - Realistic wood table with linen runner
 * - Handcrafted 2-tier birthday cake with strawberries, roses & candles
 * - Physical folded birthday card that opens smoothly in 3D
 * - 12 real photographs of Akanksha placed naturally across the table
 * - Floral vase with dimensional blooming roses and eucalyptus
 * - Warm cinematic studio lighting (champagne key, warm candle amber, soft ambient)
 * - Restrained celebratory falling petals in finale
 */
export function BirthdayEnvironment({
  currentScene = 1,
  selectedPhoto = null,
  onSelectPhoto,
  cardOpen = false,
  onToggleCard,
  candlesLit = true,
  onBlowCandles,
  pointerOffset = { x: 0, y: 0 },
  onHoverObject,
}) {
  return (
    <Canvas
      shadows
      dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      camera={{ position: [0.3, 1.8, 3.2], fov: 46, near: 0.1, far: 25 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <CinematicCameraController
        currentScene={currentScene}
        selectedPhoto={selectedPhoto}
        pointerOffset={pointerOffset}
      />

      {/* ── Soft Natural Lighting Palette (Ivory, Champagne, Warm Amber) ── */}
      {/* Soft warm ambient fill */}
      <ambientLight intensity={0.45} color="#fff1e6" />

      {/* Main warm chandelier/lamp key light from upper right */}
      <directionalLight
        position={[3.5, 5.5, 3.0]}
        intensity={1.75}
        color="#fff5ea"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.001}
      />

      {/* Gentle champagne rim fill light */}
      <directionalLight
        position={[-3.0, 3.5, -2.5]}
        intensity={0.65}
        color="#ffe8d6"
      />

      {/* Warm room bounce light */}
      <pointLight
        position={[0, 3.2, 1.5]}
        intensity={0.8}
        color="#fedcbd"
        distance={8}
      />

      {/* Room back wall / background depth (warm neutral architectural wall) */}
      <mesh position={[0, 2.5, -3.2]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial
          color="#201b17"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Soft floor below table */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#14110e" roughness={0.9} />
      </mesh>

      <Suspense fallback={null}>
        {/* Table & Runner */}
        <WoodTable />

        {/* Soft Contact Shadows on Table Surface */}
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.65}
          scale={5.5}
          blur={1.8}
          far={1.5}
          color="#2e1a0d"
        />

        {/* Birthday Cake with Candles (Center top) */}
        <BirthdayCake
          position={[0, 0.02, -0.05]}
          candlesLit={candlesLit}
          onBlowCandles={onBlowCandles}
          onHover={(hovered) => onHoverObject(hovered ? 'Blow out the candles' : null)}
          isFocused={currentScene === 4}
        />

        {/* Physical Birthday Card (Front Center) */}
        <PhysicalBirthdayCard
          position={[-0.36, 0.035, 0.62]}
          rotation={[-Math.PI / 2, 0, 0.05]}
          isOpen={cardOpen}
          onToggleOpen={onToggleCard}
          onHover={(hovered) => onHoverObject(hovered ? (cardOpen ? 'Close card' : 'Open card') : null)}
        />

        {/* Floral Vase (Right side of table) */}
        <FloralVase position={[1.5, 0.02, -0.1]} />

        {/* Scattered Rose Petals on Table */}
        <ScatteredPetals />

        {/* The 12 Photographs of Akanksha */}
        {PHOTOS.map((photo) => (
          <PrintedPhoto
            key={photo.id}
            photo={photo}
            isSelected={selectedPhoto?.id === photo.id}
            onSelect={onSelectPhoto}
            onHover={(p) => onHoverObject(p ? `Photo: ${p.caption}` : null)}
          />
        ))}

        {/* Celebration Petals & Confetti (Scenes 4 & 5) */}
        <CelebrationPetals
          count={75}
          active={currentScene >= 4 || !candlesLit}
        />
      </Suspense>
    </Canvas>
  )
}
