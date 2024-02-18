import { Alert, Box, Button, Container, FormControlLabel, FormLabel, Radio, RadioGroup,  TextField } from "@mui/material";
import React, { useEffect } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import NavBar from "../navbar";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from "dayjs";
import { HOST_URL } from "../../utils/constants";



const CreateExams = ()=>{

    const location = useLocation();
    const navigate  = useNavigate();
    const mcq_count  = location.state.mcq_count;
    const program_count = location.state.program_count;
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [countError,setCountError] = React.useState("none");
    const [errorMessage,setErrorMessage] = React.useState("");
    const [start_date,setStartDate] = React.useState(Dayjs);
    const [end_date,setEndDate] = React.useState(Dayjs);
    let allAssignedQuestions = [];
    const initialFormData = {
      no_of_mcq_questions:"",
      no_of_programming_questions:"",
      pass_marks: "",
      difficulty_level:"MEDIUM",
      duration:"",
      start_time: "",
      end_time:""
    };
    const [formData, updateFormData] = React.useState(initialFormData);

    const handleChange = (event) => {
      if(formData.no_of_mcq_questions < mcq_count || formData.no_of_mcq_questions < 0){
        if(formData.no_of_programming_questions < program_count || formData.no_of_programming_questions<0){
            
        }else{
          event.preventDefault();
          setCountError("block");
          setErrorMessage(`Error! You have only ${program_count} Programming Questions. `);
          setTimeout(() => {
            setCountError("none");
          }, 3000);
        }
      }else{
        event.preventDefault();
        setCountError("block");
        setErrorMessage(`Error! You have only ${mcq_count} Mcq Questions. `);
        setTimeout(() => {
          setCountError("none");
        }, 3000);
      }

      updateFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    };

    const handleRadio = (event)=>{
      // setDifficultyLevel(event.target.value);
      initialFormData.difficulty_level = event.target.value;
    }

    const handleStartDate = (event) =>{
      setStartDate(event);
    }

    const handleEndDate = (event) =>{
      setEndDate(event);
      
    }

    useEffect(()=>{
      if(sessionStorage.getItem("role") != "ADMIN"){
        navigate("/authorization-alert");
      }

    },[]);



    const handleSubmit = (event)=>{
      if(formData.start_time === ""){
      
          setDanger("block");
          setTimeout(() => {
            setDanger("none");
          }, 2000);

          return;
      }else{
        if(formData.no_of_mcq_questions > 0  || formData.no_of_mcq_questions < mcq_count ){
          if( start_date.year() <= end_date.year() && start_date.month() <= end_date.month() &&
           start_date.date() <= end_date.date() && start_date.hour() <= end_date.hour()){
    
            // submitting data to exam table
            const start = start_date.format("YYYY-MM-DD HH:mm");
            const end = end_date.format("YYYY-MM-DD HH:mm");
    
            formData.start_time = start;
            formData.end_time = end;
            // console.log(typeof formData.start_time);
    
    
           // posting the questions with exams into the question exam table
    
    
                if(formData.no_of_mcq_questions && formData.no_of_programming_questions && formData.duration){
                const url = `${HOST_URL}/exam/create-exam`;
                axios.post(url,formData) 
                      .then((response)=>{
                        console.log("Form submitted successfully.."+ response.status);
                        // console.log(response.data);
                        const exam = response.data;
                          
                        // assigning the questions automatically and inserting data intpo questionexams table
                        const mcqlimit = formData.no_of_mcq_questions;
                        const programLimit = formData.no_of_programming_questions;
                        const exam_level = formData.difficulty_level;
    
                         // getting the mcq questions assigned automatically
                         const getMcqUrl = `${HOST_URL}/question/get-mcq-questions-on-type-and-level/`.concat(mcqlimit+`/`+exam_level);
                         axios.get(getMcqUrl)
                               .then((response)=>{
                                //  console.log(response.data);
    
                                 const mcq_data = response.data.map((element,index) => {
                                 return {exam:exam,question:element};
                                });
    
                                allAssignedQuestions = [...allAssignedQuestions , ...mcq_data];
                                console.log(allAssignedQuestions);
                               })
                               .catch((error)=>{
                                 console.log(error);
                               });
    
                        // getting the programming questions assigned automatically
    
                      
                        const getProgramUrl = `${HOST_URL}/question/get-program-questions-on-type-and-level/`.concat(programLimit+`/`+exam_level);
                        axios.get(getProgramUrl)
                              .then((response)=>{
                                // console.log(response.data)
                                
                                const program_data = response.data.map((element,index)=>{
                                  return {exam:exam,question:element};
                                })
                                allAssignedQuestions = [...allAssignedQuestions,...program_data];
                                console.log(allAssignedQuestions);
                              })
                              .catch((error)=>{
                                console.log(error);
                              });    
    
                        
                                    setTimeout(() => {
                                       // posting all the question exam into exam-questions table
                                    const postUrl = `${HOST_URL}/question-exam/save-all`;
                                    axios.post(postUrl,allAssignedQuestions)
                                          .then((response)=>{
                                            console.log(response.data);
                                            console.log("inserted successfuullyyyy");
                                                if(response.status === 200){
                                                  setAlertVal("block");
                                                  setTimeout(()=>{
                                                      navigate("/exams");
                                                  },2000)
                                                }else{
                                                  setDanger("block");
                                                  setTimeout(() => {
                                                    setDanger("none");
                                                  }, 3000);
                                                }
                                          })
                                          .catch((error)=>{
                                            console.log(error);
                                          });
                                    }, 1000);
                                    
    
                        
                        })
                        .catch((error)=>{
                          console.log(error);
                        });
                    }else{
                        setDanger("block");
                        console.log("error...posting data");
                        setTimeout(() => {
                          setDanger("none");
                        }, 3000);
                    }
    
          }else{
            setDanger("block");
            console.log("end date should be greater than start date");
            setTimeout(() => {
              setDanger("none");
            }, 3000);
          }
        }else{
          setCountError("block");
          setErrorMessage(`Error! You have only ${mcq_count} Mcq Questions and ${program_count} Questions. `);
          setTimeout(() => {
            setCountError("none");
          }, 3000);
        }
      }

      

    }
  

    return (
        <>
        <NavBar ></NavBar>

        <div className="alert" style={{display:alert}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
             Here is a gentle confirmation that your action was successful.
        </Alert>
        </div> 
        <div className="alert" style={{display:danger}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
              Fill out all the fields and make sure end date is greater than start date.
        </Alert>
        </div> 
        <div className="alert" style={{display:countError}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
              {errorMessage}
        </Alert>
        </div> 
        
        <h2>Create New Exam</h2>

        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#E0E0E0', height: '500px',padding:5,borderRadius:5 }} >
            
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Mcq" 
                name="no_of_mcq_questions"variant="outlined" type="number" onChange={handleChange}
                 placeholder="No. of Mcq Questions" ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Programming" 
                name="no_of_programming_questions"variant="outlined" type="number" onChange={handleChange}
                 placeholder="No. of Programming Questions" ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Passing Marks" 
                name="pass_marks"variant="outlined" type="number"onChange={handleChange}  ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic"  className="disabled" required label="Duration in Hours" 
                name="duration" variant="outlined" type="number" onChange={handleChange} ></TextField>
            </div>
            <div>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="difficulty_level"
                defaultValue={"MEDIUM"}
                sx={{ml:15}}
                onChange={handleRadio} 
              >
                <FormControlLabel value="EASY" control={<Radio />} label="Easy" />
                <FormControlLabel value="MEDIUM" control={<Radio />} label="Medium" />
                <FormControlLabel value="HARD"  control={<Radio />} label="Hard" />
              </RadioGroup>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label="Start Date Time"  onChange={handleStartDate} name="start_date"/>
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker label="End Date Time"  onChange={handleEndDate} name="end_date"/>
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="btn">
                <div>
                <Button variant="contained" fullWidth sx={{mt:2}} onClick={handleSubmit}>Create Exam</Button>
                </div>
            </div>
            </Box>
        </Container>
    
        </>
    );
}

export default CreateExams;