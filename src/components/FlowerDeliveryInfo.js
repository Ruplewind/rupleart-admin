import React from 'react'
import { Badge } from '@windmill/react-ui'

// "2026-11-10" -> "10/11/2026" (order_date is stored as dd/mm/yyyy)
const fmtDate = (d) => {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export const isSameDayFlowerOrder = (order) =>
  Boolean(order?.hasFlowers && order?.flowerDelivery?.sameDay)

// Use on <TableRow> to make same-day flower orders stand out
export const flowerRowClass = (order) =>
  isSameDayFlowerOrder(order) ? 'bg-pink-50 dark:bg-gray-700' : ''

export default function FlowerDeliveryInfo({ order }) {
  const f = order?.flowerDelivery
  if (!order?.hasFlowers || !f) return null

  return (
    <div className="mt-2 p-2 rounded-lg border border-pink-300 text-xs">
      <div className="mb-1">
        {f.sameDay ? (
          <Badge type="danger">SAME DAY</Badge>
        ) : (
          <Badge type="neutral">
            Flowers{f.preferredDate ? ` · ${fmtDate(f.preferredDate)}` : ''}
          </Badge>
        )}
      </div>
      <p className="font-semibold">Deliver to: {f.recipientName}</p>
      <p className="text-gray-600 dark:text-gray-400">{f.recipientPhone}</p>
      <p>{f.recipientAddress}</p>
      {f.note && (
        <p className="mt-1 italic">
          Card note: <span className="not-italic">"{f.note}"</span>
        </p>
      )}
      {f.acknowledgedAvailability && (
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          ✓ Buyer confirmed recipient will be available
        </p>
      )}
    </div>
  )
}