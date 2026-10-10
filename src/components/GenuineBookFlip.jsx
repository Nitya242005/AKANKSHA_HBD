import React, { useEffect, useRef, useState, useCallback } from 'react'
import { PageFlip } from 'page-flip'
import { QuillWritingWish } from './QuillWritingWish'
import { BOOK_PAGES } from '../bookContent'

/**
 * GenuineBookFlip
 * A true physical page-flip book powered by the PageFlip engine.
 * - Genuine paper physics: bending, curling, 3D shadows, individual page turning
 * - Left and right page binding around spine
 * - Hardcover front & back with realistic board thickness & gilded edges
 * - Photorealistic peacock quill writing animation on wishes
 * - Fully responsive with portrait/landscape modes
 */
export function GenuineBookFlip({
  currentPage = 0,
  onPageChange,
  isMuted = false,
  playPageSound,
}) {
  const bookElRef = useRef(null)
  const pageFlipRef = useRef(null)
  const [activePageIndex, setActivePageIndex] = useState(currentPage)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize PageFlip instance
  useEffect(() => {
    if (!bookElRef.current) return

    const screenW = window.innerWidth
    const screenH = window.innerHeight

    // Calculate realistic physical page dimensions based on viewport
    let pageWidth, pageHeight

    if (screenW < 768) {
      // Mobile single portrait page: full fit with natural margins
      pageWidth = Math.min(screenW - 20, 420)
      pageHeight = Math.min(screenH - 130, 680)
    } else {
      // Desktop two-page spread: realistic ratio
      pageWidth = Math.min((screenW - 100) / 2, 490)
      pageHeight = Math.min(screenH - 160, 680)
    }

    const pageFlip = new PageFlip(bookElRef.current, {
      width: pageWidth,
      height: pageHeight,
      size: 'stretch',
      minWidth: 300,
      maxWidth: 600,
      minHeight: 440,
      maxHeight: 820,
      drawShadow: true,
      flippingTime: 850,
      usePortrait: true,
      startPage: currentPage,
      startZIndex: 10,
      autoSize: true,
      maxShadowOpacity: 0.12,
      showCover: true,
      mobileScrollSupport: false,
      startDirection: 'right',
    })

    const pageElements = bookElRef.current.querySelectorAll('.st-page')
    console.log('GenuineBookFlip found pages:', pageElements.length, bookElRef.current)

    if (pageElements.length === 0) {
      console.warn('GenuineBookFlip: No .st-page elements found!')
      return
    }

    pageFlip.loadFromHTML(pageElements)
    pageFlipRef.current = pageFlip

    pageFlip.on('flip', (e) => {
      setActivePageIndex(e.data)
      if (onPageChange) onPageChange(e.data)
    })

    return () => {
      try {
        if (pageFlipRef.current) {
          // Avoid removing bookElRef element when React StrictMode runs unmount
          pageFlipRef.current = null
        }
      } catch {
        // Ignore destroy error
      }
    }
  }, [isMobile])

  // Programmatic page navigation from external controls
  useEffect(() => {
    if (pageFlipRef.current && pageFlipRef.current.getCurrentPageIndex() !== currentPage) {
      try {
        pageFlipRef.current.flip(currentPage)
      } catch {
        // Ignore flip error
      }
    }
  }, [currentPage])

  return (
    <div className="genuine-book-viewport">
      {/* 3D Physical Book Binding Stack Drop Shadow */}
      <div className="book-spine-backdrop" />

      {/* PageFlip Container */}
      <div className="st-book-container" ref={bookElRef}>
        {/* ── PAGE 1: Hardcover Front Cover ─────────────────────── */}
        <div className="st-page hard cover-front" data-density="hard">
          <div className="cover-front-inner">
            <div className="cover-fabric-pattern" />
            <div className="cover-gold-border">
              <span className="cover-corner tl">✦</span>
              <span className="cover-corner tr">✦</span>
              <span className="cover-corner bl">✦</span>
              <span className="cover-corner br">✦</span>

              <div className="cover-title-group">
                <h2 className="cover-dear-text">Dear</h2>
                <h1 className="cover-name-text">Akanksha</h1>
                <div className="cover-sun-divider">
                  <span className="cover-line" />
                  <span className="cover-star">★</span>
                  <span className="cover-line" />
                </div>
                <p className="cover-subtitle-text">
                  A Kept Promise of Joy, Warm Wishes &amp; Cherished Moments
                </p>
                <div className="cover-btn-spacer" />
                <button
                  type="button"
                  className="cover-tap-btn"
                  onClick={() => pageFlipRef.current && pageFlipRef.current.flipNext()}
                >
                  Open your birthday book ✦
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── PAGE 2: Inside Left Parchment (Dedication) ───────── */}
        <div className="st-page page-dedication" data-density="soft">
          <div className="page-sheet-inner dedication-sheet">
            <div className="page-paper-grain" />
            <div className="dedication-content">
              <span className="dedication-emblem">❀</span>
              <h3 className="dedication-title">Warm and personal</h3>
              <p className="dedication-verse">
                &ldquo;A little book of wishes, a lifetime of happiness, and countless beautiful moments waiting for you.&rdquo;
              </p>
              <div className="dedication-divider" />
              <p className="dedication-note">
                Turn the page to begin your celebration.
              </p>
            </div>
          </div>
        </div>

        {/* ── PAGES 3–7: Birthday Wishes & Photographs ─────────── */}
        {BOOK_PAGES.slice(1, 7).map((page, idx) => (
          <div
            key={page.pageIndex}
            className={`st-page standard-story-page page-${idx + 2}`}
            data-density="soft"
          >
            <div className="page-sheet-inner" style={{ backgroundColor: page.theme.bg }}>
              <div className="page-paper-grain" />

              {/* Page Header */}
              <div className="page-header-ribbon">
                <span className="page-badge-label" style={{ color: page.theme.textTitle }}>
                  {page.badge}
                </span>
                <span className="page-ribbon-gem" style={{ color: page.theme.accent }}>
                  ♥
                </span>
              </div>

              {/* Page Content: Photo First, Wish Below */}
              <div className="page-body-scrollable">
                {/* 1. Photograph Section */}
                {page.pageType === 'friendship_scrapbook' ? (
                  <div className="scrapbook-dual-wrap">
                    <div className="scrap-frame frame-1">
                      <img
                        src={page.photos[0].url}
                        alt="Gentle portrait"
                        className="scrap-img"
                        loading="lazy"
                      />
                      <span className="scrap-caption">{page.photos[0].caption}</span>
                    </div>
                    <div className="scrap-frame frame-2">
                      <img
                        src={page.photos[1].url}
                        alt="Friends together"
                        className="scrap-img"
                        loading="lazy"
                      />
                      <span className="scrap-caption">{page.photos[1].caption}</span>
                    </div>
                  </div>
                ) : (
                  <div className="single-photo-card">
                    <div className="photo-mat-border">
                      <img
                        src={page.photos[0].url}
                        alt={page.title}
                        className="photo-actual-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Birthday Wish Section with Moving Peacock Quill */}
                <div className="wish-story-block">
                  <h2 className="wish-title-heading" style={{ color: page.theme.textTitle }}>
                    {page.title}
                  </h2>
                  <div
                    className="wish-gold-rule"
                    style={{ background: page.theme.accent }}
                  />

                  {/* Peacock Feather Quill Animated Wish */}
                  <QuillWritingWish
                    text={page.wish}
                    className="wish-ink-render"
                    style={{ color: page.theme.textBody }}
                    activeKey={`page-${page.pageIndex}-${activePageIndex}`}
                  />
                </div>
              </div>

              {/* Page Footer Folio */}
              <div className="page-footer-folio">
                <span>Page {page.pageIndex + 1} of 8</span>
              </div>
            </div>
          </div>
        ))}

        {/* ── PAGE 8: Finale Mosaic Spread ─────────────────────── */}
        <div className="st-page hard final-finale-page" data-density="hard">
          <div
            className="page-sheet-inner finale-sheet"
            style={{
              background: 'linear-gradient(145deg, #800F2F 0%, #A4161A 60%, #BA181B 100%)',
            }}
          >
            <div className="finale-header-block">
              <h1 className="finale-headline-text">Happy Birthday, Akanksha!</h1>
            </div>

            {/* 5-Photo Mosaic cluster */}
            <div className="finale-mosaic-grid">
              <div className="mosaic-row row-portraits">
                <div className="mosaic-cell">
                  <img
                    src={BOOK_PAGES[7].photos[0].url}
                    alt="Celebration moment 1"
                    loading="lazy"
                  />
                </div>
                <div className="mosaic-cell">
                  <img
                    src={BOOK_PAGES[7].photos[1].url}
                    alt="Celebration moment 2"
                    loading="lazy"
                  />
                </div>
                <div className="mosaic-cell">
                  <img
                    src={BOOK_PAGES[7].photos[4].url}
                    alt="Celebration moment 5"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="mosaic-row row-landscapes">
                <div className="mosaic-cell landscape">
                  <img
                    src={BOOK_PAGES[7].photos[2].url}
                    alt="Friends moment 3"
                    loading="lazy"
                  />
                </div>
                <div className="mosaic-cell landscape">
                  <img
                    src={BOOK_PAGES[7].photos[3].url}
                    alt="Friends moment 4"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Finale Wish Card with Quill Writing */}
            <div className="finale-parchment-card">
              <QuillWritingWish
                text={BOOK_PAGES[7].wish}
                className="finale-wish-ink"
                style={{ color: '#4A0815' }}
                activeKey={`finale-${activePageIndex}`}
              />
              <div className="finale-signature-gold">
                ✦ With all love &amp; warmest wishes, today &amp; always ✦
              </div>
            </div>
          </div>
        </div>

        {/* ── PAGE 9: Hardcover Back Cover ─────────────────────── */}
        <div className="st-page hard cover-back" data-density="hard">
          <div className="cover-back-inner">
            <div className="cover-fabric-pattern" />
            <div className="cover-gold-border back-border">
              <span className="back-emblem">♥</span>
              <h3 className="back-closing-text">Akanksha</h3>
              <p className="back-motto">May every chapter ahead be golden.</p>
              <div className="back-ornament">❀  ✦  ❀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
