import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * PhysicalBirthdayCard
 * - Realistic folded physical card with cream paper texture, gold foil accents
 * - Fully animated opening in true 3D space: front cover swings 150 degrees open
 * - Interior displays "Happy Birthday, Akanksha" in calligraphy with delicate floral accents
 */
export function PhysicalBirthdayCard({
  position = [0, 0.04, 0.6],
  rotation = [-Math.PI / 2, 0, 0],
  isOpen = false,
  onToggleOpen,
  onHover,
}) {
  const frontFlapRef = useRef()
  const [internalOpen, setInternalOpen] = useState(isOpen)

  // Procedurally generate high-res realistic card paper textures
  const { outerCoverTexture, innerRightTexture, innerLeftTexture } = useMemo(() => {
    // 1. Outer Cover (Front)
    const c1 = document.createElement('canvas')
    c1.width = 1024
    c1.height = 1400
    const ctx1 = c1.getContext('2d')

    // Rich cream linen textured cardstock
    ctx1.fillStyle = '#faf5ee'
    ctx1.fillRect(0, 0, 1024, 1400)

    // Paper fibers / grain
    for (let i = 0; i < 4000; i++) {
      ctx1.fillStyle = Math.random() > 0.5 ? 'rgba(210, 195, 175, 0.25)' : 'rgba(255, 255, 255, 0.4)'
      ctx1.fillRect(Math.random() * 1024, Math.random() * 1400, 2 + Math.random() * 3, 1)
    }

    // Elegant gold embossed double border
    ctx1.strokeStyle = '#cda250'
    ctx1.lineWidth = 14
    ctx1.strokeRect(60, 60, 904, 1280)
    ctx1.lineWidth = 4
    ctx1.strokeRect(95, 95, 834, 1210)

    // Corner filigree accents
    const drawCorner = (x, y, flipX, flipY) => {
      ctx1.save()
      ctx1.translate(x, y)
      ctx1.scale(flipX, flipY)
      ctx1.strokeStyle = '#b88a38'
      ctx1.lineWidth = 4
      ctx1.beginPath()
      ctx1.arc(0, 0, 45, 0, Math.PI / 2)
      ctx1.stroke()
      ctx1.restore()
    }
    drawCorner(95, 95, 1, 1)
    drawCorner(929, 95, -1, 1)
    drawCorner(95, 1305, 1, -1)
    drawCorner(929, 1305, -1, -1)

    // Gold floral medallion emblem in center
    ctx1.fillStyle = '#b88a38'
    ctx1.beginPath()
    ctx1.arc(512, 540, 70, 0, Math.PI * 2)
    ctx1.fill()

    ctx1.fillStyle = '#faf5ee'
    ctx1.beginPath()
    ctx1.arc(512, 540, 58, 0, Math.PI * 2)
    ctx1.fill()

    ctx1.fillStyle = '#b88a38'
    ctx1.font = 'italic 52px "Playfair Display", "Georgia", serif'
    ctx1.textAlign = 'center'
    ctx1.fillText('A', 512, 558)

    // Elegant typography on front cover
    ctx1.fillStyle = '#2d2218'
    ctx1.font = '400 38px "Cinzel", "Playfair Display", "Georgia", serif'
    ctx1.letterSpacing = '6px'
    ctx1.fillText('FOR SOMEONE SPECIAL', 512, 750)

    ctx1.strokeStyle = '#d4af37'
    ctx1.lineWidth = 2
    ctx1.beginPath()
    ctx1.moveTo(340, 780)
    ctx1.lineTo(684, 780)
    ctx1.stroke()

    ctx1.fillStyle = '#7a6858'
    ctx1.font = 'italic 30px "Playfair Display", "Georgia", serif'
    ctx1.fillText('on your birthday', 512, 830)

    ctx1.fillStyle = '#aa8944'
    ctx1.font = '24px "Inter", sans-serif'
    ctx1.fillText('✦  CLICK TO OPEN  ✦', 512, 1140)

    // 2. Inner Right Side (The Main Message)
    const c2 = document.createElement('canvas')
    c2.width = 1024
    c2.height = 1400
    const ctx2 = c2.getContext('2d')

    ctx2.fillStyle = '#faf5ee'
    ctx2.fillRect(0, 0, 1024, 1400)

    // Paper grain
    for (let i = 0; i < 4000; i++) {
      ctx2.fillStyle = Math.random() > 0.5 ? 'rgba(210, 195, 175, 0.25)' : 'rgba(255, 255, 255, 0.4)'
      ctx2.fillRect(Math.random() * 1024, Math.random() * 1400, 2 + Math.random() * 3, 1)
    }

    // Inner gold border
    ctx2.strokeStyle = '#dfc384'
    ctx2.lineWidth = 4
    ctx2.strokeRect(60, 60, 904, 1280)

    // Gold foil header
    ctx2.fillStyle = '#b88a38'
    ctx2.font = 'italic 46px "Playfair Display", "Georgia", serif'
    ctx2.textAlign = 'center'
    ctx2.fillText('Dearest', 512, 340)

    // Golden "Happy Birthday, Akanksha"
    ctx2.fillStyle = '#221810'
    ctx2.font = '700 68px "Playfair Display", "Georgia", serif'
    ctx2.fillText('Happy Birthday,', 512, 470)

    ctx2.fillStyle = '#9b2c3a' // warm rich rose velvet tone
    ctx2.font = 'italic 700 86px "Playfair Display", "Georgia", serif'
    ctx2.fillText('Akanksha', 512, 580)

    // Decorative botanical divider
    ctx2.strokeStyle = '#d4af37'
    ctx2.lineWidth = 2.5
    ctx2.beginPath()
    ctx2.moveTo(280, 650)
    ctx2.lineTo(744, 650)
    ctx2.stroke()

    ctx2.fillStyle = '#b88a38'
    ctx2.font = '28px "Georgia", serif'
    ctx2.fillText('❀  ✦  ❀', 512, 658)

    // Warm elegant birthday wishes (clean, tasteful, respecting prompt guidelines)
    ctx2.fillStyle = '#4a3d31'
    ctx2.font = '400 36px "Playfair Display", "Georgia", serif'
    ctx2.fillText('May your year ahead be as beautiful,', 512, 790)
    ctx2.fillText('bright, and radiant as your smile.', 512, 850)
    ctx2.fillText('Celebrating you and the joy you bring.', 512, 910)

    ctx2.fillStyle = '#8f7762'
    ctx2.font = 'italic 32px "Playfair Display", "Georgia", serif'
    ctx2.fillText('With warmest wishes & love,', 512, 1070)

    // 3. Inner Left Side (Card Inside Left - floral illustration)
    const c3 = document.createElement('canvas')
    c3.width = 1024
    c3.height = 1400
    const ctx3 = c3.getContext('2d')
    ctx3.fillStyle = '#f7f1e7'
    ctx3.fillRect(0, 0, 1024, 1400)
    ctx3.strokeStyle = '#dfc384'
    ctx3.lineWidth = 4
    ctx3.strokeRect(60, 60, 904, 1280)

    ctx3.fillStyle = '#c2a88f'
    ctx3.font = 'italic 34px "Playfair Display", "Georgia", serif'
    ctx3.textAlign = 'center'
    ctx3.fillText('A day to celebrate you', 512, 680)
    ctx3.fillStyle = '#b88a38'
    ctx3.fillText('✦ ✦ ✦', 512, 740)

    const t1 = new THREE.CanvasTexture(c1)
    const t2 = new THREE.CanvasTexture(c2)
    const t3 = new THREE.CanvasTexture(c3)

    return {
      outerCoverTexture: t1,
      innerRightTexture: t2,
      innerLeftTexture: t3,
    }
  }, [])

  useEffect(() => {
    setInternalOpen(isOpen)
  }, [isOpen])

  // GSAP animation for smooth physical opening & closing
  useEffect(() => {
    if (!frontFlapRef.current) return
    const targetRotY = internalOpen ? -Math.PI * 0.88 : 0
    gsap.to(frontFlapRef.current.rotation, {
      y: targetRotY,
      duration: 1.6,
      ease: 'power3.inOut',
    })
  }, [internalOpen])

  const handleClick = (e) => {
    e.stopPropagation()
    const next = !internalOpen
    setInternalOpen(next)
    if (onToggleOpen) onToggleOpen(next)
  }

  // Dimensions: 0.72 width, 1.0 height, card thickness 0.006
  const w = 0.72
  const h = 1.0
  const d = 0.006

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (onHover) onHover(true)
      }}
      onPointerOut={() => {
        if (onHover) onHover(false)
      }}
    >
      {/* ── CARD BACK/BASE (Sits on table, Right page when open) ───────── */}
      <group position={[w / 2, 0, 0]}>
        {/* Paper slab */}
        <mesh castShadow receiveShadow position={[0, d / 2, 0]}>
          <boxGeometry args={[w, d, h]} />
          <meshStandardMaterial
            color="#faf5ee"
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>

        {/* Top face showing Inner Right message when opened */}
        <mesh position={[0, d + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.98, h * 0.98]} />
          <meshStandardMaterial
            map={innerRightTexture}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* ── CARD FRONT COVER (Hinged at x = 0 spine) ────────────────── */}
      <group ref={frontFlapRef} position={[0, d * 1.5, 0]}>
        {/* Shifted so rotation pivot is the left hinge spine */}
        <group position={[w / 2, 0, 0]}>
          {/* Cardstock cover slab */}
          <mesh castShadow receiveShadow position={[0, d / 2, 0]}>
            <boxGeometry args={[w, d, h]} />
            <meshStandardMaterial
              color="#faf5ee"
              roughness={0.72}
              metalness={0.02}
            />
          </mesh>

          {/* Outside face (shows when closed) */}
          <mesh position={[0, d + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.98, h * 0.98]} />
            <meshStandardMaterial
              map={outerCoverTexture}
              roughness={0.65}
              metalness={0.08}
            />
          </mesh>

          {/* Inside left face (shows when opened upside down / rotated) */}
          <mesh position={[0, -0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.98, h * 0.98]} />
            <meshStandardMaterial
              map={innerLeftTexture}
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
        </group>
      </group>

      {/* Elegant satin ribbon under the card */}
      <mesh position={[w / 2, -0.002, 0]} receiveShadow>
        <boxGeometry args={[w * 1.25, 0.002, 0.08]} />
        <meshStandardMaterial color="#ba2424" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  )
}
