import React, { useState, useEffect } from 'react'
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Input, Label, Select, Textarea, Button, HelperText,
} from '@windmill/react-ui'
import ImageDropzone from './ImageDropzone'
import ColorMultiSelect from './ColorMultiSelect'

const emptyForm = { productName: '', type: '', price: 0, description: '', size: '', colors: [] }

// mode: 'add' | 'edit'. initialValues (edit only): { ...emptyForm fields, imageSrc, imageUrl }
export default function ProductFormModal({ isOpen, mode, initialValues, categories, error, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [imageSrc, setImageSrc] = useState([])
  const [imageUrl, setImageUrl] = useState([])

  useEffect(() => {
    if (!isOpen) return
    setForm(initialValues ? { ...emptyForm, ...initialValues } : emptyForm)
    setImageSrc(initialValues?.imageSrc || [])
    setImageUrl(initialValues?.imageUrl || [])
  }, [isOpen, initialValues])

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const handleFilesAdded = (files) => {
    setImageSrc((prev) => [...prev, ...files])
    setImageUrl((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
  }

  const handleRemoveImage = (index) => {
    setImageSrc((prev) => prev.filter((_, i) => i !== index))
    setImageUrl((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => onSubmit({ ...form, imageSrc })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>{mode === 'edit' ? 'Edit Product' : 'Add A Product'}</ModalHeader>
      {error && <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText>}
      <ModalBody>
        <Label className="mt-2">
          <span>Product Image</span>
          <br />
          <ImageDropzone imageUrl={imageUrl} onFilesAdded={handleFilesAdded} onRemove={handleRemoveImage} />
        </Label>

        <Label className="mt-4">
          <span>Category</span>
          <Select className="mt-1" value={form.type} onChange={(e) => setField('type')(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Label>

        <Label className="mt-2">
          <span>Product Name</span>
          <Input
            className="mt-1"
            type="text"
            placeholder="Product name"
            value={form.productName}
            onChange={(e) => setField('productName')(e.target.value)}
            required
          />
        </Label>

        <Label className="mt-2">
          <span>Description</span>
          <Textarea
            className="mt-1"
            rows="2"
            placeholder="Enter some description"
            value={form.description}
            onChange={(e) => setField('description')(e.target.value)}
            required
          />
        </Label>

        <Label className="mt-2">
          <span>Colors</span>
          <ColorMultiSelect colors={form.colors} onChange={setField('colors')} />
        </Label>

        <Label className="mt-2">
          <span>Size</span>
          <Input
            className="mt-1"
            type="text"
            placeholder="50 X 40"
            value={form.size}
            onChange={(e) => setField('size')(e.target.value)}
            required
          />
        </Label>

        <Label className="mt-2">
          <span>Price</span>
          <Input
            className="mt-1"
            type="number"
            placeholder="0"
            value={form.price}
            onChange={(e) => setField('price')(e.target.value)}
            required
          />
        </Label>
      </ModalBody>
      <ModalFooter>
        <div className="hidden sm:block">
          <Button layout="outline" onClick={onClose}>Cancel</Button>
        </div>
        <div className="hidden sm:block" onClick={handleSubmit}>
          <Button>Submit</Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button block size="large" layout="outline" onClick={onClose}>Cancel</Button>
        </div>
        <div className="block w-full sm:hidden" onClick={handleSubmit}>
          <Button block size="large">Submit</Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
