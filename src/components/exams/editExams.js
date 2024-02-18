import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import NavBar from "../navbar";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import dayjs from "dayjs";
import { HOST_URL } from "../../utils/constants";

const EditExam = (props)=>{

    const location = useLocation();
    const navigate  = useNavigate();
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [start_date,setStartDate] = React.useState(dayjs(location.state.start_time));
    const [end_date,setEndDate] = React.useState(dayjs(location.state.end_time));

    const initialFormData = {
      no_of_mcq_questions:location.state.no_of_mcq_questions,
      no_of_programming_questions:location.state.no_of_programming_questions,
      pass_marks: location.state.pass_marks,
      duration:location.state.duration,
      start_time: location.state.start_time,
      end_time:location.state.end_time
    };
    const [formData, updateFormData] = React.useState(initialFormData);

    useEffect(()=>{
      if(sessionStorage.getItem("role") !== "ADMIN"){
        navigate("/authorization-alert");
      }
    },[]);

    const handleChange = (event) => {
      updateFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    };

    const handleStartDate = (event) =>{
      setStartDate(event);
      
    }

    const handleEndDate = (event) =>{
      setEndDate(event);
      
    }

    const handleSubmit = (event)=>{

      const start = start_date.format("YYYY-MM-DD HH:mm");
      const end = end_date.format("YYYY-MM-DD HH:mm");

      formData.start_time = start;
      formData.end_time = end;

      if(formData.no_of_mcq_questions && formData.no_of_programming_questions && formData.start_time
         && formData.duration){
          const exam_id = location.state.exam_id;
          const url = `${HOST_URL}/exam/update/`.concat(exam_id);
          axios.put(url,formData,{headers:{
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': '*'
                  }})
                      .then((response)=>{
                      console.log("Exam Updated Successfully..",response.status);

                        if(response.status === 200){
                          setAlertVal("block");
                          setTimeout(() => {
                            navigate("/exams");
                          },2000);
                        }else{
                          setDanger("block");
                          console.log("Error status code");
                          setTimeout(() => {
                            setDanger("none");
                          }, 3000);
                        }

                      })
                      .catch((error)=>{
                      console.log(error);
                      setDanger("block");
                          setTimeout(() => {
                            setDanger("none");
                          }, 3000);
                      });

                          
      }else{
        setDanger("block");
        console.log("Please Enter all the values");
        setTimeout(() => {
          setDanger("none");
        }, 3000);
      }

    }

    return(
    <>
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
        
        <NavBar ></NavBar>
        <h2>Edit Exam</h2>

        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#E0E0E0', height: '458px',padding:5,borderRadius:5 }} >
            
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Mcq" 
                name="no_of_mcq_questions"variant="outlined" type="number" onChange={handleChange}
                 placeholder="No. of Mcq Questions" defaultValue={location.state.no_of_mcq_questions} ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Programming" 
                name="no_of_programming_questions"variant="outlined" type="number" onChange={handleChange}
                 placeholder="No. of Programming Questions" defaultValue={location.state.no_of_programming_questions}></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Passing Marks" 
                name="pass_marks"variant="outlined" type="number"onChange={handleChange} defaultValue={location.state.pass_marks} ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic"  className="disabled" required label="Duration in Hours" 
                name="duration" variant="outlined" type="number" onChange={handleChange} defaultValue={location.state.duration} ></TextField>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label="Start Date Time"  onChange={handleStartDate} name="start_date"  value={dayjs(location.state.start_time)}/>
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label="End Date Time"  onChange={handleEndDate} name="end_date" value={dayjs(location.state.end_time)} />
                </DemoContainer>
              </LocalizationProvider>
            </div>


            <div className="btn">
                <div>
                <Button variant="contained" fullWidth sx={{mt:2}} onClick={handleSubmit}>Update Exam</Button>
                </div>
            </div>
            </Box>
        </Container>
    

    </>

    );
}

export default EditExam;