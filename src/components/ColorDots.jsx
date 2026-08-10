import React from 'react'
import { COLOR_SWATCHES } from '../constants/colors'

// Renders a small row of color swatches for a product, or a placeholder dash.
export default function ColorDots({ colors }) {
  if (!colors || colors.length === 0) {
    return <span className="text-xs text-gray-400">—</span>
  }

  return (
    <div className="flex flex-wrap gap-1 max-w-[120px]">
      {colors.map((color, idx) => (
        <span
          key={idx}
          title={color}
          className="w-4 h-4 rounded-full border border-gray-300 inline-block"
          style={{ backgroundColor: COLOR_SWATCHES[color] || '#ccc' }}
        />
      ))}
    </div>
  )
}
