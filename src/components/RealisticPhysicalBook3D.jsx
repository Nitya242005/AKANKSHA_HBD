import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * RealisticPhysicalBook3D
 * A true 3D physical keepsake book with:
 * - Hardcover casing (front cover, back cover, spine hinge) in vibrant coral fabric texture
 * - Spine curvature and visible paper block edges with gold gilding
 * - Front cover hinged at x = 0 spine edge that swings open when book opens
 * - Internal pages turning around spine binding
 * - Front cover text: "Dear Akanksha" embossed with gold leaf & festive typography
 * - "Open your birthday book" callout
 */
export function RealisticPhysicalBook3D({
  currentPage = 0,
  isCoverOpen = false,
  isFlipping = false,
  flipDirection = 'forward',
  onBookClick,
  onCoverClick,
}) {
  const frontCoverHingeRef = useRef()
  const turningLeafRef = useRef()
  const bookGroupRef = useRef()

  // Dimensions of hardcover book: width 1.75, height 2.35, paper stack depth 0.09
  const w = 1.75
  const h = 2.35
  const paperDepth = 0.08
  const coverThickness = 0.016

  // 1. Procedural front cover texture: "Dear Akanksha" with gold embossed border & floral accents
  const frontCoverTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1400
    const ctx = canvas.getContext('2d')

    // Rich vibrant coral-rose textured linen cover
    const grad = ctx.createLinearGradient(0, 0, 1024, 1400)
    grad.addColorStop(0, '#ff3b60')
    grad.addColorStop(0.4, '#ff4d6d')
    grad.addColorStop(0.8, '#ff6b6b')
    grad.addColorStop(1, '#ff8450')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1024, 1400)

    // Subtle fabric / linen weave texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
    for (let x = 0; x < 1024; x += 4) {
      ctx.fillRect(x, 0, 1.5, 1400)
    }
    for (let y = 0; y < 1400; y += 4) {
      ctx.fillRect(0, y, 1024, 1.5)
    }

    // Outer double embossed gilded frame
    ctx.strokeStyle = '#ffe066'
    ctx.lineWidth = 8
    ctx.strokeRect(45, 45, 934, 1310)
    ctx.strokeStyle = 'rgba(255, 224, 102, 0.45)'
    ctx.lineWidth = 2.5
    ctx.strokeRect(65, 65, 894, 1270)

    // Corner decorative filigree stars
    const drawStar = (cx, cy, r) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.fillStyle = '#ffe066'
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4
        const radInner = rad + Math.PI / 8
        ctx.lineTo(Math.cos(rad) * r, Math.sin(rad) * r)
        ctx.lineTo(Math.cos(radInner) * (r * 0.4), Math.sin(radInner) * (r * 0.4))
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    drawStar(95, 95, 18)
    drawStar(929, 95, 18)
    drawStar(95, 1305, 18)
    drawStar(929, 1305, 18)

    // Upper Banner
    ctx.fillStyle = '#ffe066'
    ctx.font = '700 28px "Cinzel", "Playfair Display", serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '6px'
    ctx.fillText('✦ A BIRTHDAY KEEPSAKE ✦', 512, 310)

    // Central Main Title: "Dear Akanksha"
    ctx.shadowColor = 'rgba(89, 13, 34, 0.4)'
    ctx.shadowBlur = 18
    ctx.shadowOffsetY = 6

    ctx.fillStyle = '#ffffff'
    ctx.font = 'italic 700 74px "Playfair Display", Georgia, serif'
    ctx.fillText('Dear', 512, 450)

    ctx.fillStyle = '#ffe066'
    ctx.font = '800 100px "Playfair Display", Georgia, serif'
    ctx.fillText('Akanksha', 512, 570)
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    // Sun divider
    ctx.strokeStyle = '#ffe066'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(340, 635)
    ctx.lineTo(684, 635)
    ctx.stroke()

    // Subtitle
    ctx.fillStyle = '#ffffff'
    ctx.font = '500 32px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('A Celebration of Joy & Cherished Moments', 512, 725)

    // Button callout pill: "Open your birthday book"
    ctx.fillStyle = '#ffe066'
    ctx.beginPath()
    ctx.roundRect(272, 940, 480, 92, 46)
    ctx.fill()

    ctx.fillStyle = '#590d22'
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('Open your birthday book ✦', 512, 998)

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('VOL. 2026 · TAP TO OPEN', 512, 1220)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])

  // 2. Texture for inside of front cover
  const insideCoverTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1400
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fffdf7' // soft warm ivory parchment
    ctx.fillRect(0, 0, 1024, 1400)

    // Gentle floral wallpaper pattern watermark
    ctx.strokeStyle = 'rgba(255, 77, 109, 0.08)'
    ctx.lineWidth = 2
    for (let i = 0; i < 1400; i += 80) {
      ctx.beginPath()
      ctx.arc(512, i, 40, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Border
    ctx.strokeStyle = '#f0c78a'
    ctx.lineWidth = 6
    ctx.strokeRect(60, 60, 904, 1280)

    ctx.fillStyle = '#9c2445'
    ctx.font = 'italic 48px "Playfair Display", Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('From the Heart', 512, 680)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])

  // Animate whole book position and Front Cover Swing around Hinge
  useEffect(() => {
    if (!frontCoverHingeRef.current) return
    const targetAngle = isCoverOpen ? -Math.PI * 0.98 : 0
    gsap.to(frontCoverHingeRef.current.rotation, {
      y: targetAngle,
      duration: isCoverOpen ? 1.25 : 0.9,
      ease: 'power3.inOut',
    })

    // When closed, offset by -w/2 so the closed book is dead-centered in the viewport.
    // When open, spine is at center (x = 0) with two symmetrical pages!
    if (bookGroupRef.current) {
      const targetX = isCoverOpen ? 0 : -w / 2
      gsap.to(bookGroupRef.current.position, {
        x: targetX,
        duration: 1.1,
        ease: 'power2.out',
      })
    }
  }, [isCoverOpen, w])

  // Animate turning internal page during page flips
  useEffect(() => {
    if (!turningLeafRef.current) return
    if (isFlipping) {
      turningLeafRef.current.visible = true
      const startRot = flipDirection === 'forward' ? 0 : -Math.PI * 0.96
      const endRot = flipDirection === 'forward' ? -Math.PI * 0.96 : 0
      turningLeafRef.current.rotation.y = startRot
      gsap.to(turningLeafRef.current.rotation, {
        y: endRot,
        duration: 0.52,
        ease: 'power2.inOut',
        onComplete: () => {
          if (turningLeafRef.current) {
            turningLeafRef.current.visible = false
          }
        },
      })
    } else {
      turningLeafRef.current.visible = false
    }
  }, [isFlipping, flipDirection])

  return (
    <group ref={bookGroupRef} position={[0, 0, 0]}>
      {/* ── BACK COVER (Base lying on right side) ────────────────── */}
      <mesh position={[w / 2, 0, -paperDepth / 2 - coverThickness / 2]} receiveShadow>
        <boxGeometry args={[w + 0.05, h + 0.06, coverThickness]} />
        <meshStandardMaterial
          color="#d9254d" // deep coral red leather/cloth
          roughness={0.65}
          metalness={0.06}
        />
      </mesh>

      {/* ── LEFT HARDCOVER CASING (Base for left page when open) ─── */}
      <mesh
        position={[-w / 2 - 0.02, 0, -paperDepth / 2 - coverThickness / 2]}
        receiveShadow
      >
        <boxGeometry args={[w + 0.05, h + 0.06, coverThickness]} />
        <meshStandardMaterial
          color="#d9254d"
          roughness={0.65}
          metalness={0.06}
        />
      </mesh>

      {/* ── SPINE BACKING CYLINDER (Physical curved spine) ──────── */}
      <mesh
        position={[-0.01, 0, -paperDepth / 2 - coverThickness / 2]}
        receiveShadow
        rotation={[0, 0, 0]}
      >
        <cylinderGeometry
          args={[paperDepth * 0.65, paperDepth * 0.65, h + 0.06, 24, 1, false, Math.PI * 0.5, Math.PI]}
        />
        <meshStandardMaterial
          color="#b51b3f"
          roughness={0.6}
          metalness={0.08}
        />
      </mesh>

      {/* ── GILDED PAPER BLOCK - RIGHT SIDE (Visible trimmed edges) ── */}
      <group position={[w / 2, 0, 0]}>
        {/* Paper slab with gilded top, right, bottom edge sheen */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, paperDepth]} />
          <meshStandardMaterial
            color="#ffeab3" // warm gold gilded sheen on page edges
            roughness={0.42}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* ── PAPER BLOCK - LEFT SIDE (Visible when book is open) ────── */}
      <group position={[-w / 2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, paperDepth]} />
          <meshStandardMaterial
            color="#ffeab3"
            roughness={0.42}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* ── TURNING INTERNAL PAGE LEAF ───────────────────────────── */}
      <group ref={turningLeafRef} position={[0, 0, paperDepth / 2 + 0.002]} visible={false}>
        <group position={[w / 2, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w, h, 0.006]} />
            <meshStandardMaterial
              color="#fffcf5" // creamy paper
              roughness={0.7}
              metalness={0.02}
            />
          </mesh>
        </group>
      </group>

      {/* ── FRONT COVER HINGED FLAP (Hinged at x = 0 spine edge) ──── */}
      <group
        ref={frontCoverHingeRef}
        position={[0, 0, paperDepth / 2 + coverThickness / 2]}
      >
        {/* Everything inside is shifted so rotation pivot is the spine hinge at x = 0 */}
        <group
          position={[w / 2, 0, 0]}
          onClick={(e) => {
            e.stopPropagation()
            if (onCoverClick) onCoverClick()
          }}
        >
          {/* Cover substrate slab with physical thickness */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[w + 0.04, h + 0.05, coverThickness]} />
            <meshStandardMaterial
              color="#e62e55"
              roughness={0.65}
              metalness={0.05}
            />
          </mesh>

          {/* Front Outside Face: "Dear Akanksha" artwork */}
          <mesh
            position={[0, 0, coverThickness / 2 + 0.001]}
            receiveShadow
          >
            <planeGeometry args={[w + 0.035, h + 0.045]} />
            <meshStandardMaterial
              map={frontCoverTexture}
              roughness={0.6}
              metalness={0.08}
            />
          </mesh>

          {/* Front Inside Face: Inside of cover when swung open */}
          <mesh
            position={[0, 0, -coverThickness / 2 - 0.001]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[w + 0.035, h + 0.045]} />
            <meshStandardMaterial
              map={insideCoverTexture}
              roughness={0.7}
              metalness={0.04}
            />
          </mesh>
        </group>
      </group>

      {/* ── CONTACT SHADOWS BENEATH BOOK ─────────────────────────── */}
      <mesh position={[0, 0, -paperDepth / 2 - coverThickness - 0.02]} receiveShadow>
        <planeGeometry args={[w * 3.2, h * 1.6]} />
        <shadowMaterial opacity={0.32} />
      </mesh>
    </group>
  )
}
