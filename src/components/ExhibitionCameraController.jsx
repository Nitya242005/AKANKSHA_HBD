import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Camera choreographer for the photographic exhibition:
 * - Card View (Center stage, intimate close perspective)
 * - Gallery Suite Views (Wide expansive composition with gentle depth)
 * - Focused Photo View (Dolly in close with minimal distortion)
 * - Final Keepsake View (Poetic wide frame)
 */
export function ExhibitionCameraController({
  currentView = 'card', // 'card', 'gallery', 'photo', 'reveal'
  selectedPhoto = null,
  pointerOffset = { x: 0, y: 0 },
}) {
  const { camera } = useThree()
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    let targetPos = [0, 0, 3.4]
    let targetTarget = [0, 0, 0]
    let targetFov = 44

    if (currentView === 'card') {
      targetPos = [0.0, 0.0, 2.9]
      targetTarget = [0.0, 0.0, 0.0]
      targetFov = 42
    } else if (currentView === 'gallery') {
      targetPos = [0.0, 0.0, 4.2]
      targetTarget = [0.0, 0.0, 0.0]
      targetFov = 48
    } else if (currentView === 'photo' && selectedPhoto) {
      targetPos = [0.0, 0.0, 2.7]
      targetTarget = [0.0, 0.0, 1.6]
      targetFov = 38
    } else if (currentView === 'reveal') {
      targetPos = [0.0, 0.1, 4.4]
      targetTarget = [0.0, 0.0, 0.0]
      targetFov = 46
    }

    gsap.to(camera.position, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1.8,
      ease: 'power3.inOut',
    })

    gsap.to(targetLookAt.current, {
      x: targetTarget[0],
      y: targetTarget[1],
      z: targetTarget[2],
      duration: 1.8,
      ease: 'power3.inOut',
    })

    gsap.to(camera, {
      fov: targetFov,
      duration: 1.8,
      ease: 'power3.inOut',
      onUpdate: () => camera.updateProjectionMatrix(),
    })
  }, [currentView, selectedPhoto, camera])

  // Restrained pointer parallax
  useFrame(() => {
    const px = pointerOffset.x * 0.15
    const py = pointerOffset.y * 0.1

    camera.position.x += (px - camera.position.x + (currentView === 'gallery' ? 0 : 0)) * 0.02
    camera.position.y += (py - camera.position.y) * 0.02

    currentLookAt.current.lerp(targetLookAt.current, 0.06)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
