import React, { useEffect } from "react";
import NavBar from "./navbar";
import { useNavigate } from "react-router-dom";

const Admin = ()=>{
    const navigate = useNavigate();

    useEffect(()=>{
        if(sessionStorage.getItem("role") !== "ADMIN"){
            navigate("/authorization-alert");
        }
    },[]);
    

    return (
        <>
        <NavBar></NavBar>
        <h2>Admin Dashboard</h2>
        </>
    )
}

export default Admin;