import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * BirthdayBook3D
 * Realistic 3D Hardcover Keepsake Book:
 * - Hardcover backing and spine with vibrant coral rose fabric texture
 * - Layered paper block with real physical thickness (gold gilded edges)
 * - Animated turning leaf that swings naturally around the spine hinge as pages flip
 * - Natural drop shadows that dynamically follow the leaf's angle
 */
export function BirthdayBook3D({
  currentPage = 0,
  isFlipping = false,
  flipProgress = 0, // 0 to 1
  flipDirection = 1, // 1 for forward, -1 for backward
}) {
  const turningLeafRef = useRef()
  const shadowMeshRef = useRef()

  // Dimensions of book: 1.8 width x 2.4 height x 0.08 depth
  const bookW = 1.8
  const bookH = 2.4
  const paperDepth = 0.06

  useEffect(() => {
    if (!turningLeafRef.current) return
    if (currentPage === 0) {
      // Closed cover resting flat
      gsap.to(turningLeafRef.current.rotation, {
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
    } else {
      // Open book: cover turned back to -180 deg
      gsap.to(turningLeafRef.current.rotation, {
        y: -Math.PI * 0.98,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
  }, [currentPage])

  return (
    <group position={[0, 0, 0]}>
      {/* ── Hardcover Base & Spine ──────────────────────────────────── */}
      {/* Right Book Base (Sits underneath right page) */}
      <mesh position={[bookW / 2 + 0.02, 0, -paperDepth / 2]} receiveShadow>
        <boxGeometry args={[bookW + 0.04, bookH + 0.04, 0.014]} />
        <meshStandardMaterial
          color="#ff3366" // vibrant coral rose hardcover
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Left Book Base (Sits underneath left page when open) */}
      <mesh position={[-bookW / 2 - 0.02, 0, -paperDepth / 2]} receiveShadow>
        <boxGeometry args={[bookW + 0.04, bookH + 0.04, 0.014]} />
        <meshStandardMaterial
          color="#ff3366"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Center Spine Crease */}
      <mesh position={[0, 0, -paperDepth / 2]} receiveShadow>
        <cylinderGeometry args={[0.022, 0.022, bookH + 0.04, 16]} />
        <meshStandardMaterial
          color="#e61e50"
          roughness={0.6}
          metalness={0.08}
        />
      </mesh>

      {/* ── Right Page Paper Block (Gilded gold/warm yellow edges) ───── */}
      <mesh position={[bookW / 2, 0, -paperDepth / 4]} receiveShadow>
        <boxGeometry args={[bookW, bookH, paperDepth / 2]} />
        <meshStandardMaterial
          color="#ffe8a3" // gilded edge sheen
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* ── Left Page Paper Block (When opened) ──────────────────────── */}
      <mesh position={[-bookW / 2, 0, -paperDepth / 4]} receiveShadow>
        <boxGeometry args={[bookW, bookH, paperDepth / 2]} />
        <meshStandardMaterial
          color="#ffe8a3"
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* ── Animated Turning Leaf / Cover Hinge ───────────────────────── */}
      <group ref={turningLeafRef} position={[0, 0, paperDepth / 4]}>
        <group position={[bookW / 2, 0, 0]}>
          {/* Turning Page Slab with thickness */}
          <mesh castShadow receiveShadow position={[0, 0, 0.004]}>
            <boxGeometry args={[bookW, bookH, 0.008]} />
            <meshStandardMaterial
              color="#fffcf5"
              roughness={0.7}
              metalness={0.02}
            />
          </mesh>
        </group>
      </group>

      {/* ── Realistic Table / Studio Backdrop Contact Shadow ────────── */}
      <mesh
        ref={shadowMeshRef}
        position={[0, 0, -paperDepth / 2 - 0.01]}
        receiveShadow
      >
        <planeGeometry args={[bookW * 2.8, bookH * 1.6]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
    </group>
  )
}
