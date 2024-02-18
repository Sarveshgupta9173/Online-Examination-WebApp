import React, { useEffect }  from "react";
import NavBar from "../navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import dayjs from "dayjs";
import { HOST_URL } from "../../utils/constants";

const StudentPersonalExamInfo = (props)=>{
    const navigate = useNavigate();
    const location = useLocation();
    const student_id = location.state.user_id;
    const [tableData,setStudentData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [exam,setExam] = React.useState("");
    const [datatoForward,setDataToforward] = React.useState([]);
    const objToPost = {
      student: location.state,
    }
    // console.log(location.state);

    const get_url = `${HOST_URL}/student-exam/get-by-student-id/`.concat(student_id);

    useEffect(()=>{

      if(sessionStorage.getItem("role") !== "STUDENT"){
        navigate("/authorization-alert");
    }
        axios.get(get_url)
        .then((response)=>{
            // console.log(response.data);
            setStudentData(response.data);
        })
        .catch((error)=>{
            console.log(error);
        });

        tableData.forEach(element=>{
            console.log(element);
        })

    },[]);

    const columns = [
        // { field: 'id', headerName: 'Entity ID',width:100 },
        { field: 'exam.exam_id', headerName: 'Exam ID',width:200,valueGetter:({row})=>row.exam.exam_id },
        { field: "status",headerName:'Status',width : 170, renderCell: (cellValues)=>{
            if(cellValues.row.status === "COMPLETED"){
                return (
                    <Button variant="contained" color="error" >
                      COMPLETED
                    </Button>
                  );
            }else if (cellValues.row.status === "REMAINING"){
                return (
                    <Button variant="contained" color="primary"  onClick={(event) => {handleExamStart(event, cellValues);}} >
                      Start Exam
                    </Button>
                  );
            }else{
                return (
                    <Button variant="contained" color="secondary" onClick={handleExamResume} >
                      Resume Exam
                    </Button>
                  ); 
            }
        }
    },
        
      ];

      const handleExamStart = (event,cellValues)=>{
        setExam(cellValues.row.exam);
        // console.log(cellValues.row.exam);
        setOpen(true);
        setDataToforward(cellValues.row);


        if(sessionStorage.getItem("role") !== "STUDENT"){
          navigate("/authorization-alert");
        }
  
          // getting all the questions data 
          // console.log(new Date(parseInt(sessionStorage.getItem("started_time"))*1000).getMinutes());
          const exam_id = cellValues.row.exam.exam_id;
          const getQuestionsUrl = `${HOST_URL}/question-exam/get-all-questions-by-exam-id/`.concat(exam_id);
          axios.get(getQuestionsUrl)
                  .then(async (response)=>{
                      // setAllQuestions(response.data);
                      localStorage.setItem("allQuestions",JSON.stringify(response.data));
                  })
                  .catch((error)=>{
                      console.log(error);
                  });

      }

      const handleClose = () => {
        setOpen(false);

        sessionStorage.setItem("started_time",Date.now());

        objToPost.start_time = dayjs().format("YYYY-MM-DD HH:mm");
        objToPost.exam = exam;
        // console.log(objToPost);
        const postUrl = `${HOST_URL}/user-exam-login/insert-or-update-user-exam-login-details`;
        axios.post(postUrl,objToPost)
              .then((response)=>{
                // console.log(response.data);
              })
              .catch((error)=>{
                console.log(error);
              });

        navigate('/start-exam',{state:datatoForward})
      };
    
    
        const handleExamResume = (event,cellValues)=>{
            
        }
   


    return (
        <>
        <NavBar></NavBar>
        <div style={{ width: '80%' }}>
            <DataGrid sx={{ml:20,mt:5}} rows={tableData} columns={columns} getRowId={(row) => row.id} ></DataGrid>
        </div>

        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Please Read the instructions carefully before starting the exam."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            
            <Typography>There will be 2 Sections in the Exam .</Typography>
            <Typography> Section - 1. Mcq - There will be {exam.no_of_mcq_questions } Mcq's (Logical,Technical,Pseudocode).</Typography>
           <Typography>Section - 2. Programming - There will be {exam.no_of_programming_questions} Programs.</Typography>
           <Typography>-- Note :All the  Programming Questions will appear just after {exam.no_of_mcq_questions } Mcq questions.
                      You won't get separate time for Programming section.</Typography>
            <Typography> Candidate can  take the test from the safe and secure environment of his/her home, with a 
            desktop/laptop/smartphone with a webcam and an internet connection un-interrupted 
            internet speed is desirable.</Typography>
            <Typography> Candidates are requested to take the test honestly, ethically, and should follow all the 
            instructions.</Typography>
           
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

        </>
    );
}

export default StudentPersonalExamInfo;