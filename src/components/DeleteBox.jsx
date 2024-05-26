import React, { useEffect, useState } from 'react'
import {
    updateUserStart, updateUserSuccess, updateUserFailure
} from '../redux/user/userSlice'

import { useDispatch, useSelector } from "react-redux"

const DeleteBox = ({
    initialFormData,
    setFormData,
    setDeleteBoxOpened,
    currentProperty,
    setCurrentProperty,
}) => {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [isDeleted2Open, setDeleted2Open] = useState(false);
    const [newData, setNewData] = useState(currentUser.products);
    const dispatch = useDispatch();

    useEffect(() => {
        // Set initial products from currentUser when component mounts
        if (currentUser && currentUser.products) {
            setNewData(currentUser.products);
        }
    }, [currentUser]);

    const handleConfirmDelete = () => {
        setNewData((prevData) =>
            prevData.filter((product) => product.data.uniqueId !== currentProperty.uniqueId)
        );
        setDeleted2Open(true);
    }


    const handleDeleteProperty = async (e) => {
        e.preventDefault();
        console.log("Data after deletion will be:", newData);

        try {
            dispatch(updateUserStart());

            const response = await fetch(`/api/user/update/property/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products: newData }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const updatedUser = await response.json();
            console.log("Data after deletion is:", updatedUser);


            // Update Redux state with the new user data
            dispatch(updateUserSuccess(updatedUser));

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
        setDeleteBoxOpened(false);
        setDeleted2Open(false);

    }

    const handleClose = () => {
        setDeleteBoxOpened(false);
        dispatch(updateUserFailure(error));
    }


    return (
        <div>

            <div id="modal-bg" className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">


                <div id="modal" className="bg-white p-8 rounded-lg shadow-lg w-[90%] lg:w-1/2 relative">
                    <img onClick={handleClose} className='h-[25px] w-[25px] absolute right-[20px] top-[20px] cursor-pointer' src='/cross.svg' />

                    <div className="flex justify-center items-center mb-4">
                        <h2 className="text-lg font-semibold">Are you sure you want to delete this property</h2>
                    </div>

                    <div className='flex items-center justify-center flex-wrap'>
                        <button onClick={handleConfirmDelete} type='button' className='bg-red-600 hover:bg-red-700 text-white py-2 px-6 text-lg rounded-lg'>Delete Property</button>
                    </div>

                </div>



            </div>

            {isDeleted2Open &&
                <div id="modal-bg" className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">

                    <div id="modal" className="bg-white p-8 rounded-lg shadow-lg w-[90%] lg:w-1/2 relative">
                        <img onClick={handleClose} className='h-[25px] w-[25px] absolute right-[20px] top-[20px] cursor-pointer' src='/cross.svg' />

                        <div className="flex justify-center items-center mb-4">
                            <h2 className="text-lg font-semibold">The property will be not be recovered.</h2>
                        </div>

                        <div className='flex items-center justify-center flex-wrap'>
                            <button onClick={handleDeleteProperty} type='button' className='bg-red-600 hover:bg-red-700 text-white py-2 px-6 text-lg rounded-lg'>Confirm Delete</button>
                        </div>

                    </div>
                </div>
            }

        </div>

    )
}

export default DeleteBox