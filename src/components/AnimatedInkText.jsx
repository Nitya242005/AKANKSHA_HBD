import React, { useMemo } from 'react'

/**
 * AnimatedInkText
 * Renders text with an ink-stroke handwriting animation where words appear
 * sequentially with a calligraphy pen brush sweep effect and pen nib shimmer.
 *
 * @param {string} text - The wish text to animate
 * @param {string} className - Optional container class
 * @param {string} style - Optional inline styles
 * @param {string} quote - Optional quote marks: 'double' | 'none'
 * @param {number} baseDelay - Delay before first word starts in seconds (default: 0.15s)
 * @param {number} wordInterval - Interval between words in seconds (default: 0.055s)
 */
export function AnimatedInkText({
  text,
  className = '',
  style = {},
  quote = 'double',
  baseDelay = 0.15,
  wordInterval = 0.055,
}) {
  const words = useMemo(() => {
    if (!text) return []
    return text.split(/\s+/).filter(Boolean)
  }, [text])

  if (!text) return null

  return (
    <p className={`animated-ink-wish ${className}`} style={style}>
      {quote === 'double' && (
        <span
          className="ink-quote-mark left"
          style={{ animationDelay: `${baseDelay}s` }}
          aria-hidden="true"
        >
          &ldquo;
        </span>
      )}
      {words.map((word, index) => {
        const delay = baseDelay + index * wordInterval
        return (
          <span
            key={`${word}-${index}`}
            className="ink-word"
            style={{
              '--ink-delay': `${delay.toFixed(3)}s`,
              animationDelay: `${delay.toFixed(3)}s`,
            }}
          >
            <span className="ink-word-text">{word}</span>
            <span className="ink-brush-stroke" aria-hidden="true" />
            {index < words.length - 1 && <span className="ink-space">&nbsp;</span>}
          </span>
        )
      })}
      {quote === 'double' && (
        <span
          className="ink-quote-mark right"
          style={{
            animationDelay: `${(baseDelay + words.length * wordInterval).toFixed(3)}s`,
          }}
          aria-hidden="true"
        >
          &rdquo;
        </span>
      )}
    </p>
  )
}
