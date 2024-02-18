import axios from "axios";
import { DataGrid } from '@mui/x-data-grid'
import React from "react";
import { useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import NavBar from "../navbar"
import { HOST_URL } from "../../utils/constants";
  


const Student = (props)=>{

    const [tableData, setTableData] = React.useState([]);
    const url = `${HOST_URL}/user/get-by-role/STUDENT`;
    const navigate = useNavigate();

    const columns = [
        { field: 'user_id', headerName: 'ID',width:100 },
        { field: 'first_name', headerName: 'First Name',width:200 },
        { field: 'last_name', headerName: 'Last Name',width:200 },
        { field: 'email', headerName: 'Email',width:200 },
        { field: "Assign Exams", renderCell: (cellValues) => {
            return (
              <Button variant="outlined" color="primary"onClick={(event) => {handleExamAssign(event, cellValues);}} >
                Assign Exams
              </Button>
            ); } ,width : 170
          },
        { field: "Edit", renderCell: (cellValues) => {
          return (
            <Button variant="outlined" color="primary"onClick={(event) => {handleEdit(event, cellValues);}} >
              Edit
            </Button>
          ); } ,
        }, 
        { field: "Delete", renderCell: (cellValues) => {
            return (
              <Button variant="outlined"  color="error" onClick={(event) => {handleDelete(event, cellValues);}} >
                Delete
              </Button>
            ); } ,
          }, 
      ];

      const handleExamAssign = (event,cellValues)=>{
        navigate('/assign-exam',{state:cellValues.row})
      }
    
      const handleEdit = (event,cellValues)=>{
            console.log(cellValues.row);


            navigate('/edit-student',{state:cellValues.row});

            
        }
        const handleDelete = (event,cellValues)=>{
            const id = cellValues.row.user_id;
            const deleteUrl  = `${HOST_URL}/user/delete/`.concat(id);
    
            axios.delete(deleteUrl)
                .then()
                .catch(function (error) {
                    console.log(error);
            });
            // navigate('/student');
            window.location.reload();
        }

    useEffect(()=>{
      if(sessionStorage.getItem("role") != "ADMIN"){
        navigate("/authorization-alert");
      }
        axios.get(url)
            .then((response)=>{
                setTableData(response.data);
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },[]);

    return (
        <>

        <NavBar></NavBar>
        <Button color="primary" variant="contained" className="btn" sx={{mt:5}} onClick={()=>{navigate("/create-student")}}> Create New Student 
        <AddIcon fontSize="medium"></AddIcon>
        <Link to={{path:"/create-student"}}></Link> </Button>


        <div style={{ width: '90%' }}>
            <DataGrid sx={{ml:20,mt:5}} rows={tableData} columns={columns} getRowId={(row) => row.user_id} ></DataGrid>
        </div>

        </>
    );
}

export default Student;