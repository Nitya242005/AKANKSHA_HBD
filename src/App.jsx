import React, { useState, useCallback, useEffect, useRef } from 'react'
import { GenuineBookFlip } from './components/GenuineBookFlip'
import { VibrantBookNavigation } from './components/VibrantBookNavigation'
import { BOOK_PAGES } from './bookContent'

/* ── Confetti Piece Component ──────────────────────────────────────────── */
function ConfettiPiece({ color, left, delay, duration, drift }) {
  return (
    <div
      className="confetti-piece"
      style={{
        left: `${left}%`,
        backgroundColor: color,
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--drift': `${drift}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

const CONFETTI_COLORS = [
  '#FFD166', '#FFB703', '#E63946', '#D90429',
  '#F4A261', '#FFF3B0', '#E07A5F', '#C9184A',
]

function generateConfetti(count = 32) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2.5 + Math.random() * 2.5,
    drift: (Math.random() - 0.5) * 120,
  }))
}

/**
 * DOM page layout (10 physical .st-page elements):
 *   Index 0  → Front cover (hard)
 *   Index 1  → Dedication page
 *   Index 2  → Wish page 1  (BOOK_PAGES[1])
 *   Index 3  → Wish page 2  (BOOK_PAGES[2])
 *   Index 4  → Wish page 3  (BOOK_PAGES[3])
 *   Index 5  → Wish page 4  (BOOK_PAGES[4])
 *   Index 6  → Wish page 5  (BOOK_PAGES[5])
 *   Index 7  → Wish page 6  (BOOK_PAGES[6])
 *   Index 8  → Finale mosaic (BOOK_PAGES[7])  ← last readable page
 *   Index 9  → Back cover (hard)              ← never a navigation target
 *
 * currentPage tracks the raw PageFlip DOM index (0–9).
 * Navigation: Prev disabled at 0, Next disabled at 8 (finale).
 * Content counter: Cover at 0, Page 1–8 for indices 1–8.
 */
const FINALE_PAGE_INDEX = 8   // DOM index of the last readable page
const COVER_PAGE_INDEX  = 0   // DOM index of the front cover

/* ── Main App ──────────────────────────────────────────────────────────── */
export default function App() {
  const [currentPage, setCurrentPage] = useState(COVER_PAGE_INDEX)
  const [confetti] = useState(() => generateConfetti(36))

  // Show confetti on finale page
  const showConfetti = currentPage >= FINALE_PAGE_INDEX

  const handlePageChange = useCallback((pageNum) => {
    // pageNum is the raw 0-based DOM index reported by PageFlip
    // Clamp to [0, FINALE_PAGE_INDEX] — never let back cover (9) become the target
    const clamped = Math.min(Math.max(0, pageNum), FINALE_PAGE_INDEX)
    setCurrentPage(clamped)
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, FINALE_PAGE_INDEX))
  }, [])

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, COVER_PAGE_INDEX))
  }, [])

  const handleGoToPage = useCallback((index) => {
    const target = Math.min(Math.max(0, index), FINALE_PAGE_INDEX)
    if (target !== currentPage) setCurrentPage(target)
  }, [currentPage])

  return (
    <div className="book-experience-container genuine-physical-book-mode">
      {/* ── Top Header ────────────────────────────────────────────────── */}
      <header className="book-header">
        <div className="book-brand">
          <div className="brand-heart-icon">♥</div>
          <span className="brand-name">Akanksha</span>
        </div>
        <div className="header-subtitle-tag">A Birthday Keepsake</div>
      </header>

      {/* ── Central Stage: Genuine Physical Book ──────────────────────── */}
      <main className="book-center-stage">
        {showConfetti && (
          <div className="confetti-overlay" aria-hidden="true">
            {confetti.map((c) => (
              <ConfettiPiece key={c.id} {...c} />
            ))}
          </div>
        )}

        <GenuineBookFlip
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </main>

      {/* ── Bottom Navigation Bar ─────────────────────────────────────── */}
      <VibrantBookNavigation
        currentPage={currentPage}
        finalePageIndex={FINALE_PAGE_INDEX}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        onGoToPage={handleGoToPage}
      />
    </div>
  )
}
