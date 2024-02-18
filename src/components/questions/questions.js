import React, { useEffect } from "react";
import Link from "@mui/material/Link";
import { Alert, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../navbar";
import CheckIcon from '@mui/icons-material/Check';
import { HOST_URL } from "../../utils/constants";


const Questions = (props)=>{
    
    const [tableData, setTableData] = React.useState([]);
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const navigate = useNavigate();

    const columns = [
        { field: 'question_id', headerName: 'ID',width:80 },
        { field: 'question_type', headerName: 'Type',width:100 },
        { field: 'categories', headerName: 'Category',width:100 },
        { field: 'difficulty_level', headerName: 'Difficulty Level',width:100 },
        { field: 'question', headerName: 'Question',width:200 },
        { field: 'option_A', headerName: 'Option A',width:100 },
        { field: 'option_B', headerName: 'Option B',width:100 },
        { field: 'option_C', headerName: 'Option C',width:100 },
        { field: 'option_D', headerName: 'Option D',width:100 },
        { field: 'answer', headerName: 'Correct Option',width:100 },
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
    
      const handleEdit = (event,cellValues)=>{
            console.log(cellValues.row);

            navigate('/edit-question',{state:cellValues.row});

            
        }
        const handleDelete = (event,cellValues)=>{
            const id = cellValues.row.question_id;
            const deleteUrl  = `${HOST_URL}/question/delete/`.concat(id);
    
            axios.delete(deleteUrl)
                .then(()=>{
                  setAlertVal("block");
                  setTimeout(() => {
                    setAlertVal("none");
                  }, 2000);
                })
                .catch(function (error) {
                    console.log(error);
                    setDanger("block");
                    setTimeout(() => {
                      setDanger("none");
                    }, 2000);
            });
            navigate('/questions');
        }

        useEffect(()=>{
        const getUrl = `${HOST_URL}/question/get`;

           axios.get(getUrl)
                .then((response)=>{
                    setTableData(response.data);
                    console.log(response.data);
                })
                .catch((error) =>{
                    console.log(error);
                });
        },[]);


    return (
        <>
        <NavBar></NavBar>
        <div className="alert" style={{display:alert}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
             Here is a gentle confirmation that your action was successful.
        </Alert>
        </div> 
        <div className="alert" style={{display:danger}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
             Please Fill out all the Fields 
        </Alert>
        </div> 
        <Button color="primary" variant="contained" className="btn" sx={{mt:5}} onClick={()=>{navigate("/create-question")}}> Create New Question 
        <AddIcon fontSize="medium"></AddIcon>
        <Link to={{path:"/create-question"}}></Link> </Button>

        <div style={{ width: '100%' }}>
            <DataGrid sx={{margin:5,mt:5}} rows={tableData} columns={columns} getRowId={(row) => row.question_id} ></DataGrid>
        </div>
        </>
    );
}

export default Questions;