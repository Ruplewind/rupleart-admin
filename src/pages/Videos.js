import React, { useState, useEffect, useContext, useRef } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

import { EditIcon, TrashIcon } from '../icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import response from '../utils/demo/tableData'
import { AuthContext } from '../context/AuthContext'
import useAuthCheck from '../utils/useAuthCheck'
// make a copy of the data, for the second table
const response2 = response.concat([])

function Videos() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  // setup data for every table
  const [loading, setLoading] = useState(true)

  const [change, setChange] = useState(false)
  // pagination setup
  const resultsPerPage = 5

  const [totalResults, setTotalResults] = useState(0);

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
  }
  // on page change, load new sliced data
  // here you would make another server request for new data
  // useEffect(() => {
    

  // }, [pageTable])

  const { token } = useContext(AuthContext);
  useAuthCheck();

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/get_videos`,{
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => {
      //setDeliveredOrders(data); 
      //setTotalResults(data.length);
      setData(data)
      setLoading(false);
    })
    .catch( err => { console.log(err) })
  },[change])


    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
      setIsModalOpen(true)
    }

    function closeModal() {
      setTitle(null);
      setPrice(0);
      setHours(0);
      setMinutes(0);
      setImageSrc(null);
      setImageUrl(null);
      setIsModalOpen(false)
    }

    const [title, setTitle] = useState(null);
    const [price, setPrice] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const [imageSrc, setImageSrc] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(false);

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      setImageSrc(file);
      setImageUrl(URL.createObjectURL(file));
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDelete = () => {
      setImageSrc(null);
    };

    const handleSubmit = () => {

        if(title == null || imageSrc == null || price < 1 || minutes < 0 ){
            toast('All fields must be filled',{
                type:'error'
            })
            return
        }

        if(minutes > 59 ){
            toast('Invalid minutes',{
                type:'error'
            })
            return
        }

        const formData = new FormData();

        formData.append('title', title);
        formData.append('hours', hours);
        formData.append('minutes', minutes);
        formData.append('price', price);
        formData.append('thumbnail', imageSrc)

        fetch(`${process.env.REACT_APP_API_URL}/add_video`,{
            method: 'POST',
            headers: {
              'Authorization':`Bearer ${token}`
            },
            body: formData
        })
        .then((response)=>{
            if(response.ok){
                closeModal();
                toast('Success',{
                    type:'success'
                });
                setChange(true);
            }else{
                toast('Server Error',{
                    type:'error'
                });
            }
        })
        .catch((err)=>{
            setError(true);
            toast('Server Error',{
                type:'error'
            })
        })
    }

    const handleDeleteItem = ( id ) => {
        fetch(`${process.env.REACT_APP_API_URL}/del_video/${id}`,{
            method: 'DELETE',
            headers: {
              'Authorization':`Bearer ${token}`
            }
        })
        .then((response)=>{
            if(response.ok){
                toast('Success',{
                    type:'success'
                })
                setChange(!change);
            }else{
                toast('Server Error',{
                    type:'error'
                })
            }

        })
        .catch((err)=>{
            toast('Server Error',{
                type:'error'
            })
        })
    }

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    function openEditModal() {
      setIsEditModalOpen(true)
    }

    function closeEditModal() {
      setEditId(null);
      setTitle(null);
      setPrice(0);
      setHours(0);
      setMinutes(0);
      setImageSrc(null);
      setImageUrl(null);
      setIsEditModalOpen(false)
    }

    const handleEditSubmit = () => {

      if(title == null || imageSrc == null || price < 1 || minutes < 0 ){
          toast('All fields must be filled',{
              type:'error'
          })
          return
      }
      
      if(minutes > 59 ){
          toast('Invalid minutes',{
              type:'error'
          })
          return
      }

      const formData = new FormData();

      formData.append('title', title);
      formData.append('hours', hours);
      formData.append('minutes', minutes);
      formData.append('price', price);
      formData.append('thumbnail', imageSrc)

      fetch(`${process.env.REACT_APP_API_URL}/edit_video/${editId}`,{
          method: 'PUT',
          headers: {
            'Authorization':`Bearer ${token}`
          },
          body: formData
      })
      .then((response)=>{
          if(response.ok){
              closeEditModal();
              toast('Success',{
                  type:'success'
              });
              setEditId(null);
              setTitle(null);
              setPrice(0);
              setHours(0);
              setMinutes(0);
              setImageSrc(null);
              setImageUrl(null);
              setChange(true);
          }else{
              toast('Server Error',{
                  type:'error'
              })
          }
      })
      .catch((err)=>{
          setError(true);
          toast('Server Error',{
              type:'error'
          })
      })
    }

    const [uploadUrl, setUploadUrl] = useState(null);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/get_upload_url`,{
          headers: {
            'Authorization':`Bearer ${token}`
          }
        })
        .then(data => data.json())
        .then((result) => {
          setUploadUrl(result.upload_url);
        })
    },[])

    const muxUploaderRef = useRef(null);

  useEffect(() => {
    const muxUploader = muxUploaderRef.current;

    if (muxUploader) {
      const handleSuccess = () => {
        console.log('success');
      };

      muxUploader.addEventListener('success', handleSuccess);

      // Cleanup event listener on component unmount
      return () => {
        muxUploader.removeEventListener('success', handleSuccess);
      };
    }
  }, []);

  return (
    <>
      <PageTitle>Videos</PageTitle>
      <ToastContainer />

      <div className="flex mr-5 mb-5 justify-end">
        <Button onClick={openModal}>Add A Video</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add A Video</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>

        <Label>
          <span>Thumbnail</span>
          <br />
        <div
            className="flex items-center justify-center w-full mt-1"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            {imageSrc ? (
                <div className="h-40 w-full relative">
                <button
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    onClick={handleDelete}
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
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                />
                </div>
            ) : (
                <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
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
                    <span className="font-semibold">Click to upload</span> or drag and
                    drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) =>{ setImageSrc(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0]) )}}
                />
                </label>
            )}
        </div>

        </Label>

        <br />

        <Label>
          <span className='mb-4'>Upload Video</span>
          <br/>
          <mux-uploader endpoint={uploadUrl}></mux-uploader>
        </Label>

        <div className='mt-3'></div>
        
        <Label>
          <span>Title</span>
          <Input className="mt-1" type="text" placeholder="New Podcast" onChange={e => setTitle(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Duration</span>
          <div className='flex gap-4'>
              <div className='flex gap-4 items-center'>
                <Input className="mt-1" type="number" min={0} max={24} onChange={e => setHours(e.target.value)} required/>
                <span>Hrs.</span>
              </div>
              <div className='flex gap-4 items-center'>
                <Input className="mt-1" type="number" min={0} max={59} onChange={e => setMinutes(e.target.value)} required/>
                <span>Mins.</span>
              </div>
          </div>
        </Label>

        <Label className="mt-4">
          <span>Price</span>
          <Input className="mt-1" type="number" placeholder="0" onChange={e => setPrice(e.target.value)} required/>
        </Label>


        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleSubmit}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Video</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>

        <Label>
          <span>Thumbnail</span>
          <br />
        <div
            className="flex items-center justify-center w-full mt-1"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            {imageSrc ? (
                <div className="h-40 w-full relative">
                <button
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    onClick={handleDelete}
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
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                />
                </div>
            ) : (
                <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
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
                    <span className="font-semibold">Click to upload</span> or drag and
                    drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) =>{ setImageSrc(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0]) )}}
                />
                </label>
            )}
        </div>

        </Label>

        <br />

        <Label>
          <span>Title</span>
          <Input className="mt-1" type="text" placeholder="New Podcast" value={title} onChange={e => setTitle(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Duration</span>
          <div className='flex gap-4'>
              <div className='flex gap-4 items-center'>
                <Input className="mt-1" type="number" min={0} max={24} value={hours} onChange={e => setHours(e.target.value)} required/>
                <span>Hrs.</span>
              </div>
              <div className='flex gap-4 items-center'>
                <Input className="mt-1" type="number" min={0} max={59} value={minutes} onChange={e => setMinutes(e.target.value)} required/>
                <span>Mins.</span>
              </div>
          </div>
        </Label>

        <Label className="mt-4">
          <span>Price</span>
          <Input className="mt-1" type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} required/>
        </Label>


        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleEditSubmit}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleEditSubmit}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>


      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            data.length === 0 ? <TableCell>No Records</TableCell> :
            
            data.map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                    <img src={`${process.env.REACT_APP_API_URL}/uploads/${dt.thumbnail}`} class="p-0 rounded-t-lg h-40 w-40 object-contain"  alt="No image Uploaded"  />
                </TableCell>
                <TableCell>
                    <span className="text-sm capitalize">{dt.title}</span>
                </TableCell>
                <TableCell>
                    { 
                      dt.hours > 0 ? 
                      <span className="text-sm capitalize">{dt.hours} Hrs {dt.minutes} Mins</span>
                        :
                      <span className="text-sm capitalize">{dt.minutes} Mins</span>
                    }
                </TableCell>
                <TableCell>
                    <span className="text-sm capitalize">Ksh. {dt.price}</span>
                </TableCell>
                <TableCell>
                    <button onClick={e => {
                        e.preventDefault();
                        setEditId(dt._id);
                        setTitle(dt.title);
                        setHours(dt.hours);
                        setMinutes(dt.minutes);
                        setPrice(dt.price);
                        setImageUrl(`${process.env.REACT_APP_API_URL}/uploads/${dt.thumbnail}`);
                        setImageSrc(dt.thumbnail);
                        openEditModal();
                    }} className='text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>Edit</button>
                </TableCell>
                <TableCell>
                    <button onClick={e => {
                        e.preventDefault();
                        handleDeleteItem(dt._id);
                    }} className='text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
        </TableFooter>
      </TableContainer>



    </>
  )
}

export default Videos
