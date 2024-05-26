import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux"


export default function SingleProperty({ property, setCurrUserData, setClicked, setSellerInfo }) {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [heartFilled, setHeartFilled] = useState(currentUser ? (currentUser.likedProperties.includes(property.uniqueId) ? true : false) : false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHeartFilling = async (e) => {
    e.stopPropagation()
    if (!currentUser) {
      navigate("/sign-in")
      return;
    }
    console.log("Likes:", property);
    console.log("CurrenUser:", currentUser);

    let newLikes = heartFilled === false ? 1 : -1;
    newLikes += property.likes;

    // updating my likedproperties

    // we have to use ...rest operator while useing currentstate & using dispatch
    let newLikedProperties = [...currentUser.likedProperties];
    if (currentUser.likedProperties.includes(property.uniqueId)) {
      newLikedProperties = newLikedProperties.filter(item => item !== property.uniqueId);
      console.log("True/false:", currentUser.likedProperties.includes(property.uniqueId))
    } else {
      newLikedProperties.push(property.uniqueId);
      console.log("True/false:", currentUser.likedProperties.includes(property.uniqueId))
    }

    // updating likes property owner
    try {
      dispatch(updateUserStart());

      const response = await fetch(`/api/user/update/property/updateLikes/${property.sellerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId: property.sellerId, uniqueId: property.uniqueId, newLikes: newLikes }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const updatedUser = await response.json();
      console.log('After likes user:', updatedUser);





      const response2 = await fetch(`/api/user/update/updateMyLikedProperties/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likedProperties: newLikedProperties }),
      });

      if (!response2.ok) {
        throw new Error('Network response was not ok ' + response2.statusText);
      }

      const updatedUser2 = await response2.json();
      console.log('my likes updated:', updatedUser2);
      dispatch(updateUserSuccess({ ...currentUser, likedProperties: newLikedProperties }));

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
    setHeartFilled(!heartFilled);
  }

  const handleOpenDetails = async () => {
    if (!currentUser) {
      navigate("/sign-in");
    }
    console.log("Property to show:", property);
    setCurrUserData(property);
    setClicked(true);

    try {
      let data = await fetch(`/api/user/properties/contact/${property.uniqueId}`);

      if (!data.ok) {
        throw new Error('Network response was not ok ');
      }

      data = await data.json();
      console.log("Fetched seller info:", data);
      setSellerInfo(data);

    } catch (error) {
      console.log(error)
    }
  }

  const handleInterested = (e) => {
    // e.stopPropagation();
    if (!currentUser) {
      navigate("/sign-in");
    }
  }

  return (
    <div className="bg-white hover:bg-gray-100 single-prop-grid cursor-pointer" onClick={handleOpenDetails} >
      <img src={property.path} alt="property-image" />
      <div className="details">
        <h3>
          {property.title} in {property.place}
        </h3>
        <span>
          Area: {property.area} sq. ft. | Bedrooms: {property.bedrooms} |
          Bathrooms: {property.bathrooms}
        </span>
        <div className="flex flex-row justify-between">
          <div>
            Hospitals Nearby: {property.hospital} | College Nearby:{" "}
            {property.college}
          </div>
          <div className="mr-4" onClick={handleHeartFilling}>
            {heartFilled ?
              <img className="w-[20px] hover:scale-110" src="/heart.svg" />
              :
              <img className="w-[20px] hover:scale-110" src="/unfilledHeart.svg" />
            }
          </div>
        </div>
      </div>

      <div className="info">
        <h3>₹{property.price}/-</h3>
        <button onClick={handleInterested} className="interested hover:scale-105">I'm Interested</button>
      </div>

    </div>
  );
}