import React from 'react'

export default function ImageDropzone({ imageUrl, onFilesAdded, onRemove }) {
  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFilesAdded(files)
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length) onFilesAdded(files)
  }

  return (
    <div
      className="flex items-center justify-center w-full mt-1"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {imageUrl.length > 0 ? (
        <div className="flex flex-nowrap overflow-x-auto gap-2 p-1">
          {imageUrl.map((url, index) => (
            <div key={index} className="h-40 w-40 relative flex-shrink-0">
              <button
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                onClick={(e) => {
                  e.preventDefault()
                  onRemove(index)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img src={url} alt="Preview" className="w-full h-full object-contain rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            name="images"
            multiple
            onChange={handleInputChange}
          />
        </label>
      )}
    </div>
  )
}
