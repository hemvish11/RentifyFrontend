import React, { useEffect, useRef, useState } from 'react'

import {
    updateUserStart, updateUserSuccess
} from '../redux/user/userSlice'

import { app } from '../firebase'

import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage"

import { useDispatch, useSelector } from "react-redux"

const Form = ({
    initialFormData,
    setFormData,
    setFormOpened,
    newData,
    setNewData
}) => {
    const [data, setData] = useState(initialFormData);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [propertiesAdded, setPropertiesAdded] = useState(false);
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageUploadStart, setImageUploadStart] = useState(false)

    const path = "https://img.staticmb.com/mbphoto/property/cropped_images/2024/Feb/28/Photo_h0_w320/71601305_2_PropertyImage134-35415154788222_0_320.jpg"




    useEffect(() => {
        // Set initial products from currentUser when component mounts
        if (currentUser && currentUser.products) {
            setNewData(currentUser.products);
        }
    }, [currentUser]);

    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);


    const handleFileUpload = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent(Math.round(progress));
        }, (error) => {
            setImageError(true);
        }, () => {
            setImageUploadStart(false);
            setErrors({});
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadUrl) => {
                    setData({ ...data, path: downloadUrl });
                })
        })
    }


    // validations 

    const validate = () => {
        const newErrors = {};

        if (!data.title) {
            newErrors.title = 'Title is required';
        }
        if (!data.place) {
            newErrors.place = 'City is required';
        }
        if (!data.fullAddress) {
            newErrors.fullAddress = 'Full address is required';
        }
        if (!data.area) {
            newErrors.area = 'Apartment Area is required';
        }
        if (!data.bedrooms) {
            newErrors.bedrooms = 'Number of Bedrooms is required';
        }
        if (!data.bathrooms) {
            newErrors.bathrooms = 'Number of Bathrooms is required';
        }
        if (!data.hospital) {
            newErrors.hospital = 'Hospital(Nearby) is required';
        }
        if (!data.college) {
            newErrors.college = 'College(Nearby) is required';
        }
        if (!data.price) {
            newErrors.price = 'Price is required';
        }
        if (!data.owner) {
            newErrors.owner = 'Owner name is required';
        }
        if (!data.path || (data.place=="https://img.staticmb.com/mbphoto/property/cropped_images/2024/Feb/28/Photo_h0_w320/71601305_2_PropertyImage134-35415154788222_0_320.jpg")) {
            newErrors.path = 'Image is required';
        }


        return newErrors;
    };






    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("New added data:", newData);
        console.log("Current user:", currentUser);

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
            console.log('Updated user:', updatedUser);

            // Update Redux state with the new user data
            dispatch(updateUserSuccess(updatedUser));
            setData(initialFormData);
            setPropertiesAdded(false);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setData(initialFormData);
        }
        setFormOpened(false);
    }

    function handleChange2(e) {
        const { value, name } = e.target;
        setData(prevValue => ({ ...prevValue, [name]: value, uniqueId: Date.now() }));
    }

    const handleClose = () => {
        setFormOpened(false);
        // dispatch(updateUserFailure(error));
        setPropertiesAdded(false);
    }

    const handleAddProperty = () => {
        const formErrors = validate();
        if (Object.keys(formErrors).length === 0) {
            console.log('Form submitted:', data);
        } else {
            setErrors(formErrors);
            return;
        }
        setNewData((prev) => [...prev, { data }]);
        setPropertiesAdded(true);
        setErrors({});
    }

    return (
        <div id="modal-bg" className="absolute top-0 left-0 w-full h-[168vh] bg-gray-900 bg-opacity-50 flex justify-center  z-50 overflow-auto">


            <div id="modal" className="inset-0 top-4 h-fit relative bg-white p-8 rounded-lg shadow-lg w-[90%]  lg:w-1/2 ">
                <img onClick={handleClose} className='h-[25px] w-[25px] absolute right-[20px] top-[20px] cursor-pointer' src='/cross.svg' />

                <div className="flex justify-center items-center mb-4">
                    <h2 className="text-lg font-semibold">Add new property</h2>
                </div>

                <form onSubmit={handleSubmit} className='flex items-center justify-center flex-wrap'>

                    {/* <input type="text" name='uniqueId' hidden/> */}
                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.name} name="title" placeholder="Title" />
                    {errors.title && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.title}</p>}

                    <label className='w-full flex justify-start border-1 m-1 p-1 rounded-lg '>
                        <span className=' text-gray-500 opacity-80'>City:</span>
                        <select
                            required
                            id="filter-place"
                            name="place"
                            value={currentUser.place}
                            onChange={handleChange2}
                        >
                            <option value="">Any</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Pune">Pune</option>
                        </select>
                    </label>
                    {errors.place && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.place}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.name} name="fullAddress" placeholder="Full address" />
                    {errors.fullAddress && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.fullAddress}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={data.name} name="area" placeholder="Apartment Area(sqft)" />
                    {errors.area && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.area}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={data.name} name="bedrooms" placeholder="Bedrooms" />
                    {errors.bedrooms && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.bedrooms}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={data.name} name="bathrooms" placeholder="Bathrooms" />
                    {errors.bathrooms && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.bathrooms}</p>}

                    {/* <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.name} name="hospital" placeholder="Hospital(Nearby)" /> */}
                    <label className='w-full flex justify-start border-1 m-1 p-1 rounded-lg '>
                        <span className=' text-gray-500 opacity-80'>Hospital(Nearby):</span>
                        <select
                            required
                            id="filter-place"
                            name="hospital"
                            value={currentUser.place}
                            onChange={handleChange2}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </label>
                    {errors.hospital && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.hospital}</p>}

                    {/* <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.name} name="college" placeholder="College(Nearby)" /> */}
                    <label className='w-full flex justify-start border-1 m-1 p-1 rounded-lg '>
                        <span className=' text-gray-500 opacity-80'>College(Nearby):</span>
                        <select
                            required
                            id="filter-place"
                            name="college"
                            value={currentUser.place}
                            onChange={handleChange2}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </label>
                    {errors.college && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.college}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={data.name} name="price" placeholder="Price" />
                    {errors.price && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.price}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.name} name="owner" placeholder="Owner name" />
                    {errors.owner && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.owner}</p>}

                    {/* <input readOnly className='border-1 m-1 p-1 rounded-lg w-full' type="text"  value={"https://img.staticmb.com/mbphoto/property/cropped_images/2024/Feb/28/Photo_h0_w320/71601305_2_PropertyImage134-35415154788222_0_320.jpg"} name="path" placeholder="Images" /> */}

                    <div className="flex gap-2 justify-between items-center w-full">
                        <div className="flex flex-col justify-between items-center w-full">
                            <p className='m-1 p-1 text-left w-full text-gray-500 opacity-60'>Upload your property's image</p>

                            <input
                                required
                                type='file'
                                ref={fileRef}
                                // hidden
                                accept='image/*'
                                onChange={(e) => {
                                    setImage(e.target.files[0])
                                    setImageUploadStart(true)
                                }}
                                className='border-1 m-1 p-1 rounded-lg w-full'
                                name="path"
                            />
                        </div>
                        <img
                            src={path || data.path}
                            alt='profile'
                            className='h-24 w-24 self-center cursor-pointer object-cover mt-2'
                            onClick={() => fileRef.current.click()}
                            name="path"
                        />
                    </div>
                    {errors.path && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.path}</p>}




                    {/* ---=------- Photo Uploading Visuals starts----------- */}

                    <p className='text-sm w-full flex flex-col'>
                        {imageUploadStart &&
                            <span className='text-black'>
                                Please wait image is uploading...
                            </span>
                        }



                        {imageError ? (

                            <span className='text-red-700'>
                                Error uploading image (file size must be less than 2MB)
                            </span>

                        ) : imagePercent > 0 && imagePercent < 100 ? (

                            <span className='text-slate-700'>
                                {`uploading : ${imagePercent} %`}
                            </span>

                        ) : imagePercent === 100 ? (
                            <span className='text-green-700'>
                                Image uploaded successfully
                            </span>
                        ) : ""

                        }

                    </p>


                    {/* ---=------- Photo Uploading Visuals ends----------- */}

                    <input readOnly className='hidden' value={Date.now()} name="uniqueId" />



                    {/* we should never use onCLick on the submit button */}

                    <div className='flex items-center justify-center w-[100%] gap-4'>
                        {/* if type button was not specified then it was working as a submit button */}
                        {!propertiesAdded && <button disabled={imageUploadStart} type='button' onClick={handleAddProperty} className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 text-lg rounded-lg `}>Add Property</button>}
                        {propertiesAdded && <button type="submit" className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 text-lg rounded-lg'>Submit</button>}
                    </div>

                </form>


            </div>


        </div>
    )
}

export default Form