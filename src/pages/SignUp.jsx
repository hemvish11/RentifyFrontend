import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
  const [formData, setFormData] = useState({ seller: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleCheck = () => {
    setIsChecked(!isChecked);
    setFormData({
      ...formData,
      seller: !isChecked
    })
  }

  // validations 

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    return newErrors;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      console.log('Form submitted:', formData);
    } else {
      setErrors(formErrors);
      return;
    }



    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log(data);

      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
 
  }
  return (
    <div className='p-3 max-w-lg mx-auto  min-h-[100vh]'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input
          type='text'
          placeholder='First Name'
          id='firstName'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}


        <input
          type='text'
          placeholder='Last Name'
          id='lastName'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}


        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}

        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        <input
          type='number'
          placeholder='Phone Number'
          id='phoneNumber'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}

        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        {errors.password && <p className="text-red-500">{errors.password}</p>}


        <div className='flex gap-2 justify-between'>
          <p>Are you are Seller?</p>
          <input
            type="checkbox"
            checked={isChecked}
            id="seller"
            onChange={handleCheck}
            className='mr-4 form-checkbox h-5 w-5 rounded'
          />
        </div>


        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg
            uppercase hover:opacity-95 disabled:opacity-80' >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>

      <p className='text-red-700 mt-5'>{error && "Something went wrong"}</p>
    </div>
  )
}

export default SignUp