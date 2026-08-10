import React, { useContext, useState } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {
  Table, TableHeader, TableCell, TableBody, TableRow,
  TableFooter, TableContainer, Input, Pagination,
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
import useProductList from '../hooks/useProductList'

function ApprovedProducts() {
  const { token } = useContext(AuthContext)
  useAuthCheck()

  const {
    data, loading, refresh, searchTerm, setSearchTerm,
    category, setCategory, categories, setPage, totalResults, resultsPerPage,
  } = useProductList(`${process.env.REACT_APP_API_URL}/get_all_approved_products`, null, 10)

  const [previewImage, setPreviewImage] = useState(null)

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

  const handleApproval = (itemId, approvalValue) => {
    fetch(`${process.env.REACT_APP_API_URL}/approve_product/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ approval_value: approvalValue, dissapprovalReason: null }),
    })
      .then((res) => {
        if (res.ok) {
          toast('Success', { type: 'success' })
          refresh()
        } else {
          res.json().then((err) => console.log(err))
          toast('Server Error', { type: 'error' })
        }
      })
      .catch(() => toast('Server Error', { type: 'error' }))
  }

  return (
    <>
      <PageTitle>Approved Products</PageTitle>
      <ToastContainer />

      <ProductSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
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
                <TableCell>Actions</TableCell>
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
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.preventDefault(); handleApproval(dt._id, 0) }}
                          className="text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                        >
                          Recall Approval
                        </button>
                      </div>
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

export default ApprovedProducts