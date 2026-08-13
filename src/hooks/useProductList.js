import { useState, useEffect, useMemo } from 'react'

// Handles fetching a product list, showing newest first, filtering by
// search term / category, and paginating the result. Used by
// ApprovedProducts, MyProducts and PendingProducts.
export default function useProductList(fetchUrl, token, resultsPerPage = 15) {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [change, setChange] = useState(false)
  const [searchTerm, setSearchTermRaw] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const refresh = () => setChange((c) => !c)

  useEffect(() => {
    setLoading(true)
    fetch(fetchUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .then((res) => res.json())
      .then((result) => {
        setRawData([...result].reverse()) // latest product first
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change, fetchUrl])

  const categories = useMemo(
    () => [...new Set(rawData.map((d) => d.type).filter(Boolean))],
    [rawData]
  )

  // Users may type the productId with or without its leading '#' (as shown
  // in the table); strip it so both forms match.
  const setSearchTerm = (value) => setSearchTermRaw(value.replace(/#/g, ''))

  const filtered = useMemo(() => {
    return rawData.filter((dt) => {
      const matchesSearch =
        !searchTerm || String(dt.productId ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !category || dt.type === category
      return matchesSearch && matchesCategory
    })
  }, [rawData, searchTerm, category])

  // Reset to page 1 whenever the filters change so the page doesn't go stale.
  useEffect(() => {
    setPage(1)
  }, [searchTerm, category])

  const totalResults = filtered.length

  const data = useMemo(() => {
    const start = (page - 1) * resultsPerPage
    return filtered.slice(start, start + resultsPerPage)
  }, [filtered, page, resultsPerPage])

  return {
    data,
    loading,
    refresh,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    categories,
    page,
    setPage,
    totalResults,
    resultsPerPage,
  }
}