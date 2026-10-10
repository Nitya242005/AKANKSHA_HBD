import React, { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * EditorialGreetingCard3D
 * A realistic, tactile physical greeting card:
 * - Handcrafted heavy Italian archival cotton cardstock texture
 * - Embossed hot-stamped gold foil typography and botanical filigree
 * - Visible physical paper thickness with subtle beveling
 * - Real 3D spine hinge opening mechanism (0 to ~160 degrees)
 * - Interior calligraphy revelation: "Happy Birthday, Akanksha"
 * - Dynamic contact shadow shifts as cover swings open
 */
export function EditorialGreetingCard3D({
  isOpen = false,
  onToggleOpen,
  onPointerHover,
  cardPosition = [0, 0, 0],
  cardScale = 1,
}) {
  const frontCoverRef = useRef()
  const groupRef = useRef()

  // Dimensions: 1.15 width x 1.62 height x 0.012 thickness (realistic greeting card proportions)
  const width = 1.15
  const height = 1.62
  const thickness = 0.014

  // Generate high-resolution authentic tactile paper textures
  const { coverDiffuse, innerRightDiffuse, innerLeftDiffuse, paperRoughness } = useMemo(() => {
    // 1. Front Cover (Exterior)
    const cCover = document.createElement('canvas')
    cCover.width = 1200
    cCover.height = 1700
    const ctx1 = cCover.getContext('2d')

    // Warm handmade ivory paper base
    ctx1.fillStyle = '#faf6ef'
    ctx1.fillRect(0, 0, 1200, 1700)

    // Cotton paper fiber micro-texture
    for (let i = 0; i < 9000; i++) {
      ctx1.fillStyle = Math.random() > 0.5 ? 'rgba(215, 200, 180, 0.22)' : 'rgba(255, 255, 255, 0.45)'
      ctx1.fillRect(Math.random() * 1200, Math.random() * 1700, 2 + Math.random() * 3, 1)
    }

    // Embossed gold foil outer deckled border
    ctx1.strokeStyle = '#c59b38'
    ctx1.lineWidth = 14
    ctx1.strokeRect(70, 70, 1060, 1560)

    ctx1.lineWidth = 3
    ctx1.strokeStyle = 'rgba(197, 155, 56, 0.65)'
    ctx1.strokeRect(105, 105, 990, 1490)

    // Hot-stamped gold monogram seal at top
    ctx1.save()
    ctx1.translate(600, 480)
    // Outer laurel wreath/circle
    ctx1.strokeStyle = '#c59b38'
    ctx1.lineWidth = 4
    ctx1.beginPath()
    ctx1.arc(0, 0, 95, 0, Math.PI * 2)
    ctx1.stroke()

    ctx1.lineWidth = 1.5
    ctx1.beginPath()
    ctx1.arc(0, 0, 84, 0, Math.PI * 2)
    ctx1.stroke()

    // Embossed Monogram Initial 'A'
    ctx1.fillStyle = '#b88a38'
    ctx1.font = 'italic 700 88px "Playfair Display", "Georgia", serif'
    ctx1.textAlign = 'center'
    ctx1.textBaseline = 'middle'
    ctx1.fillText('A', 0, 8)
    ctx1.restore()

    // Title invitation text
    ctx1.fillStyle = '#261c14'
    ctx1.font = '600 36px "Cinzel", "Playfair Display", serif'
    ctx1.letterSpacing = '10px'
    ctx1.textAlign = 'center'
    ctx1.fillText('A CELEBRATION FOR', 600, 760)

    ctx1.fillStyle = '#9b2c3a' // muted vintage rose
    ctx1.font = 'italic 700 82px "Playfair Display", "Georgia", serif'
    ctx1.letterSpacing = '2px'
    ctx1.fillText('Akanksha', 600, 875)

    // Gold divider
    ctx1.strokeStyle = '#c59b38'
    ctx1.lineWidth = 2.5
    ctx1.beginPath()
    ctx1.moveTo(380, 930)
    ctx1.lineTo(820, 930)
    ctx1.stroke()

    ctx1.fillStyle = '#7a6250'
    ctx1.font = '400 30px "Playfair Display", "Georgia", serif'
    ctx1.fillText('on your birthday', 600, 990)

    // Bottom subtle prompt call-to-action
    ctx1.fillStyle = '#b88a38'
    ctx1.font = '500 24px "Cinzel", "Inter", sans-serif'
    ctx1.letterSpacing = '5px'
    ctx1.fillText('✦  OPEN YOUR BIRTHDAY SURPRISE  ✦', 600, 1420)

    // 2. Inner Right Page (The Main Message Revealed)
    const cRight = document.createElement('canvas')
    cRight.width = 1200
    cRight.height = 1700
    const ctx2 = cRight.getContext('2d')

    ctx2.fillStyle = '#faf6ef'
    ctx2.fillRect(0, 0, 1200, 1700)

    // Paper fibers
    for (let i = 0; i < 9000; i++) {
      ctx2.fillStyle = Math.random() > 0.5 ? 'rgba(215, 200, 180, 0.22)' : 'rgba(255, 255, 255, 0.45)'
      ctx2.fillRect(Math.random() * 1200, Math.random() * 1700, 2 + Math.random() * 3, 1)
    }

    // Inner gold border
    ctx2.strokeStyle = 'rgba(197, 155, 56, 0.45)'
    ctx2.lineWidth = 3
    ctx2.strokeRect(80, 80, 1040, 1540)

    ctx2.fillStyle = '#b88a38'
    ctx2.font = 'italic 40px "Playfair Display", "Georgia", serif'
    ctx2.textAlign = 'center'
    ctx2.fillText('Dearest', 600, 360)

    ctx2.fillStyle = '#261c14'
    ctx2.font = '700 68px "Playfair Display", "Georgia", serif'
    ctx2.fillText('Happy Birthday,', 600, 480)

    ctx2.fillStyle = '#9b2c3a' // rich rose
    ctx2.font = 'italic 700 88px "Playfair Display", "Georgia", serif'
    ctx2.fillText('Akanksha', 600, 595)

    // Elegant gold botanical ornament
    ctx2.strokeStyle = '#c59b38'
    ctx2.lineWidth = 2
    ctx2.beginPath()
    ctx2.moveTo(340, 670)
    ctx2.lineTo(860, 670)
    ctx2.stroke()

    ctx2.fillStyle = '#b88a38'
    ctx2.font = '26px "Georgia", serif'
    ctx2.fillText('✦  ❀  ✦', 600, 678)

    // Heartfelt birthday thoughts
    ctx2.fillStyle = '#453528'
    ctx2.font = '400 38px "Playfair Display", "Georgia", serif'
    ctx2.fillText('May your year ahead be as beautiful,', 600, 820)
    ctx2.fillText('radiant, and full of joy as you are.', 600, 885)
    ctx2.fillText('Celebrating you and the warmth you bring', 600, 950)
    ctx2.fillText('to every single day.', 600, 1015)

    ctx2.fillStyle = '#8f7762'
    ctx2.font = 'italic 34px "Playfair Display", "Georgia", serif'
    ctx2.fillText('With warmest wishes & love,', 600, 1180)

    // Call to action: Explore Exhibition
    ctx2.fillStyle = '#b88a38'
    ctx2.font = '600 24px "Cinzel", "Inter", sans-serif'
    ctx2.letterSpacing = '4px'
    ctx2.fillText('EXPLORE THE PHOTOGRAPHIC EXHIBITION →', 600, 1460)

    // 3. Inner Left Page (Facing page when opened)
    const cLeft = document.createElement('canvas')
    cLeft.width = 1200
    cLeft.height = 1700
    const ctx3 = cLeft.getContext('2d')

    ctx3.fillStyle = '#f7f2e9'
    ctx3.fillRect(0, 0, 1200, 1700)

    ctx3.strokeStyle = 'rgba(197, 155, 56, 0.35)'
    ctx3.lineWidth = 3
    ctx3.strokeRect(80, 80, 1040, 1540)

    ctx3.fillStyle = '#261c14'
    ctx3.font = '400 32px "Cinzel", serif'
    ctx3.letterSpacing = '6px'
    ctx3.textAlign = 'center'
    ctx3.fillText('A PRIVATE EXHIBITION', 600, 780)

    ctx3.fillStyle = '#b88a38'
    ctx3.font = 'italic 36px "Playfair Display", serif'
    ctx3.fillText('Twelve Cherished Memories', 600, 850)

    ctx3.fillStyle = 'rgba(122, 98, 80, 0.7)'
    ctx3.font = '300 24px "Inter", sans-serif'
    ctx3.letterSpacing = '3px'
    ctx3.fillText('2026 EDITION', 600, 930)

    const tCover = new THREE.CanvasTexture(cCover)
    const tRight = new THREE.CanvasTexture(cRight)
    const tLeft = new THREE.CanvasTexture(cLeft)

    return {
      coverDiffuse: tCover,
      innerRightDiffuse: tRight,
      innerLeftDiffuse: tLeft,
    }
  }, [])

  // Smooth physical opening animation with GSAP
  useEffect(() => {
    if (!frontCoverRef.current) return
    const targetAngle = isOpen ? -Math.PI * 0.92 : 0
    gsap.to(frontCoverRef.current.rotation, {
      y: targetAngle,
      duration: 1.8,
      ease: 'power3.inOut',
    })
  }, [isOpen])

  return (
    <group
      ref={groupRef}
      position={cardPosition}
      scale={cardScale}
      onClick={(e) => {
        e.stopPropagation()
        if (onToggleOpen) onToggleOpen(!isOpen)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (onPointerHover) onPointerHover(isOpen ? 'Click to close card' : 'Click to open birthday card')
      }}
      onPointerOut={() => {
        if (onPointerHover) onPointerHover(null)
      }}
    >
      {/* ── CARD BACK / RIGHT INNER PAGE (Anchored to table/space) ───── */}
      <group position={[width / 2, 0, 0]}>
        {/* Physical Paper Slab */}
        <mesh castShadow receiveShadow position={[0, 0, -thickness / 2]}>
          <boxGeometry args={[width, height, thickness]} />
          <meshStandardMaterial
            color="#faf6ef"
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>

        {/* Inner Right Surface (Displays Revealed Wishes) */}
        <mesh position={[0, 0, 0.001]} receiveShadow>
          <planeGeometry args={[width * 0.98, height * 0.98]} />
          <meshStandardMaterial
            map={innerRightDiffuse}
            roughness={0.7}
            metalness={0.03}
          />
        </mesh>
      </group>

      {/* ── CARD FRONT COVER (Hinged at x = 0 Spine) ────────────────── */}
      <group ref={frontCoverRef} position={[0, 0, thickness / 2]}>
        {/* Cover panel offset so pivot hinge is exactly at spine edge */}
        <group position={[width / 2, 0, 0]}>
          {/* Cover cardstock slab */}
          <mesh castShadow receiveShadow position={[0, 0, thickness / 2]}>
            <boxGeometry args={[width, height, thickness]} />
            <meshStandardMaterial
              color="#faf6ef"
              roughness={0.72}
              metalness={0.02}
            />
          </mesh>

          {/* Exterior Front Surface (Cover Design) */}
          <mesh position={[0, 0, thickness + 0.001]} castShadow receiveShadow>
            <planeGeometry args={[width * 0.98, height * 0.98]} />
            <meshStandardMaterial
              map={coverDiffuse}
              roughness={0.65}
              metalness={0.06}
            />
          </mesh>

          {/* Interior Left Surface (Facing Page when opened) */}
          <mesh position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[width * 0.98, height * 0.98]} />
            <meshStandardMaterial
              map={innerLeftDiffuse}
              roughness={0.7}
              metalness={0.03}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}
