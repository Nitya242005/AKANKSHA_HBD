import React from 'react'
import { GALLERY_SUITES } from '../galleryData'

/**
 * EditorialExperienceHUD
 * Minimalist, elegant typographic HUD that frames the experience without obscuring:
 * - Top header with refined typography
 * - Clean progress tabs for Card, Suite I, Suite II, Suite III, and Final Keepsake
 * - Contextual bottom bar with suite thoughts, captions, and navigation
 */
export function EditorialExperienceHUD({
  currentView = 'card', // 'card', 'gallery', 'photo', 'reveal'
  activeSuiteIndex = 0,
  cardOpen = false,
  onToggleCard,
  onSetView,
  onSelectSuite,
  selectedPhoto = null,
  onClosePhoto,
  hoverHint = null,
}) {
  const currentSuite = GALLERY_SUITES[activeSuiteIndex] || GALLERY_SUITES[0]

  return (
    <div className="editorial-hud">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="hud-top">
        <div className="brand-lockup">
          <span className="brand-tag">A Celebration For</span>
          <h1 className="brand-title">Akanksha</h1>
        </div>

        {/* Exhibition Suite Navigation */}
        <nav className="suite-nav" aria-label="Exhibition suites">
          <button
            className={`nav-item ${currentView === 'card' ? 'active' : ''}`}
            onClick={() => {
              onClosePhoto()
              onSetView('card')
            }}
          >
            The Greeting Card
          </button>

          {GALLERY_SUITES.map((suite, idx) => (
            <button
              key={suite.suiteId}
              className={`nav-item ${
                (currentView === 'gallery' || currentView === 'photo') && activeSuiteIndex === idx
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                onClosePhoto()
                onSelectSuite(idx)
                onSetView('gallery')
              }}
            >
              Suite {idx + 1}
            </button>
          ))}

          <button
            className={`nav-item ${currentView === 'reveal' ? 'active' : ''}`}
            onClick={() => {
              onClosePhoto()
              onSetView('reveal')
            }}
          >
            Final Keepsake
          </button>
        </nav>
      </header>

      {/* ── Center Prompt / Focused Photo Caption ──────────────────── */}
      {currentView === 'card' && !cardOpen && (
        <div className="center-card-prompt fade-in">
          <p className="prompt-eyebrow">A Special Day</p>
          <p className="prompt-instruction">Tap or click the card to open your birthday surprise</p>
          <button className="btn-gold-pill" onClick={() => onToggleCard(true)}>
            Open Card ✉
          </button>
        </div>
      )}

      {currentView === 'card' && cardOpen && (
        <div className="center-card-prompt fade-in">
          <p className="prompt-eyebrow">Your Birthday Message</p>
          <button
            className="btn-gold-pill"
            onClick={() => {
              onSelectSuite(0)
              onSetView('gallery')
            }}
          >
            Enter The Photographic Exhibition <span>→</span>
          </button>
        </div>
      )}

      {/* Focused Photo Inspection Card */}
      {selectedPhoto && (
        <div className="photo-focus-overlay fade-in">
          <div className="photo-focus-meta">
            <span className="meta-tag">Exhibition Print</span>
            <h2 className="meta-title">{selectedPhoto.title}</h2>
            <p className="meta-thought">{selectedPhoto.thought}</p>
            <button className="btn-secondary-pill" onClick={onClosePhoto}>
              ✕ Return to Suite
            </button>
          </div>
        </div>
      )}

      {/* Final Keepsake Reveal Card */}
      {currentView === 'reveal' && (
        <div className="final-reveal-panel fade-in">
          <p className="reveal-tag">Honoring You</p>
          <h2 className="reveal-title">Happy Birthday, Akanksha</h2>
          <div className="reveal-gold-line" />
          <p className="reveal-body">
            May your coming year be defined by quiet confidence, deep happiness,
            cherished memories, and the fulfillment of every ambition you hold.
          </p>
          <p className="reveal-signature">With warmest wishes on your birthday.</p>
          <div className="reveal-actions">
            <button
              className="btn-secondary-pill"
              onClick={() => {
                onSelectSuite(0)
                onSetView('gallery')
              }}
            >
              ↺ Revisit Gallery
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Bar ────────────────────────────────────────────── */}
      <footer className="hud-bottom">
        <div className="bottom-left-info">
          {currentView === 'gallery' && !selectedPhoto && (
            <div className="suite-info fade-in">
              <span className="suite-tag">{currentSuite.title}</span>
              <p className="suite-thought">{currentSuite.themeThought}</p>
            </div>
          )}
          {hoverHint && <span className="hover-pill fade-in">✦ {hoverHint}</span>}
        </div>

        <div className="bottom-right-nav">
          {currentView === 'gallery' && (
            <>
              {activeSuiteIndex > 0 ? (
                <button
                  className="nav-arrow-btn"
                  onClick={() => onSelectSuite(activeSuiteIndex - 1)}
                  title="Previous Suite"
                >
                  ← Previous Suite
                </button>
              ) : (
                <button
                  className="nav-arrow-btn"
                  onClick={() => onSetView('card')}
                  title="Back to Greeting Card"
                >
                  ← The Card
                </button>
              )}

              {activeSuiteIndex < GALLERY_SUITES.length - 1 ? (
                <button
                  className="nav-arrow-btn"
                  onClick={() => onSelectSuite(activeSuiteIndex + 1)}
                  title="Next Suite"
                >
                  Next Suite →
                </button>
              ) : (
                <button
                  className="nav-arrow-btn primary"
                  onClick={() => onSetView('reveal')}
                  title="Final Keepsake"
                >
                  Final Keepsake →
                </button>
              )}
            </>
          )}

          {currentView === 'card' && cardOpen && (
            <button
              className="nav-arrow-btn primary"
              onClick={() => {
                onSelectSuite(0)
                onSetView('gallery')
              }}
            >
              Enter Exhibition →
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
