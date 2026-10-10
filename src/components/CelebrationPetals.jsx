import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Gentle falling rose petals and warm celebration confetti flakes
 * Activated during Scene 4 & 5
 */
export function CelebrationPetals({ count = 80, active = false }) {
  const meshRef = useRef()

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const list = []
    for (let i = 0; i < count; i++) {
      list.push({
        x: (Math.random() - 0.5) * 4.5,
        y: Math.random() * 4.0 + 1.2,
        z: (Math.random() - 0.5) * 3.5,
        speedY: 0.008 + Math.random() * 0.014,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedRotX: (Math.random() - 0.5) * 0.04,
        speedRotY: (Math.random() - 0.5) * 0.03,
        scale: 0.03 + Math.random() * 0.035,
        colorIndex: Math.floor(Math.random() * 4),
      })
    }
    return list
  }, [count])

  // Colors: blush pink, champagne gold, deep rose, ivory cream
  const colorArray = useMemo(() => {
    const cols = [
      new THREE.Color('#eb8b97'),
      new THREE.Color('#d4af37'),
      new THREE.Color('#c84c5c'),
      new THREE.Color('#fff4e0'),
    ]
    const arr = new Float32Array(count * 3)
    particles.forEach((p, idx) => {
      const c = cols[p.colorIndex]
      arr[idx * 3 + 0] = c.r
      arr[idx * 3 + 1] = c.g
      arr[idx * 3 + 2] = c.b
    })
    return arr
  }, [count, particles])

  useFrame(() => {
    if (!meshRef.current || !active) return

    particles.forEach((p, i) => {
      p.y -= p.speedY
      p.rotX += p.speedRotX
      p.rotY += p.speedRotY

      // Reset when falling below table level
      if (p.y < 0.05) {
        p.y = 3.8 + Math.random() * 0.8
        p.x = (Math.random() - 0.5) * 4.5
        p.z = (Math.random() - 0.5) * 3.5
      }

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ)
      dummy.scale.set(p.scale, p.scale * 0.25, p.scale * 1.6)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  if (!active) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, count]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 8, 8]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </sphereGeometry>
      <meshStandardMaterial
        vertexColors
        roughness={0.65}
        metalness={0.1}
      />
    </instancedMesh>
  )
}
