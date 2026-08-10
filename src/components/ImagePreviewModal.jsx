import React from 'react'

// Fullscreen preview for a single product image. Pass src=null to keep it hidden.
export default function ImagePreviewModal({ src, onClose }) {
  if (!src) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            zIndex: 1001,
          }}
          onClick={onClose}
        >
          X
        </button>
        <img
          src={src}
          style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          alt="Product"
        />
      </div>
    </div>
  )
}
