import React, { useEffect } from "react";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { HOST_URL } from "../../utils/constants";

const StudentExamSummary = ()=>{
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const [danger,setDanger] = React.useState("none");
    const [codeQuestion,setCodeQuestion] = React.useState("");
    const [codeAnswer,setCodeAnswer] = React.useState("");
    const [programMarks,setProgramMarks] = React.useState("");
    const [summaryData,setSummaryData] = React.useState([]);
    const objToPost = {
        student:location.state.student,
        exam:location.state.exam,
        question:codeQuestion,
        answer:""
    }
    const student_id = location.state.student.user_id;
    const exam_id = location.state.exam.exam_id;
    const columns = [
        { field: 'question.question_type', headerName: 'Question Type',width:140,valueGetter:({row})=>row.question.question_type },
        { field: 'question.question', headerName: 'Question ',width:200,valueGetter:({row})=>row.question.question },
        { field: 'answer', headerName: 'Given Answer',width:300 ,renderCell:(cellValues)=>{
            if(cellValues.row.question.question_type == "PROGRAMMING"){
                return (<Button variant="contained" color="primary" onClick={(event)=>{handleCodeView(event,cellValues)}} >Review Code</Button>)
            }else{
                return cellValues.row.answer;
            }
        }},
        { field: 'question.answer', headerName: 'Correct Answer',width:200,valueGetter:({row})=>row.question.answer  },
        { field: "marks_obtained",headerName:'Marks Obtained',width : 100},
      ]; 
    // console.log(codeQuestion);

    useEffect(()=>{
        
        const getAllDataUrl = `${HOST_URL}/user-exam-submission/get-by-student-id-exam-id/`.concat(student_id)+`/`.concat(exam_id);

        axios.get(getAllDataUrl)
            .then((response)=>{
                console.log(response.data);
                setSummaryData(response.data);
            })
            .catch((error)=>{
                console.log(error);
            });

        // console.log(summaryData);

    },[]);

    const handleCodeView = (event,cellValues)=>{
        // console.log(cellValues.row);
        setCodeQuestion(cellValues.row.question);
        setCodeAnswer(cellValues.row.answer);
        setProgramMarks(cellValues.row.marks_obtained);
        setOpen(true);

    }




  const handleClose = () => {

    const program_marks = Number(document.getElementById("marks").value);
    if(program_marks > 10 || program_marks < 0){
        setDanger("block");
        setTimeout(() => {
            setDanger("none");
        }, 3000);

    }else{
        // console.log(program_marks);
        objToPost.marks_obtained = program_marks;
        console.log(objToPost);
        const updateProgramMarksUrl = `${HOST_URL}/user-exam-submission/insert-or-update/`;
        axios.post(updateProgramMarksUrl,objToPost,{headers:{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
         }})
            .then((response)=>{
                console.log(response.data);
            })
            .catch((error)=>{
                console.log(error);
            });

         // updating the status after exam completion
      const updateStatusObj = {
        student:location.state.student,
        exam:location.state.exam,
        status:'COMPLETED'
      };

      console.log(updateStatusObj);
      const updateExamStatusUrl = `${HOST_URL}/student-exam/update-student-exam-details`;
      axios.put(updateExamStatusUrl,updateStatusObj)
            .then((response)=>{
              console.log(response.data);
              console.log("status updated successfully");
            })
            .catch((error)=>{
              console.log(error);
            });
        

        setOpen(false);
        window.location.reload();
    }

  };
    return (
        <>
        <NavBar></NavBar>
        
        <div style={{ width: '95%' }}>
            <DataGrid sx={{ml:10,mt:5}} rows={summaryData} columns={columns} getRowId={(row) => row.user_exam_submission_id} ></DataGrid>
        </div>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="alert" style={{display:danger}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
              Enter marks between 1 - 10
        </Alert>
        </div> 
        <DialogTitle id="alert-dialog-title">
          {codeQuestion.question}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField fullWidth value={codeAnswer} multiline></TextField>
            <TextField autoFocus required margin="dense" id="marks" defaultValue={programMarks} sx={{mt:10}}
             name="marks"  label="Enter Marks (0-10)" type="number" fullWidth variant="standard" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setOpen(false)}} autoFocus variant="contained" color="error">
            Close
          </Button>
          <Button onClick={handleClose} autoFocus variant="contained">
            Submit Marks
          </Button>
        </DialogActions>
      </Dialog>

        </>
    );
};

export default StudentExamSummary;