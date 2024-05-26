import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { app } from '../firebase'
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage"
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signOut
} from '../redux/user/userSlice'

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

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
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadUrl) => {
          setFormData({ ...formData, profilePicture: downloadUrl });
        })
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentUser._id }),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
      alert("Your account has been deleted successfully.")
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto  min-h-[100vh]'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />


        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />


        {/* ---=------- Photo Uploading Visuals starts----------- */}

        <p className='text-sm self-center'>

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


        <input
          type='text'
          placeholder='First Name'
          id='firstName'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='text'
          placeholder='Last Name'
          id='lastName'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='number'
          placeholder='Phone Number'
          id='phoneNumber'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />

        <button className='bg-slate-700 text-white p-3 rounded-lg 
                            uppercase hover:opacity-90' >
          {loading ? "Loading..." : "Update"}
        </button>

      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      <p className='text-red-700 mt-5'>
        {error && "Something went wrong!"}
      </p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && "User is updated successfully!"}
      </p>
    </div>
  )
}