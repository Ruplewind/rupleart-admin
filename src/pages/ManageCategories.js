import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import {
    Table, TableHeader, TableCell, TableBody, TableRow,
    TableFooter, TableContainer,
    Label, Input, Badge,
    Modal, ModalHeader, ModalBody, ModalFooter, Button
} from '@windmill/react-ui'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
import useAuthCheck from '../utils/useAuthCheck';

function ManageCategories() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [requiresRecipient, setRequiresRecipient] = useState(false);
    const [editId, setEditId] = useState(null);
    const [change, setChange] = useState(false);

    const { token } = useContext(AuthContext);

    useAuthCheck();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/get_categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (response.ok) {
                response.json().then(res => {
                    setData(res);
                    setLoading(false);
                })
            } else {
                setError(true);
                setLoading(false);
            }
        })
        .catch(() => {
            setError(true);
            setLoading(false);
        })
    }, [change])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)

    function openModal() {
        setCategory('');
        setRequiresRecipient(false);
        setIsModalOpen(true)
    }
    function closeModal() { setIsModalOpen(false) }
    function closeEditModal() { setEditModalOpen(false) }

    const handleSubmit = () => {
        if (!category.trim()) {
            toast("All fields must be filled", { type: 'error' });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/add_category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category: category.trim(),
                requiresRecipientDetails: requiresRecipient
            })
        })
        .then(response => {
            if (response.ok) {
                toast('Success', { type: 'success' });
                setChange(!change);
                closeModal();
            } else {
                toast("Category already exists", { type: 'error' });
            }
        })
        .catch(() => toast("Server error", { type: 'error' }))
    }

    const handleEdit = () => {
        if (!category.trim()) {
            toast("All fields must be filled", { type: 'error' });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/edit_category/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category: category.trim(),
                requiresRecipientDetails: requiresRecipient
            })
        })
        .then((res) => {
            if (res.ok) {
                toast('Success', { type: 'success' });
                setChange(!change);
                closeEditModal();
            } else {
                toast("Server error", { type: 'error' });
            }
        })
        .catch(() => toast("Server error", { type: 'error' }))
    }

    const handleDelete = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/del_category/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((res) => {
            if (res.ok) {
                toast('Success', { type: 'success' });
                setChange(!change);
            } else {
                toast("Server error", { type: 'error' });
            }
        })
    }

    const [search, setSearch] = useState(null);

    const filteredData = data.filter((item) => {
        if (search === '' || search === null) return true;
        return item.category.toLowerCase().includes(search.toLowerCase());
    })

    // Shared between the add and edit modals
    const RecipientToggle = (
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
            <input
                type="checkbox"
                className="mt-1"
                checked={requiresRecipient}
                onChange={e => setRequiresRecipient(e.target.checked)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-400">
                <b>Requires recipient details</b>
                <br />
                For gift-style categories such as Flowers. At checkout the buyer is asked for
                same-day delivery, the recipient's name, phone and address, a card note, and must
                confirm the recipient will be available.
            </span>
        </label>
    )

    return (
        <div>
            <PageTitle>Manage Categories</PageTitle>
            <ToastContainer />

            <div className="flex mr-5 mb-5 justify-between">
                <input type="text"
                    placeholder='Search ...'
                    className='p-2 rounded-lg bg-transparent border border-gray-300 dark:border-gray-500 text-black dark:text-gray-500'
                    onChange={(e) => e.target.value === "" ? setSearch(null) : setSearch(e.target.value)}
                />
                <Button onClick={openModal}>Add new category</Button>
            </div>

            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Category</TableCell>
                            <TableCell>Checkout Rules</TableCell>
                            <TableCell>Actions</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {loading ? <tr><TableCell>Loading...</TableCell></tr> :
                        filteredData.length === 0 ? <tr><TableCell>No Records</TableCell></tr> :
                        filteredData.map((dt) => (
                            <TableRow key={dt._id}>
                                <TableCell>
                                    <span className="text-sm">{dt.category}</span>
                                </TableCell>
                                <TableCell>
                                    {dt.requiresRecipientDetails
                                        ? <Badge type="danger">Recipient details</Badge>
                                        : <span className="text-xs text-gray-400">Standard</span>}
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-4'>
                                        <button onClick={e => {
                                            e.preventDefault();
                                            setEditId(dt._id);
                                            setCategory(dt.category);
                                            setRequiresRecipient(Boolean(dt.requiresRecipientDetails));
                                            setEditModalOpen(true);
                                        }} className='text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>Edit</button>
                                        <button onClick={e => {
                                            e.preventDefault();
                                            handleDelete(dt._id);
                                        }} className='text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Delete</button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableFooter></TableFooter>
            </TableContainer>

            {/* Add */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalHeader>Add Category</ModalHeader>
                <ModalBody>
                    <Label>
                        <span>Category</span>
                        <Input className="mt-1" type="text" placeholder="Category"
                            value={category} onChange={e => setCategory(e.target.value)} required />
                    </Label>
                    {RecipientToggle}
                </ModalBody>
                <ModalFooter>
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={closeModal}>Cancel</Button>
                    </div>
                    <div className="hidden sm:block">
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={closeModal}>Cancel</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" onClick={handleSubmit}>Submit</Button>
                    </div>
                </ModalFooter>
            </Modal>

            {/* Edit */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                <ModalHeader>Edit Category</ModalHeader>
                <ModalBody>
                    <Label>
                        <span>Category</span>
                        <Input className="mt-1" type="text" placeholder="category"
                            value={category} onChange={e => setCategory(e.target.value)} required />
                    </Label>
                    {RecipientToggle}
                </ModalBody>
                <ModalFooter>
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={closeEditModal}>Cancel</Button>
                    </div>
                    <div className="hidden sm:block">
                        <Button onClick={handleEdit}>Submit</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={closeEditModal}>Cancel</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" onClick={handleEdit}>Submit</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ManageCategories