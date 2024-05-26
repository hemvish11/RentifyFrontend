import { Link } from "react-router-dom"
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-black">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 text-white" >
        <Link to="/">
          <h1 className="text-3xl">Rentify</h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/"><li>Home</li></Link>
          <Link to="/about"><li>About</li></Link>
          {currentUser && (currentUser.seller && <Link to="/seller"><li>Your Properties</li></Link>)}
          <Link to="/profile">
            {currentUser ?
              (<img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />) :
              (<li>Sign In</li>)}
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Header