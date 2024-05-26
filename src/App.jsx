import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/private/PrivateRoute";
import Seller from "./components/Seller";
import PrivateRoute2 from "./components/private/PrivateRoute2";
import Footer from "./components/Footer";
function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/seller" element={<Seller />} /> */}
        </Route>
        <Route element={<PrivateRoute2 />}>
          <Route path="/seller" element={<Seller />} />
          {/* <Route path="/seller" element={<Seller />} /> */}
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
