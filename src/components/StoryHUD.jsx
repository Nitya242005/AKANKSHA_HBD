import React from 'react'

/**
 * StoryHUD
 * Minimal, handcrafted typographic HUD guiding the user through the 5 scenes:
 * Scene 1: Arrival — "Someone special is celebrating today..."
 * Scene 2: The Birthday Card — "A handwritten birthday card rests on the table."
 * Scene 3: Memories — "Moments and memories of Akanksha."
 * Scene 4: Birthday Cake — "Make a wish & blow out the candles."
 * Scene 5: Final Reveal — "Happy Birthday, Akanksha"
 */
export function StoryHUD({
  currentScene = 1,
  onNextScene,
  onPrevScene,
  onSetScene,
  selectedPhoto,
  onClosePhoto,
  hoverLabel,
  cardOpen,
  onToggleCard,
  candlesLit,
  onBlowCandles,
}) {
  const scenes = [
    { id: 1, label: 'Arrival' },
    { id: 2, label: 'Card' },
    { id: 3, label: 'Memories' },
    { id: 4, label: 'The Cake' },
    { id: 5, label: 'Celebration' },
  ]

  return (
    <div className="story-hud">
      {/* Top Bar: Subtitle & Scene navigation dots */}
      <header className="hud-header">
        <div className="hud-title-wrap">
          <span className="hud-tag">A Celebration For</span>
          <h1 className="hud-name">Akanksha</h1>
        </div>

        {/* Scene progress indicator */}
        <nav className="hud-stepper" aria-label="Journey navigation">
          {scenes.map((s) => (
            <button
              key={s.id}
              className={`stepper-dot ${currentScene === s.id ? 'active' : ''} ${
                currentScene > s.id ? 'completed' : ''
              }`}
              onClick={() => onSetScene(s.id)}
              title={s.label}
              aria-label={`Go to ${s.label}`}
            >
              <span className="dot-circle" />
              <span className="dot-label">{s.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Center contextual prompt based on current scene */}
      <div className="hud-center-stage">
        {currentScene === 1 && (
          <div className="stage-card fade-in">
            <p className="stage-eyebrow">A Special Day</p>
            <h2 className="stage-heading">Someone special is celebrating today...</h2>
            <p className="stage-desc">
              Step into a warm, candlelit room prepared with love, cherished photographs, and sweet wishes.
            </p>
            <div className="stage-actions">
              <button
                className="btn-primary"
                onClick={() => onSetScene(2)}
              >
                Begin Journey <span>→</span>
              </button>
            </div>
          </div>
        )}

        {currentScene === 2 && (
          <div className="stage-card fade-in">
            <p className="stage-eyebrow">Scene 2 · The Birthday Card</p>
            <h2 className="stage-heading">A Card On The Table</h2>
            <p className="stage-desc">
              Click the card in the 3D scene to open it and read the warm birthday wishes.
            </p>
            <div className="stage-actions">
              <button
                className="btn-secondary"
                onClick={() => onToggleCard(!cardOpen)}
              >
                {cardOpen ? 'Close Card' : 'Open Card ✉'}
              </button>
              <button
                className="btn-primary"
                onClick={() => onSetScene(3)}
              >
                Next: Memories <span>→</span>
              </button>
            </div>
          </div>
        )}

        {currentScene === 3 && (
          <div className="stage-card fade-in">
            <p className="stage-eyebrow">Scene 3 · Cherished Memories</p>
            <h2 className="stage-heading">Moments & Memories</h2>
            <p className="stage-desc">
              Click any of Akanksha's printed photographs on the table to view them in detail.
            </p>
            <div className="stage-actions">
              <button
                className="btn-primary"
                onClick={() => onSetScene(4)}
              >
                Next: Birthday Cake <span>→</span>
              </button>
            </div>
          </div>
        )}

        {currentScene === 4 && (
          <div className="stage-card fade-in">
            <p className="stage-eyebrow">Scene 4 · The Birthday Cake</p>
            <h2 className="stage-heading">Make A Wish</h2>
            <p className="stage-desc">
              {candlesLit
                ? 'Click on the candles or tap the button below to blow them out!'
                : 'The candles are extinguished! May all your wishes come true.'}
            </p>
            <div className="stage-actions">
              {candlesLit ? (
                <button
                  className="btn-highlight"
                  onClick={onBlowCandles}
                >
                  🎂 Blow Out The Candles
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => onSetScene(5)}
                >
                  Final Reveal <span>→</span>
                </button>
              )}
            </div>
          </div>
        )}

        {currentScene === 5 && (
          <div className="stage-card final-reveal-card fade-in">
            <p className="stage-eyebrow">Scene 5 · Celebration</p>
            <h2 className="stage-heading final-title">Happy Birthday, Akanksha</h2>
            <p className="stage-desc">
              Here’s to another magnificent year filled with radiant happiness, laughter, health, and all the sweet things in life.
            </p>
            <div className="stage-actions">
              <button
                className="btn-secondary"
                onClick={() => onSetScene(1)}
              >
                ↺ Replay Experience
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Focus Photo Modal Overlay */}
      {selectedPhoto && (
        <div className="photo-modal fade-in" onClick={onClosePhoto}>
          <div
            className="photo-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="photo-close-btn"
              onClick={onClosePhoto}
              aria-label="Close photo"
            >
              ✕
            </button>
            <div className="photo-image-container">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="photo-full-img"
              />
            </div>
            <div className="photo-meta">
              <span className="photo-meta-caption">{selectedPhoto.caption}</span>
              <button className="btn-secondary btn-sm" onClick={onClosePhoto}>
                Return to Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Interactive hover hints & Navigation controls */}
      <footer className="hud-footer">
        <div className="hud-hint">
          {hoverLabel ? (
            <span className="hint-pill active">✦ {hoverLabel}</span>
          ) : (
            <span className="hint-pill">Move mouse or touch to explore the 3D room</span>
          )}
        </div>

        <div className="hud-nav-buttons">
          {currentScene > 1 && (
            <button
              className="hud-nav-btn prev"
              onClick={onPrevScene}
              title="Previous scene"
            >
              ← Back
            </button>
          )}
          {currentScene < 5 && (
            <button
              className="hud-nav-btn next"
              onClick={onNextScene}
              title="Next scene"
            >
              Continue →
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
