import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login.jsx";
import Register from "./features/auth/pages/register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview.jsx";
import ForgetPass from "./features/auth/pages/ForgetPass.jsx";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>//checking if login or not
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>//checking if login or not
    },
    {
        path:"/forgetPassword",
        element:<ForgetPass/>
    }
])