import React, { useState } from 'react'
import { AVAILABLE_COLORS, COLOR_SWATCHES } from '../constants/colors'

export default function ColorMultiSelect({ colors, onChange }) {
  const [open, setOpen] = useState(false)

  const toggleColor = (color) => {
    onChange(colors.includes(color) ? colors.filter((c) => c !== color) : [...colors, color])
  }

  return (
    <div className="relative mt-1">
      <div
        className="flex items-center justify-between w-full border rounded-lg px-3 py-2 cursor-pointer bg-white dark:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {colors.length > 0 ? `${colors.length} selected` : 'Select colors'}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto border rounded-lg bg-white dark:bg-gray-700 shadow-lg">
          {AVAILABLE_COLORS.map((color) => (
            <label
              key={color}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            >
              <input type="checkbox" checked={colors.includes(color)} onChange={() => toggleColor(color)} />
              <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: COLOR_SWATCHES[color] }} />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>
      )}

      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-full border">
              <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: COLOR_SWATCHES[color] }} />
              <span className="text-xs">{color}</span>
              <button type="button" className="text-gray-400 hover:text-red-500 ml-1" onClick={() => toggleColor(color)}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
