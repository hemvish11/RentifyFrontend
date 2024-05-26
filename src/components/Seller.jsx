import React, { useState, useEffect } from 'react'
import Form from './Form'
import { RingLoader } from 'react-spinners'
import { useDispatch, useSelector } from "react-redux"
import UpdateBox from './Updatebox'
import DeleteBox from './DeleteBox'
import SingleProperty2 from './SingleProperty2'
import SingleProperty3 from './SingleProperty3'

function Seller() {
  // -------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------all states initialization (starts)--------------------------------------------------------

  const [formOpened, setFormOpened] = useState(false);
  const [updateBoxOpened, setUpdateBoxOpened] = useState(false);
  const [deleteBoxOpened, setDeleteBoxOpened] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [newData, setNewData] = useState(currentUser.products);

  const initialFormData = {
    uniqueId: 0,
    sellerId: currentUser._id,
    title: "",
    place: "",
    fullAddress: "",
    area: null,
    bedrooms: null,
    bathrooms: null,
    hospital: "",
    college: "",
    price: null,
    owner: "",
    likes: null,
    path: ""
    // path: "https://img.staticmb.com/mbphoto/property/cropped_images/2024/Feb/28/Photo_h0_w320/71601305_2_PropertyImage134-35415154788222_0_320.jpg"
  };

  const [formData, setFormData] = useState(initialFormData);

  const [peopleData, setPeopleData] = useState([]);
  const [currUserData, setCurrUserData] = useState({});
  const [clicked, setClicked] = useState(false);
  const [noDataFetched, setNoDataFetched] = useState(false);
  const [loading2, setLoading2] = useState(true);

  const [currentProperty, setCurrentProperty] = useState({});


  // -------------------------------------------------------------all states initialization (ends)--------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // Set initial products from currentUser when component mounts
    if (currentUser && currentUser.products) {
      setNewData(currentUser.products);
    }
  }, [currentUser]);


  const handleFormOpen = () => {
    setFormOpened(!formOpened);
  }

  useEffect(() => {
    async function doFetching() {
      console.log(currentUser)

      try {
        let data = await fetch(`/api/user/properties/${currentUser._id}`);

        if (!data.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        data = await data.json();
        console.log(data);
        setPeopleData(data);
        setLoading2(false);

      } catch (error) {
        setNoDataFetched(true);
        throw (error);
      }
    }
    if (currentUser) {
      doFetching();
    }
  }, [currentUser]);

  // to stop parent's event to happen

  // const handleUpdate = (e, item) => {
  //   e.stopPropagation();
  //   console.log(item.data.title);
  //   setCurrentProperty(item.data);
  // }


  return (
    <section className={`flex flex-col items-center justify-start relative  ${formOpened ? "min-h-[168vh]" : "min-h-[100vh]"}`}>
      <div className="max-w-[90%]">


        <button onClick={handleFormOpen} className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 text-lg rounded-lg absolute right-10 top-[10px]'>Add new property</button>

        <section className='pt-[10px]'>
          {
            noDataFetched ?

              <div className='flex justify-center items-center'>
                <h1 className='font-semibold text-3xl mt-4'>No Data to Show</h1>
              </div>

              :

              (loading2 ?

                <div className='flex items-center justify-center w-full h-screen'>
                  {/* #2. We can use react-spinners library to use spinners while fetching data */}
                  <RingLoader
                    color="#36d7b7"
                    size={150}
                  />
                </div>
                :
                <>
                  <h1 className='text-2xl font-semibold mt-8 ml-8 text-black md:text-center'>Your Properties</h1>
                  {peopleData.map((property, index) => {
                    return <SingleProperty2 key={property.data.uniqueId} peopleData={peopleData} index={index} setCurrentProperty={setCurrentProperty} setUpdateBoxOpened={setUpdateBoxOpened} setDeleteBoxOpened={setDeleteBoxOpened} property={property.data} setCurrUserData={setCurrUserData} setClicked={setClicked} />
                  })
                  }


                  {/* {
                    peopleData.map((item, index) => {
                      console.log(item);
                      return ( */}
                  {/* <div key={index} className='m-4 border border-black transition-all hover:shadow-xl p-4 hover:bg-green-300 cursor-pointer rounded-lg bg-gray-200'
                          onClick={() => {
                            setCurrUserData(item);
                            console.log(item)
                            setClicked(true);
                          }}
                        > */}
                  {/* <div className='flex gap-2 justify-between'> */}
                  {/* <div>
                              <h1 className='font-semibold'>{item.data.title}</h1>
                              <p className='text-xs text-gray-600 font-semibold'>Place:{item.data.place}</p>
                              <p className='text-xs text-gray-600 font-semibold mt-5'>Click for more info</p>
                            </div> */}
                  {/* it doesn;t give direct items */}
                  {/* <div className='flex flex-col gap-2 z-10'>
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentProperty(peopleData[index].data);
                                  setUpdateBoxOpened(true);
                                  console.log(peopleData[index].data);
                                }
                                } className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 text-lg rounded-lg'>Update Property</button>
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentProperty(peopleData[index].data);
                                  setDeleteBoxOpened(true);
                                  console.log(peopleData[index].data);

                                }}
                                className='bg-red-600 hover:bg-red-700 text-white py-2 px-6 text-lg rounded-lg'>Delete Property</button>
                            </div> */}
                  {/* </div> */}
                  {/* </div> */}
                  {/* )
                    })
                  } */}

                </>)
          }
        </section>
        {clicked &&
          <div className="backgroundOverlay left-0 right-0 top-0 bottom-0 fixed rgba(127, 255, 212, 0.7)">
          </div>
        }
        <div className={`${clicked ? " md:w-1/2 fixed top-8 left-2 right-2 md:left-[25vw] md:right-[25vw] md:top-[65px]  border p-4 rounded-lg shadow-lg " : "w-0"} bg-white`}>

          {clicked && currUserData &&
            <div className='relative'>
              <div className='flex flex-col justify-center items-center'>
                <img src={currUserData.path} alt={`${currUserData.path}-pic`} className='w-[300px]' />
                <h1 className='font-semibold'>{currUserData.title}</h1>
              </div>

              <div
                onClick={() => setClicked(false)}
                className='absolute top-0 right-0 cursor-pointer'><img style={{ width: '40px', height: '40px' }} src='./cross.svg' /></div>

              <div className='flex flex-col justify-start items-start'>
                <p className='text-gray-900 font-semibold'>Title: <span className='text-gray-700'>{currUserData.title} </span></p>
                <p className='text-gray-900 font-semibold'>City: <span className='text-gray-700'>{currUserData.place}</span></p>
                <p className='text-gray-900 font-semibold'>Full Address: <span className='text-gray-700'>{currUserData.fullAddress}</span></p>
                <p className='text-gray-900 font-semibold'>Apartment Area : <span className='text-gray-700'>{currUserData.area}</span></p>
                <p className='text-gray-900 font-semibold'>Bedrooms: <span className='text-gray-700'>{currUserData.bedrooms}</span></p>
                <p className='text-gray-900 font-semibold'>Bathrooms: <span className='text-gray-700'>{currUserData.bathrooms}</span></p>
                <p className='text-gray-900 font-semibold'>Hospital Nearby: <span className='text-gray-700'>{currUserData.hospital}</span></p>
                <p className='text-gray-900 font-semibold'>College Nearby: <span className='text-gray-700'>{currUserData.college}</span></p>
                <p className='text-gray-900 font-semibold'>Price: <span className='text-gray-700'>{currUserData.price}</span></p>
                <p className='text-gray-900 font-semibold'>Owner: <span className='text-gray-700'>{currUserData.owner}</span></p>
                <div className="flex flex-col items-center justify-center gap-2 w-full">
                  {/* <EmailForm buyerEmail={currentUser.email} buyerMob={currentUser.phoneNumber} sellerEmail={sellInfo.email} sellerMob={sellInfo.phoneNumber} /> */}
                  {/* <p className="text-green-700">Contact details have sent your email address.</p> */}

                </div>


              </div>


            </div>

          }
        </div>
        {formOpened &&
          <Form
            initialFormData={initialFormData}
            setFormData={setFormData}
            setFormOpened={setFormOpened}
            newData={newData}
            setNewData={setNewData}
            setPeopleData={setPeopleData}
          />
        }


        {updateBoxOpened &&
          <UpdateBox
            initialFormData={initialFormData}
            setFormData={setFormData}
            setUpdateBoxOpened={setUpdateBoxOpened}
            currentProperty={currentProperty}
            setCurrentProperty={setCurrentProperty}
          />
        }

        {deleteBoxOpened &&
          <DeleteBox
            initialFormData={initialFormData}
            setFormData={setFormData}
            setDeleteBoxOpened={setDeleteBoxOpened}
            currentProperty={currentProperty}
            setCurrentProperty={setCurrentProperty}
          />
        }

      </div>
    </section>
  )
}

export default Seller