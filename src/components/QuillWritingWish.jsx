import React, { useEffect, useRef, useState, useMemo } from 'react'

/**
 * QuillWritingWish
 * Renders the birthday wish with an authentic vintage peacock feather quill pen
 * that physically moves across the paper while gold/sepia ink writes out each word.
 *
 * @param {string} text - Wish content
 * @param {string} className - Additional CSS class
 * @param {object} style - Text styles
 * @param {string} activeKey - Key that triggers re-animation when page changes
 */
export function QuillWritingWish({
  text,
  className = '',
  style = {},
  activeKey = '',
}) {
  const containerRef = useRef(null)
  const quillRef = useRef(null)
  const [revealedCount, setRevealedCount] = useState(0)
  const [quillVisible, setQuillVisible] = useState(false)
  const [quillPos, setQuillPos] = useState({ x: 0, y: 0 })

  const words = useMemo(() => {
    if (!text) return []
    return text.split(/\s+/).filter(Boolean)
  }, [text])

  // Track the positions of words to animate the quill pen along the lines of text
  useEffect(() => {
    if (!containerRef.current || words.length === 0) return

    // Initially hide all words for the new page
    setRevealedCount(0)
    setQuillVisible(false)

    let isMounted = true
    const timers = []

    // Short pause so layout settles and page flip finishes before writing begins
    const initTimer = setTimeout(() => {
      if (!isMounted || !containerRef.current) return

      const wordSpans = containerRef.current.querySelectorAll('.quill-word')
      const containerRect = containerRef.current.getBoundingClientRect()

      const posList = Array.from(wordSpans).map((span) => {
        const rect = span.getBoundingClientRect()
        return {
          // Nib tip writes at the center/right base of each word
          x: rect.left - containerRect.left + rect.width * 0.8,
          y: rect.top - containerRect.top + rect.height * 0.9,
        }
      })

      if (posList.length === 0) {
        setRevealedCount(words.length)
        return
      }

      // Position quill at the start and make visible
      setQuillPos({ x: posList[0].x, y: posList[0].y })
      setQuillVisible(true)

      // Believable human handwriting pace: 130ms per word
      const interval = 135
      const startDelay = 220

      posList.forEach((pos, idx) => {
        const moveTimer = setTimeout(() => {
          if (!isMounted) return
          setQuillPos({ x: pos.x, y: pos.y })
          // Reveal the word in precise sync with the quill arriving at it
          setRevealedCount(idx + 1)
        }, startDelay + idx * interval)
        timers.push(moveTimer)
      })

      // Complete writing: ensure all words revealed, then gently hide quill
      const finishTimer = setTimeout(() => {
        if (!isMounted) return
        setRevealedCount(words.length)
      }, startDelay + posList.length * interval)
      timers.push(finishTimer)

      const hideTimer = setTimeout(() => {
        if (!isMounted) return
        setQuillVisible(false)
      }, startDelay + posList.length * interval + 750)
      timers.push(hideTimer)
    }, 350)

    timers.push(initTimer)

    return () => {
      isMounted = false
      timers.forEach(clearTimeout)
    }
  }, [words, activeKey])

  if (!text) return null

  return (
    <div className={`quill-wish-container ${className}`} ref={containerRef} style={style}>
      <p className="quill-wish-paragraph">
        <span
          className="quill-quote left"
          style={{ opacity: revealedCount > 0 ? 1 : 0, transition: 'opacity 0.2s ease' }}
        >
          &ldquo;
        </span>
        {words.map((word, idx) => {
          const isRevealed = idx < revealedCount
          return (
            <span
              key={`${word}-${idx}`}
              className={`quill-word ${isRevealed ? 'revealed' : 'hidden-stroke'}`}
            >
              <span className="quill-word-inner">{word}</span>
              {isRevealed && <span className="quill-ink-glow" />}
              {idx < words.length - 1 && <span className="quill-space">&nbsp;</span>}
            </span>
          )
        })}
        <span
          className="quill-quote right"
          style={{
            opacity: revealedCount >= words.length ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          &rdquo;
        </span>
      </p>

      {/* Photorealistic Peacock Feather Quill Pen */}
      {quillVisible && (
        <div
          ref={quillRef}
          className="quill-pen-mover"
          style={{
            transform: `translate3d(${quillPos.x}px, ${quillPos.y}px, 0)`,
          }}
          aria-hidden="true"
        >
          <img
            src="/quill_pen.png"
            alt="Peacock Quill Pen"
            className="quill-pen-img"
          />
        </div>
      )}
    </div>
  )
}
