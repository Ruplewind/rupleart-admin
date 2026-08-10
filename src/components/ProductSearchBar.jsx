import React from 'react'
import { Input, Select } from '@windmill/react-ui'

export default function ProductSearchBar({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <Input
        className="sm:w-64"
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        className="sm:w-48"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>
    </div>
  )
}
