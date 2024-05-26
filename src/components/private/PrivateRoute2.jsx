import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute2() {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser.seller ? <Outlet /> : <Navigate to="/" />
}