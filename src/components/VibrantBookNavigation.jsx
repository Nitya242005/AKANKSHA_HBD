import React from 'react'

/**
 * VibrantBookNavigation
 *
 * currentPage      – raw PageFlip DOM index (0 = cover, 1-8 = content, 9 = back cover)
 * finalePageIndex  – DOM index of the last readable page (8)
 *
 * Content page counter logic:
 *   DOM 0          → "Cover"
 *   DOM 1–8        → "Page X of 8"  where X = currentPage  (1-based)
 *   DOM 9          → never reached via navigation; clamped away in App
 *
 * Button states:
 *   ← Previous: disabled when currentPage === 0 (at cover)
 *   Next →:      disabled when currentPage >= finalePageIndex (at finale)
 */
export function VibrantBookNavigation({
  currentPage = 0,
  finalePageIndex = 8,
  onNext,
  onPrev,
  onGoToPage,
}) {
  // Total content pages = finalePageIndex  (pages 1 through 8, excluding back cover)
  const totalContentPages = finalePageIndex  // 8

  // Human-readable counter label
  const counterLabel =
    currentPage === 0
      ? 'Cover'
      : `Page ${currentPage} of ${totalContentPages}`

  // Button disabled states
  const prevDisabled = currentPage <= 0
  const nextDisabled = currentPage >= finalePageIndex

  // Label for the Next button
  const nextLabel =
    currentPage === 0
      ? 'Open Book →'
      : currentPage === finalePageIndex - 1
      ? 'Final Page →'
      : 'Next Page →'

  // Label for the Previous button
  const prevLabel =
    currentPage <= 1 ? '← Cover' : '← Previous'

  return (
    <footer className="book-bottom-nav">
      <div className="nav-controls-inner">
        {/* Previous Button */}
        <button
          className="book-arrow-btn prev-btn"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous Page"
        >
          {prevLabel}
        </button>

        {/* Compact counter — pips hidden on mobile via CSS */}
        <div className="page-pips-strip">
          {/* Dot pips for desktop (hidden on mobile via CSS) */}
          {Array.from({ length: totalContentPages }, (_, i) => {
            const domIndex = i + 1  // content pages are DOM indices 1–8
            return (
              <button
                key={domIndex}
                className={`pip-dot ${currentPage === domIndex ? 'active' : ''} ${
                  currentPage > domIndex ? 'read' : ''
                }`}
                onClick={() => onGoToPage && onGoToPage(domIndex)}
                title={domIndex === 1 ? 'Dedication' : `Page ${domIndex}`}
                aria-label={`Jump to page ${domIndex}`}
              >
                <span className="pip-inner" />
              </button>
            )
          })}
          <span className="page-text-counter">{counterLabel}</span>
        </div>

        {/* Next Button */}
        <button
          className="book-arrow-btn next-btn"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next Page"
        >
          {nextLabel}
        </button>
      </div>
    </footer>
  )
}
