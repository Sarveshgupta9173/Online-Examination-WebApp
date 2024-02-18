import { Alert, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import NavBar from "../navbar";
import CheckIcon from '@mui/icons-material/Check';
import { HOST_URL } from "../../utils/constants";


const Exams = (props)=>{

    const [tableData, setTableData] = React.useState([]);
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    let questionCount;
    const url = `${HOST_URL}/exam/get`;
    const navigate = useNavigate();

    const columns = [
        { field: 'exam_id', headerName: 'ID',width:100 },
        { field: 'difficulty_level', headerName: 'Exam Level',width:100 },
        { field: 'no_of_mcq_questions', headerName: 'Mcq Questions',width:100 },
        { field: 'no_of_programming_questions', headerName: 'Programming Questions',width:100 },
        { field: 'pass_marks', headerName: 'Passing Marks',width:100 },
        { field: 'duration', headerName: 'Duration(Minutes)',width:130 },
        { field: 'start_time', headerName: 'Start Time',width:150 },
        { field: 'end_time', headerName: 'End Time',width:150 },
        { field: "Assign Questions", renderCell: (cellValues) => {
          return (
            <Button variant="outlined" color="primary"onClick={(event) => {handleAssign(event, cellValues);}} >
              Assign Questions
            </Button>
          ); } , width:180
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
    
      const handleEdit = (event,cellValues)=>{
            navigate('/edit-exam',{state:cellValues.row});
        }

        const handleAssign = (event,cellValues)=>{
          navigate("/question-exams",{state:cellValues.row});
        }

        const handleDelete = (event,cellValues)=>{
            const id = cellValues.row.exam_id;
            const deleteUrl  = `${HOST_URL}/exam/delete/`.concat(id);
    
            axios.delete(deleteUrl)
                .then((response)=>{
                  console.log(response.data);
                  if(response.status === 200){
                    setAlertVal("block");
                    setTimeout(() => {
                      setAlertVal("none");
                    }, 2000);
                  }else{
                    setDanger("block");
                    setTimeout(() => {
                      setDanger("none");
                    }, 2000);
                  }
                  
                })
                .catch((error)=> {

                    setDanger("block");
                    setTimeout(() => {
                      setDanger("none");
                    }, 2000);
                    console.log(error);
                    
            });
            navigate('/exams');
        }

        useEffect(()=>{
          if(sessionStorage.getItem("role") != "ADMIN"){
            navigate("/authorization-alert");
          }
        axios.get(url)
            .then((response)=>{
                setTableData(response.data);
                // console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },[alert]);

    const handleCreateExam = ()=>{

      const get_question_count = `${HOST_URL}/question/get-question-count`;
      axios.get(get_question_count)
            .then((response)=>{
              questionCount = response.data;
               navigate("/create-exam",{state:questionCount});

            })
            .catch((error)=>{
              console.log(error);
            })
            console.log(typeof questionCount);
    }

    return(
        <>
        <NavBar></NavBar>
        <div className="alert" style={{display:alert}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
             Here is a gentle confirmation that your action was successful.
        </Alert>
        </div>
        <div className="alert" style={{display:danger}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
             Invalid Exam. Cannot Delete Exam the Assigned Exam.
        </Alert>
        </div> 
         <Button color="primary" variant="contained" className="btn" sx={{mt:5}} onClick={handleCreateExam}> Create New Exam 
        <AddIcon fontSize="medium"></AddIcon>
        </Button>
        


        <div style={{ width: '90%' }}>
            <DataGrid sx={{ml:20,mt:5}} rows={tableData} columns={columns} getRowId={(row) => row.exam_id} ></DataGrid>
        </div>

        
        </>
    );

}
export default Exams;