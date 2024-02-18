import React, { useEffect } from "react";
import NavBar from "../navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { HOST_URL } from "../../utils/constants";


const StudentPersonalDashbobard = (props)=>{
    
    const location = useLocation();
    const navigate = useNavigate();
    const [tableData, setTableData] = React.useState([]);

    const columns = [
        { field: 'user_id', headerName: 'ID',width:100 },
        { field: 'first_name', headerName: 'First Name',width:150 },
        { field: 'last_name', headerName: 'Last Name',width:150 },
        { field: 'email', headerName: 'Email',width:200 },
        { field: "Exams", renderCell: (cellValues) => {
            return (
              <Button variant="contained" color="primary"onClick={(event) => {handleExamAssign(event, cellValues);}} >
                VIEW Exams
              </Button>
            ); } ,width : 190
          },
        { field: "Edit", renderCell: (cellValues) => {
          return (
            <Button disabled={true} variant="contained" color="primary"onClick={(event) => {handleEdit(event, cellValues);}} >
              Edit
            </Button>
          ); } ,
        } 
      ];
      // console.log(tableData[0]);

      useEffect(()=>{

        if(sessionStorage.getItem("role") !== "STUDENT"){
          navigate("/authorization-alert");
        }
        const user_email = location.state.email;
        const get_url = `${HOST_URL}/user/get-by-email/`.concat(user_email);
        axios.get(get_url)
            .then((response)=>{
                setTableData(response.data);
            })
            .catch((error)=>{
                console.log(error);
            })

    },[]);

      const handleEdit = ()=>{

      }

      const handleExamAssign = ()=>{
        navigate("/student-personal-exam-info",{state:tableData[0]});
      }
    

    return(
    <>
    <NavBar></NavBar>
    <h2>Student Personal Dashboard</h2>
    <div style={{ width: '90%' }}>
            <DataGrid sx={{ml:20,mt:5}} rows={tableData} columns={columns} getRowId={(row) => row.user_id} ></DataGrid>
    </div>

 
    </>
    );
}

export default StudentPersonalDashbobard;