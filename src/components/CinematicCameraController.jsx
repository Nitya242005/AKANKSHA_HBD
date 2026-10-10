import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Camera targets and coordinates for each scene
 * Carefully composed cinematic perspectives
 */
export const CAMERA_CONFIGS = {
  // Scene 1: Arrival - cinematic warm angled view taking in the table ambiance
  1: {
    pos: [0.3, 1.8, 3.2],
    target: [0, 0.45, 0.3],
    fov: 46,
  },
  // Scene 2: The Card - intimate close angled view looking right down at the card
  2: {
    pos: [0.0, 1.25, 1.55],
    target: [0.35, 0.08, 0.6],
    fov: 42,
  },
  // Scene 3: Memories - sweeping view positioned above the scattered photos
  3: {
    pos: [0.0, 2.2, 2.5],
    target: [0.0, 0.1, 0.4],
    fov: 50,
  },
  // Scene 4: Birthday Cake - close warm view centered on the lit cake and candles
  4: {
    pos: [0.0, 1.4, 1.8],
    target: [0.0, 0.72, 0.0],
    fov: 44,
  },
  // Scene 5: Final Reveal - magnificent wide master shot capturing cake, card, photos & flowers
  5: {
    pos: [0.0, 1.9, 3.4],
    target: [0.0, 0.5, 0.2],
    fov: 48,
  },
}

export function CinematicCameraController({
  currentScene = 1,
  selectedPhoto = null,
  pointerOffset = { x: 0, y: 0 },
}) {
  const { camera } = useThree()
  const targetLookAt = useRef(new THREE.Vector3(0, 0.45, 0.3))
  const currentLookAt = useRef(new THREE.Vector3(0, 0.45, 0.3))

  // Handle scene transitions via GSAP
  useEffect(() => {
    let cfg = CAMERA_CONFIGS[currentScene] || CAMERA_CONFIGS[1]

    // If an individual photo is selected in Scene 3
    if (selectedPhoto) {
      cfg = {
        pos: [0.0, 1.15, 2.8],
        target: [0.0, 1.15, 2.1],
        fov: 38,
      }
    }

    gsap.to(camera.position, {
      x: cfg.pos[0],
      y: cfg.pos[1],
      z: cfg.pos[2],
      duration: 2.2,
      ease: 'power3.inOut',
    })

    gsap.to(targetLookAt.current, {
      x: cfg.target[0],
      y: cfg.target[1],
      z: cfg.target[2],
      duration: 2.2,
      ease: 'power3.inOut',
    })

    gsap.to(camera, {
      fov: cfg.fov,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => camera.updateProjectionMatrix(),
    })
  }, [currentScene, selectedPhoto, camera])

  // Subtle interactive parallax from cursor/touch pointer offset
  useFrame(() => {
    // Parallax damping
    const px = pointerOffset.x * 0.12
    const py = pointerOffset.y * 0.08

    camera.position.x += (pointerOffset.x * 0.1 - (camera.position.x - (CAMERA_CONFIGS[currentScene]?.pos[0] || 0))) * 0.02
    camera.position.y += (pointerOffset.y * 0.06 - (camera.position.y - (CAMERA_CONFIGS[currentScene]?.pos[1] || 1.8))) * 0.02

    currentLookAt.current.lerp(targetLookAt.current, 0.06)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
