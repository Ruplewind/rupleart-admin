import React, { useEffect, useRef, useState } from 'react'

// Native overflow-x-auto only ever shows a scrollbar at the bottom of a tall
// table. This mirrors a thin scroll strip above the table too, so wide
// tables are scrollable from the top without hunting for the bottom bar.
export default function DualScrollTable({ children }) {
  const topRef = useRef(null)
  const bottomRef = useRef(null)
  const contentRef = useRef(null)
  const [scrollWidth, setScrollWidth] = useState(0)
  const syncing = useRef(false)

  useEffect(() => {
    if (contentRef.current) setScrollWidth(contentRef.current.scrollWidth)
  })

  const syncScroll = (source, target) => {
    if (syncing.current || !target.current) return
    syncing.current = true
    target.current.scrollLeft = source.scrollLeft
    syncing.current = false
  }

  return (
    <>
      <div
        ref={topRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{ height: 14 }}
        onScroll={(e) => syncScroll(e.target, bottomRef)}
      >
        <div style={{ width: scrollWidth, height: 1 }} />
      </div>
      <div
        ref={bottomRef}
        className="overflow-x-auto"
        onScroll={(e) => syncScroll(e.target, topRef)}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </>
  )
}
