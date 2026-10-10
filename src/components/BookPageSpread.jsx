import React from 'react'
import { AnimatedInkText } from './AnimatedInkText'


/**
 * BookPageSpread
 * Renders individual pages with rich, animated editorial layouts.
 * All layouts reference real PHOTOS/ directory images.
 */
export function BookPageSpread({ page, onNextPage, onPrevPage }) {
  if (!page) return null

  // ── 1. COVER PAGE ──────────────────────────────────────────────────────────
  if (page.pageType === 'cover') {
    return (
      <div className="book-page-canvas cover-page" style={{ backgroundColor: page.theme.bg }}>
        {/* Animated background gradient */}
        <div className="cover-bg-animated" />

        {/* Pulsing burst rings */}
        <div className="cover-burst-ring" />
        <div className="cover-burst-ring" />
        <div className="cover-burst-ring" />
        <div className="cover-burst-ring" />

        {/* Floating stars */}
        <span className="cover-star">✦</span>
        <span className="cover-star">★</span>
        <span className="cover-star">✦</span>
        <span className="cover-star">✶</span>
        <span className="cover-star">★</span>
        <span className="cover-star">✦</span>

        {/* Main content */}
        <div className="cover-content">
          <div className="cover-inner-border">
            <div className="cover-badge">✦ A CELEBRATION FOR ✦</div>

            <div className="cover-titles">
              <h2 className="cover-heading-main">{page.title}</h2>
              <h1 className="cover-name-highlight">{page.name}</h1>
              <div className="cover-sun-divider">
                <span className="sun-dot" />
                <span className="sun-line" />
                <span className="sun-star">★</span>
                <span className="sun-line" />
                <span className="sun-dot" />
              </div>
              <p className="cover-subtitle">{page.subtitle}</p>
            </div>

            <div className="cover-action-wrap">
              <button className="cover-open-btn" onClick={onNextPage}>
                {page.callToAction}
              </button>
            </div>

            <div className="cover-footer-note">
              <span>Vol. 2026 · A Birthday Keepsake</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── 2. SINGLE PORTRAIT (Pages 2, 4, 6) ────────────────────────────────────
  if (page.pageType === 'single_portrait') {
    const photo = page.photos[0]
    return (
      <div
        className="book-page-canvas standard-page portrait-layout"
        style={{ backgroundColor: page.theme.bg }}
      >
        <div className="page-header-strip">
          <span className="page-badge-pill" style={{ color: page.theme.textTitle }}>
            {page.badge}
          </span>
          <span className="page-decor-heart">♥</span>
        </div>

        <div className="page-content-grid" style={{ flex: 1 }}>
          {/* Framed photograph with tape accents */}
          <div className="photo-frame-card">
            <div className="photo-tape-accent top-left" />
            <div className="photo-tape-accent top-right" />
            <div className="photo-aspect-wrapper">
              <img
                src={photo.url}
                alt={photo.alt || 'Akanksha'}
                className="page-photograph"
                loading="lazy"
              />
            </div>
          </div>

          {/* Birthday wish */}
          <div className="wish-card-wrap">
            <h2 className="wish-headline" style={{ color: page.theme.textTitle }}>
              {page.title}
            </h2>
            <AnimatedInkText
              text={page.wish}
              className="wish-paragraph"
              style={{ color: page.theme.textBody }}
            />
          </div>
        </div>

        <div className="page-footer-strip">
          <span className="page-number-folio">Page {page.pageIndex + 1} of 8</span>
        </div>
      </div>
    )
  }

  // ── 3. SIDE FEATURE (Pages 3, 5) ──────────────────────────────────────────
  if (page.pageType === 'side_feature') {
    const photo = page.photos[0]
    return (
      <div
        className="book-page-canvas standard-page side-feature-layout"
        style={{ backgroundColor: page.theme.bg }}
      >
        <div className="page-header-strip">
          <span className="page-badge-pill" style={{ color: page.theme.textTitle }}>
            {page.badge}
          </span>
          <span className="page-decor-heart">✦</span>
        </div>

        <div className="page-content-split" style={{ flex: 1 }}>
          {/* Text block */}
          <div className="feature-text-block">
            <h2 className="wish-headline" style={{ color: page.theme.textTitle }}>
              {page.title}
            </h2>
            <AnimatedInkText
              text={page.wish}
              className="wish-paragraph"
              style={{ color: page.theme.textBody }}
            />
            <div
              className="feature-stamp-accent"
              style={{ borderColor: page.theme.accent, color: page.theme.accent }}
            >
              STAY SHINING ✦
            </div>
          </div>

          {/* Tilted photograph */}
          <div className="photo-frame-card tilt-gentle">
            <div className="photo-aspect-wrapper">
              <img
                src={photo.url}
                alt={photo.alt || 'Akanksha'}
                className="page-photograph"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="page-footer-strip">
          <span className="page-number-folio">Page {page.pageIndex + 1} of 8</span>
        </div>
      </div>
    )
  }

  // ── 4. FRIENDSHIP SCRAPBOOK (Page 7) ──────────────────────────────────────
  if (page.pageType === 'friendship_scrapbook') {
    return (
      <div
        className="book-page-canvas standard-page friendship-layout"
        style={{ backgroundColor: page.theme.bg }}
      >
        <div className="page-header-strip">
          <span className="page-badge-pill" style={{ color: page.theme.textTitle }}>
            {page.badge}
          </span>
          <span className="page-decor-heart">♥ Always</span>
        </div>

        <div className="friendship-content-grid" style={{ flex: 1 }}>
          {/* Two-photo scrapbook cluster */}
          <div className="dual-photos-cluster">
            <div className="scrapbook-photo">
              <img src={page.photos[0].url} alt="Warm portrait" loading="lazy" />
              <span className="caption-label">{page.photos[0].caption}</span>
            </div>
            <div className="scrapbook-photo">
              <img src={page.photos[1].url} alt="Friends celebrating" loading="lazy" />
              <span className="caption-label">{page.photos[1].caption}</span>
            </div>
          </div>

          {/* Friendship wish */}
          <div className="friendship-letter-wrap">
            <h2 className="wish-headline" style={{ color: page.theme.textTitle }}>
              {page.title}
            </h2>
            <AnimatedInkText
              text={page.wish}
              className="wish-paragraph intimate"
              style={{ color: page.theme.textBody }}
            />
          </div>
        </div>

        <div className="page-footer-strip">
          <span className="page-number-folio">Page {page.pageIndex + 1} of 8</span>
        </div>
      </div>
    )
  }

  // ── 5. FINAL CELEBRATION MOSAIC ────────────────────────────────────────────
  if (page.pageType === 'final_mosaic') {
    // Photos by aspect ratio:
    // [0]=portrait(0.75), [1]=portrait(0.75), [2]=landscape(1.778),
    // [3]=landscape(1.778), [4]=portrait(0.75)
    // Row 1: group the 3 portraits together (indices 0, 1, 4)
    // Row 2: group the 2 landscapes together (indices 2, 3)
    const portraitPhotos  = [page.photos[0], page.photos[1], page.photos[4]]
    const landscapePhotos = [page.photos[2], page.photos[3]]

    return (
      <div
        className="book-page-canvas fmp-page"
        style={{ background: `linear-gradient(135deg, ${page.theme.bg} 0%, #e0245e 100%)` }}
      >
        {/* Title */}
        <div className="fmp-header">
          <span className="final-tag">✦ FINALE · A BIRTHDAY JUST FOR YOU ✦</span>
          <h1 className="final-main-title">{page.title}</h1>
        </div>

        {/* Photo grid */}
        <div className="fmp-grid">
          {/* Row 1 — three portraits side by side */}
          <div className="fmp-row fmp-portraits">
            {portraitPhotos.map((p, i) => (
              <div key={i} className="fmp-cell">
                <img src={p.url} alt={`Akanksha portrait ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>

          {/* Row 2 — two landscapes side by side */}
          <div className="fmp-row fmp-landscapes">
            {landscapePhotos.map((p, i) => (
              <div key={i} className="fmp-cell">
                <img src={p.url} alt={`Akanksha moment ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Closing message */}
        <div className="final-message-card fmp-msg">
          <AnimatedInkText
            text={page.wish}
            className="final-wish-text"
            style={{ color: '#590d22' }}
          />
          <div className="final-signature-wrap">
            ✦ With all love &amp; best wishes, today &amp; always ✦
          </div>
        </div>
      </div>
    )
  }

  return null
}
