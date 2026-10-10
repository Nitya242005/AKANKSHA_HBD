/**
 * TechTestScene.jsx
 *
 * PURPOSE: Technical stack validation ONLY.
 * This is NOT the birthday website.
 * Verifies: React Three Fiber · Three.js · WebGL · PBR · Shadows · Animation · Lighting
 *
 * DO NOT use Akanksha's photos here.
 * DO NOT add birthday decorations.
 */

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import * as THREE from 'three'

/* ─── Animated PBR sphere ─────────────────────────────────────────── */
function AnimatedSphere() {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4
      meshRef.current.rotation.x = Math.sin(t * 0.25) * 0.15
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.6
    }
  })

  return (
    <group>
      {/* Outer glass/transmissive shell */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef} castShadow receiveShadow>
          <icosahedronGeometry args={[1.1, 4]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.3}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.25}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#9b59f5"
            roughness={0}
            metalness={0}
          />
        </mesh>

        {/* Inner metallic core */}
        <mesh ref={innerRef} castShadow>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#c084fc"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>
      </Float>

      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]} castShadow>
        <torusGeometry args={[1.5, 0.035, 16, 120]} />
        <meshStandardMaterial
          color="#f0abfc"
          metalness={1}
          roughness={0.1}
          emissive="#7c3aed"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  )
}

/* ─── Ground plane with grid ──────────────────────────────────────── */
function Ground() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.9, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a0a12"
          metalness={0.2}
          roughness={0.85}
        />
      </mesh>
      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.55}
        scale={8}
        blur={2.4}
        far={5}
        color="#7c3aed"
      />
    </>
  )
}

/* ─── Main scene export ───────────────────────────────────────────── */
export default function TechTestScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.8, 5], fov: 50, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight position={[-3, 2, -2]} intensity={1.8} color="#9b59f5" />
      <pointLight position={[3, -1, 2]}  intensity={1.2} color="#f0abfc" />

      {/* HDR environment for reflections */}
      <Environment preset="city" />

      <AnimatedSphere />
      <Ground />

      {/* Orbit controls — limited for comfort */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  )
}
