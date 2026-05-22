import React from 'react'
import {useAuth} from "../hooks/useAuth.js"
import {Navigate} from "react-router-dom"
const Protected=({children})=>{
    const{loading,user}=useAuth()

    if(loading){
        return <main>Loading...</main>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return children
}

export default Protected