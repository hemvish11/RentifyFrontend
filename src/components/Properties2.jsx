import { useState } from "react";
import SingleProperty from "./SingleProperty";
import EmailForm from "./emailjs/EmailForm";
import { useSelector } from "react-redux";
import Pagination from "./Pagination";

export default function Properties2({ properties }) {
    const [clicked, setClicked] = useState(false);
    const [currUserData, setCurrUserData] = useState({});
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [sellInfo, setSellerInfo] = useState({});
    const [isEmailSent, setIsEmailSent] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const [filters, setFilters] = useState({
        place: "",
        fullAddress: "",
        minArea: 0,
        maxArea: 5400,
        bedrooms: 0,
        bathrooms: 0,
        hospital: "",
        college: "",
        minPrice: 0,
        maxPrice: 85000,
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]:
                name === "place" || name === "hospital" || name === "college"
                    ? value
                    : Number(value),
        });
    };

    // const filteredProperties = properties;
    const filteredProperties = properties.filter((property) => {
        console.log(property);
        return (
            (filters.place ? property.place === filters.place : true) &&
            property.area >= filters.minArea &&
            property.area <= filters.maxArea &&
            property.bedrooms >= filters.bedrooms &&
            property.bathrooms >= filters.bathrooms &&
            (filters.hospital ? property.hospital === filters.hospital : true) &&
            (filters.college ? property.college === filters.college : true) &&
            property.price >= filters.minPrice &&
            property.price <= filters.maxPrice
        );
    });
    const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);


    return (
        <section className="flex flex-col items-center justify-start  min-h-[100vh]">
            <div className="max-w-[90%]">
                <h2>Showing {filteredProperties.length} properties</h2>
                <div className="filters">
                    <label>
                        Place:
                        <select
                            id="filter-place"
                            name="place"
                            value={filters.place}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Pune">Pune</option>
                        </select>
                    </label>

                    <label>
                        Minimum Area:
                        <input
                            id="filter-min-area"
                            type="number"
                            name="minArea"
                            value={filters.minArea}
                            onChange={handleFilterChange}
                        />
                    </label>

                    <label>
                        Maximum Area:
                        <input
                            id="filter-max-area"
                            type="number"
                            name="maxArea"
                            value={filters.maxArea}
                            onChange={handleFilterChange}
                        />
                    </label>

                    <label>
                        Bedrooms:
                        <input
                            id="filter-bedrooms"
                            type="number"
                            name="bedrooms"
                            value={filters.bedrooms}
                            onChange={handleFilterChange}
                        />
                    </label>

                    <label>
                        Bathrooms:
                        <input
                            id="filter-bathrooms"
                            type="number"
                            name="bathrooms"
                            value={filters.bathrooms}
                            onChange={handleFilterChange}
                        />
                    </label>

                    <label>
                        Hospital Nearby:
                        <select
                            id="filter-hospital"
                            name="hospital"
                            value={filters.hospital}
                            onChange={handleFilterChange}
                        >
                            <option value="">-- No Preference --</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </label>

                    <label>
                        College Nearby:
                        <select
                            id="filter-college"
                            name="college"
                            value={filters.college}
                            onChange={handleFilterChange}
                        >
                            <option value="">-- No Preference --</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </label>
                    <label>
                        Minimum Price:
                        <input
                            id="filter-min-price"
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                    </label>
                    <label>
                        Maximum Price:
                        <input
                            id="filter-max-price"
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </label>
                </div>

                {currentItems.map((property) => (
                    <SingleProperty key={property.uniqueId} property={property} setCurrUserData={setCurrUserData} setClicked={setClicked} setSellerInfo={setSellerInfo} />
                ))}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={page => setCurrentPage(page)}
                />

            </div>

            {clicked &&
                <div className="backgroundOverlay left-0 right-0 top-0 bottom-0 fixed rgba(127, 255, 212, 0.7)">
                </div>
            }
            <div className={`${clicked ? " md:w-1/2 fixed top-4 left-2 right-2 md:left-[25vw] md:right-[25vw] md:top-[10px] border p-4 rounded-lg shadow-lg " : "w-0"} bg-white`}>

                {clicked && currUserData &&
                    <div className='relative'>
                        <div className='flex flex-col justify-center items-center'>
                            <img src={currUserData.path} alt={`${currUserData.path}-pic`} className='w-[300px]' />
                            <h1 className='font-semibold'>{currUserData.title}</h1>
                        </div>

                        <div
                            onClick={() => {
                                setClicked(false)
                                setIsEmailSent(false)
                            }}
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
                                <EmailForm setIsEmailSent={setIsEmailSent} buyerEmail={currentUser.email} buyerMob={currentUser.phoneNumber} sellerEmail={sellInfo.email} sellerMob={sellInfo.phoneNumber} />
                                {isEmailSent && <p className="text-green-700 ">Contact details have sent to your email address.</p>}

                            </div>


                        </div>


                    </div>

                }
            </div>

        </section>
    );
}
