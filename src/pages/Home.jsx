import React, { useEffect, useState } from 'react'
// import "./styles.css";
import Properties from '../components/Properties';
import { RingLoader } from 'react-spinners';
import Properties2 from '../components/Properties2';

export default function Home() {
  const [peopleData, setPeopleData] = useState([]);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    async function doFetching() {
      try {
        let data = await fetch(`/api/user/properties`);

        if (!data.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        data = await data.json();
        console.log("Fetched data", data);

        const allProducts = [];
        data.map((user) => {
          user.map((property) => {
            allProducts.push(property.data);
          })
        });
        setPeopleData(allProducts);
        console.log("All fetched products:", allProducts);
        setLoading2(false);

      } catch (error) {
        throw (error);
      }
    }
    doFetching();
  }, []);
  return (
    <>
      {loading2 ?
        <div className='flex items-center justify-center w-full h-screen min-h-[100vh]'>
          {/* #2. We can use react-spinners library to use spinners while fetching data */}
          <RingLoader
            color="#36d7b7"
            size={150}
          />
        </div>
        :
        <div className="App">
          {/* <Properties properties={peopleData} /> */}
          <Properties2 properties={peopleData} />
        </div>}
    </>

  );
}
