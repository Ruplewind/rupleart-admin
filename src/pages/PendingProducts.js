import React, { useContext, useState } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {
  Table, TableHeader, TableCell, TableBody, TableRow, TableFooter, TableContainer,
  Modal, ModalHeader, ModalBody, ModalFooter, Label, Textarea, Button, Pagination,
} from '@windmill/react-ui'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext } from '../context/AuthContext'
import useAuthCheck from '../utils/useAuthCheck'
import '../assets/css/ImagePopup.css'

import ColorDots from '../components/ColorDots'
import ImagePreviewModal from '../components/ImagePreviewModal'
import ProductSearchBar from '../components/ProductSearchBar'
import DualScrollTable from '../components/DualScrollTable'
import useProductList from '../hooks/useProductList'

function PendingProducts() {
  const { token } = useContext(AuthContext)
  useAuthCheck()

  const {
    data, loading, refresh, searchTerm, setSearchTerm,
    category, setCategory, categories, setPage, totalResults, resultsPerPage,
  } = useProductList(`${process.env.REACT_APP_API_URL}/get_unapproved_products`, null, 10)

  const [previewImage, setPreviewImage] = useState(null)
  const [dissapprovalReason, setDissapprovalReason] = useState(null)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [editId, setEditId] = useState(null)

  const handleApproval = (itemId, approvalValue) => {
    fetch(`${process.env.REACT_APP_API_URL}/approve_product/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ approval_value: approvalValue, dissapprovalReason }),
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

  const closeRejectModal = () => {
    setDissapprovalReason(null)
    setIsRejectOpen(false)
  }

  const submitRejection = () => {
    handleApproval(editId, 2)
    closeRejectModal()
  }

  return (
    <>
      <PageTitle>Products Pending Approval</PageTitle>
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
                <TableCell>Price</TableCell>
                <TableCell>Approve/Reject</TableCell>
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
                    <TableCell><span className="text-xs capitalize">{dt.description}</span></TableCell>
                    <TableCell><span className="text-xs capitalize">Ksh. {dt.price}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.preventDefault(); handleApproval(dt._id, 1) }}
                          className="text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); setEditId(dt._id); setIsRejectOpen(true) }}
                          className="text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                        >
                          Reject
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

      <Modal isOpen={isRejectOpen} onClose={closeRejectModal}>
        <ModalHeader>Reject product application</ModalHeader>
        <ModalBody>
          <Label className="mt-2">
            <span>Reason For Denial</span>
            <Textarea
              className="mt-1"
              rows="3"
              placeholder="Reason for denial"
              onChange={(e) => setDissapprovalReason(e.target.value)}
              required
            />
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeRejectModal}>Cancel</Button>
          </div>
          <div className="hidden sm:block" onClick={submitRejection}>
            <Button>Submit Rejection</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeRejectModal}>Cancel</Button>
          </div>
          <div className="block w-full sm:hidden" onClick={submitRejection}>
            <Button block size="large">Submit Rejection</Button>
          </div>
        </ModalFooter>
      </Modal>

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
    </>
  )
}

export default PendingProducts