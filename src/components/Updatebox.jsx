import React, { useEffect, useRef, useState } from 'react'
import {
    updateUserStart, updateUserSuccess, updateUserFailure
} from '../redux/user/userSlice'
import { app } from '../firebase'

import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage"
import { useDispatch, useSelector } from "react-redux"

const UpdateBox = ({
    initialFormData,
    setFormData,
    setUpdateBoxOpened,
    currentProperty,
    setCurrentProperty
}) => {
    const [data, setData] = useState(currentProperty);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [newData, setNewData] = useState(currentUser.products);
    const [propertiesUpdated, setPropertiesUpdated] = useState(false);
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageUploadStart, setImageUploadStart] = useState(false)
    const [errors, setErrors] = useState({});
    const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);


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
        setIsNewImageUploaded(true);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercent(Math.round(progress));
        }, (error) => {
            setImageError(true);
            setIsNewImageUploaded(false);
        }, () => {
            setImageUploadStart(false);
            setErrors({});
            // setIsNewImageUploaded(true);
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
        if (!data.path || (data.place == "https://img.staticmb.com/mbphoto/property/cropped_images/2024/Feb/28/Photo_h0_w320/71601305_2_PropertyImage134-35415154788222_0_320.jpg")) {
            newErrors.path = 'Image is required';
        }


        return newErrors;
    };





    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("New Data:", newData);

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

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setData(initialFormData);
        }
        setUpdateBoxOpened(false);
        setIsNewImageUploaded(false);
    }

    function handleChange2(e) {
        const { value, name } = e.target;
        setData(prevValue => ({ ...prevValue, [name]: value }));
    }

    const handleClose = () => {
        setUpdateBoxOpened(false);
        dispatch(updateUserFailure(error));
        setPropertiesUpdated(false);
    }

    const handleAddProperty = () => {
        const formErrors = validate();
        if (Object.keys(formErrors).length === 0) {
            console.log('Form submitted:', data);
        } else {
            setErrors(formErrors);
            return;
        }
        setNewData((prevData) =>
            prevData.map((product) => {
                console.log(product.data.uniqueId);
                console.log(data.uniqueId);
                return product.data.uniqueId === data.uniqueId
                    ? { data }
                    : product;
            }
            )
        );
        setPropertiesUpdated(true);
        setErrors({});
    };

    return (
        <div id="modal-bg" className="absolute top-0 left-0 w-full h-[168vh] bg-gray-900 bg-opacity-50 flex justify-center z-50">


            <div id="modal" className="inset-0 top-4 h-fit relative bg-white p-8 rounded-lg shadow-lg w-[90%] lg:w-1/2 ">
                <img onClick={handleClose} className='h-[25px] w-[25px] absolute right-[20px] top-[20px] cursor-pointer' src='/cross.svg' />

                <div className="flex justify-center items-center mb-4">

                    <h2 className="text-lg font-semibold">Update the property</h2>


                </div>




                <form onSubmit={handleSubmit} className='flex items-center justify-center flex-wrap'>
                    {/* <input type="text" name='uniqueId' hidden/> */}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.title} name="title" placeholder="Title" />
                    {errors.title && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.title}</p>}

                    <label className='w-full flex justify-start border-1 m-1 p-1 rounded-lg '>
                        <span className=' text-gray-500 opacity-80'>City:</span>
                        <select
                            required
                            id="filter-place"
                            name="place"
                            value={data.place}
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

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.fullAddress} name="fullAddress" placeholder="Place" />
                    {errors.fullAddress && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.fullAddress}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={data.area} name="area" placeholder="Area" />
                    {errors.area && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.area}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={Number(data.bedrooms)} name="bedrooms" placeholder="Bedrooms" />
                    {errors.bedrooms && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.bedrooms}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={Number(data.bathrooms)} name="bathrooms" placeholder="Bathrooms" />
                    {errors.bathrooms && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.bathrooms}</p>}

                    {/* <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.hospital} name="hospital" placeholder="Hospital" /> */}
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

                    {/* <input required className='border-1 m-1 p-1 rounded-lg w-full' type="text" onChange={handleChange2} value={data.college} name="college" placeholder="College" /> */}
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

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="number" onChange={handleChange2} value={Number(data.price)} name="price" placeholder="Price" />
                    {errors.price && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.price}</p>}

                    <input required className='border-1 m-1 p-1 rounded-lg w-full' type="owner" onChange={handleChange2} value={data.owner} name="owner" placeholder="Owner" />
                    {errors.owner && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.owner}</p>}

                    <div className="flex gap-2 justify-between items-center w-full">
                        <div className="flex flex-col justify-between items-center w-full">
                            <p className='m-1 p-1 text-left w-full text-gray-500 opacity-60'>Upload your property's image (New Image)</p>

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
                            src={currentUser.path || data.path}
                            alt='profile'
                            className='h-24 w-24 self-center cursor-pointer object-cover mt-2'
                            onClick={() => fileRef.current.click()}
                            name="path"
                        />
                    </div>
                    {errors.path && <p className="text-red-500 w-full m-1 p-1 text-sm">{errors.path}</p>}




                    {/* ---=------- Photo Uploading Visuals starts----------- */}

                    <p className='text-sm w-full flex flex-col'>
                        {!isNewImageUploaded &&
                            <span className='text-red-700'>
                                Please upload new image
                            </span>
                        }

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

                    {/* we should never use onCLick on the submit button */}
                    <div className='flex items-center justify-center w-[100%] gap-4'>
                        {/* if button was not specified then it was working as a submit button */}
                        {!propertiesUpdated && <button disabled={!isNewImageUploaded && imageUploadStart} type='button' onClick={handleAddProperty} className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 text-lg rounded-lg`}>Update Property</button>}
                        {propertiesUpdated && <button type="submit" className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 text-lg rounded-lg'>Submit</button>}
                    </div>

                </form>

            </div>



        </div>
    )
}

export default UpdateBox