import React, { useContext, useEffect, useState } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {
  Table, TableHeader, TableCell, TableBody, TableRow,
  TableFooter, TableContainer, Input, Button, Pagination,
} from '@windmill/react-ui'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext } from '../context/AuthContext'
import useAuthCheck from '../utils/useAuthCheck'
import '../assets/css/ImagePopup.css'
import ReadMoreText from '../components/ReadMoreText'

import ColorDots from '../components/ColorDots'
import ImagePreviewModal from '../components/ImagePreviewModal'
import ProductSearchBar from '../components/ProductSearchBar'
import DualScrollTable from '../components/DualScrollTable'
import ProductFormModal from '../components/ProductFormModal'
import useProductList from '../hooks/useProductList'

function MyProducts() {
  const { token } = useContext(AuthContext)
  useAuthCheck()

  const {
    data, loading, refresh, searchTerm, setSearchTerm,
    category, setCategory, setPage, totalResults, resultsPerPage,
  } = useProductList(`${process.env.REACT_APP_API_URL}/my_products`, token, 10)

  const [categories, setCategories] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editInitialValues, setEditInitialValues] = useState(null)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/get_categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((cats) => setCategories(cats.map((c) => c.category)))
      .catch((err) => console.log(err))
  }, [token])

  const buildFormData = (form) => {
    const formData = new FormData()
    formData.append('productName', form.productName)
    formData.append('type', form.type)
    formData.append('price', form.price)
    form.imageSrc.forEach((image) => formData.append('image', image))
    formData.append('description', form.description)
    formData.append('size', form.size)
    form.colors.forEach((color) => formData.append('colors', color))
    return formData
  }

  const isFormValid = (form) =>
    form.productName && form.price >= 1 && form.imageSrc.length > 0 && form.type && form.size && form.description

  const handleAdd = (form) => {
    if (!isFormValid(form)) {
      toast('All fields must be filled', { type: 'error' })
      return
    }
    fetch(`${process.env.REACT_APP_API_URL}/add_product`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: buildFormData(form),
    })
      .then((res) => {
        if (res.ok) {
          setIsAddOpen(false)
          toast('Success', { type: 'success' })
          refresh()
        } else {
          res.json().then((err) => console.log(err))
          toast('Server Error', { type: 'error' })
        }
      })
      .catch(() => toast('Server Error', { type: 'error' }))
  }

  const handleEdit = (form) => {
    if (!form.productName || form.price < 1 || !form.type) {
      toast('All fields must be filled', { type: 'error' })
      return
    }
    fetch(`${process.env.REACT_APP_API_URL}/edit_product/${editId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: buildFormData(form),
    })
      .then((res) => {
        if (res.ok) {
          setIsEditOpen(false)
          toast('Success', { type: 'success' })
          refresh()
        } else {
          res.json().then((err) => console.log(err))
          toast('Server Error', { type: 'error' })
        }
      })
      .catch(() => toast('Server Error', { type: 'error' }))
  }

  const handleDeleteItem = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/del_product/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        toast(res.ok ? 'Success' : 'Server Error', { type: res.ok ? 'success' : 'error' })
        if (res.ok) refresh()
      })
      .catch(() => toast('Server Error', { type: 'error' }))
  }

  const handleAvailabilityToggle = (id, value) => {
    fetch(`${process.env.REACT_APP_API_URL}/change_availability/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ value }),
    })
      .then((res) => {
        toast(res.ok ? 'Status Updated' : 'Server Error', { type: res.ok ? 'success' : 'error' })
        if (res.ok) refresh()
      })
      .catch(() => toast('Server Error', { type: 'error' }))
  }

  const openEditFor = (dt) => {
    setEditId(dt._id)
    setEditInitialValues({
      productName: dt.productName,
      type: dt.type,
      price: dt.price,
      description: dt.description,
      size: dt.size,
      colors: dt.colors || [],
      imageSrc: dt.image,
      imageUrl: dt.image.map((image) => `${process.env.REACT_APP_API_URL}/uploads/${image}`),
    })
    setIsEditOpen(true)
  }

  return (
    <>
      <PageTitle>My Products</PageTitle>
      <ToastContainer />

      <div className="flex mr-5 mb-5 justify-end">
        <Button onClick={() => setIsAddOpen(true)}>Add A Product</Button>
      </div>

      <ProductSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <ProductFormModal
        isOpen={isAddOpen}
        mode="add"
        initialValues={null}
        categories={categories}
        error={error}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />

      <ProductFormModal
        isOpen={isEditOpen}
        mode="edit"
        initialValues={editInitialValues}
        categories={categories}
        error={error}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
      />

      <TableContainer className="mb-8">
        <DualScrollTable>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Image</TableCell>
                <TableCell>Name & Category</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Colors</TableCell>
                <TableCell>Description</TableCell>
                <TableCell className="text-center">In Stock?</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr><TableCell>Loading...</TableCell></tr>
              ) : data.length === 0 ? (
                <tr><TableCell>No Records</TableCell></tr>
              ) : (
                data.map((dt) => (
                  <TableRow key={dt._id}>
                    <TableCell>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${dt.image[0]}`}
                        className="p-0 rounded-t-lg h-40 w-40 object-contain cursor-pointer"
                        alt="No image Uploaded"
                        onClick={() => setPreviewImage(`${process.env.REACT_APP_API_URL}/uploads/${dt.image[0]}`)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">#{dt.productId}</span>
                      <br />
                      <span className="text-sm">{dt.productName}</span>
                      <br />
                      <span className="text-xs capitalize">{dt.type}</span>
                    </TableCell>
                    <TableCell><span className="text-sm">{dt.size}</span></TableCell>
                    <TableCell><ColorDots colors={dt.colors} /></TableCell>
                    <TableCell><ReadMoreText description={dt.description} /></TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Input
                          type="checkbox"
                          className="border border-black"
                          checked={dt.availability}
                          onChange={(e) => handleAvailabilityToggle(dt._id, e.target.checked)}
                        />
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs capitalize">Ksh. {dt.price}</span></TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => { e.preventDefault(); openEditFor(dt) }}
                        className="text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Edit
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDeleteItem(dt._id) }}
                        className="text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DualScrollTable>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
            label="Table Navigation"
          />
        </TableFooter>
      </TableContainer>

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
    </>
  )
}

export default MyProducts