import React, { useEffect } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { HOST_URL } from "../../utils/constants";


const DisplayQuestions = ({questionId,buttonId,examId,studentData,examData,setSelectedAnswers,selectedAnswerArray})=>{

    const navigate = useNavigate();
    const allQuestions = JSON.parse(localStorage.getItem("allQuestions"));
    const [selectedAnswer,setSelectedAnswer] = React.useState("");
    const [textbox,setTextbox] = React.useState("");
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [open, setOpen] = React.useState(false);
    const [questionToDisplay,setQuestionToDisplay]=React.useState("");
    const objToPost = {
      exam:examData,
      student:studentData,
    };

    useEffect(()=>{
            
            // console.log(allQuestions[buttonId-1].question);
            setQuestionToDisplay(allQuestions[buttonId-1].question);
              if(allQuestions[buttonId-1].question.question_type === "MCQ"){
                setTextbox(false);
              }else{
                setTextbox(true);
              }
              return () => {}
            
    },[buttonId]);

    const handleRadioChange = (event)=>{
        setSelectedAnswer(event.target.value);
      }

    const handleTextbox = (event)=>{
        setSelectedAnswer(event.target.value);
    }
  

      const handleSubmit = (event)=>{
        // console.log(questionToDisplay);


        setSelectedAnswers(prevArr => {
          const newArr = [...prevArr];
          newArr[buttonId] = selectedAnswer;
          return newArr;
        });

          const objToPost = {
            student:studentData,
            exam:examData,
            question:questionToDisplay,
            answer:(questionToDisplay.question_type === "MCQ")?selectedAnswer.split('-')[1] : selectedAnswer 
          };
        console.log(objToPost);
          const submitUrl = `${HOST_URL}/user-exam-submission/insert-or-update`;
          axios.post(submitUrl,objToPost)
                .then((response)=>{
                  console.log("submitted successfully");
                  console.log(response.data);
                  setAlertVal("block");
                  setTimeout(() => {
                    setAlertVal("none");
                  }, 2000);
                })
                .catch((error)=>{
                  setDanger("block");
                  setTimeout(() => {
                    setDanger("none");
                  }, 2000);
                  console.log(error);
                });
        

          // final submission of the exam

          if(buttonId === allQuestions.length){
            updateAfterTestcomplete();
          }
      }

      const handleClose = () => {
        setOpen(false);
        navigate("/student-personal-dashboard",{state:studentData});
      };

      const handleCopyPaste = (event)=>{
        event.preventDefault();
      }

      
      function updateAfterTestcomplete(){

        const time = parseInt(sessionStorage.getItem("started_time")); 
        const curr_date = Date.now();
        const started_date = new Date(time);
        const diff = Math.abs(curr_date-started_date)/1000;
        const hours = Math.floor(diff/3600)%24;
        const minutes = Math.floor(diff/60)%60;
        const remaining_time = hours*60 + minutes;
  
        objToPost.end_time = dayjs().format("YYYY-MM-DD HH:mm");
        objToPost.remaining_time = remaining_time;
  
        console.log(objToPost);
        sessionStorage.removeItem("started_time");
  
        const postUrl = `${HOST_URL}/user-exam-login/insert-or-update-user-exam-login-details`;
        axios.post(postUrl,objToPost)
                .then((response)=>{
                  console.log("submitted successfully");
                  console.log(response.data);
                  
                })
                .catch((error)=>{
                  console.log(error);
                });
  
        // updating the status after exam completion
        const updateStatusObj = {
          student:studentData,
          exam:examData,
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
      }
      console.log(selectedAnswerArray);

    console.log(buttonId);
    console.log(selectedAnswerArray[buttonId]);
    return(
        <>
        
            <div style={{ marginTop:15 , borderRadius:10 , width : '75%'}}>
              <div className="alert" style={{display:alert ,}}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                  Answer submitted successfully.
              </Alert>
              </div> 
              <div className="alert" style={{display:danger}}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
                    Please select an option and try again.
              </Alert>
              </div> 
                  <div>
                    <p style={{width:'100%' , textAlign : 'start' , paddingLeft : '20px'}}><span style={{fontSize:20,fontWeight:500}}>Question {buttonId} :</span> <span style={{ padding : '0px 4px'}}>{questionToDisplay.question}</span></p>
                  </div>
                  <div style={{margin:2}} >
                    <div style={{display:(textbox)?'none':'flex' , paddingLeft : 20}}>
                      <FormControl>
                        <RadioGroup value={selectedAnswerArray[buttonId] && selectedAnswerArray[buttonId]} onChange={handleRadioChange} id={questionToDisplay.question_id } name={questionToDisplay.question_id} >
                            <FormControlLabel value={questionToDisplay.option_A && questionToDisplay.option_A + '-OPTION_A'} control={<Radio />} label={questionToDisplay.option_A} />
                            <FormControlLabel value={questionToDisplay.option_B && questionToDisplay.option_B + '-OPTION_B'} control={<Radio />} label={questionToDisplay.option_B} />
                            <FormControlLabel value={questionToDisplay.option_C && questionToDisplay.option_C + '-OPTION_C'} control={<Radio />} label={questionToDisplay.option_C} />
                            <FormControlLabel value={questionToDisplay.option_D && questionToDisplay.option_D + '-OPTION_D'} control={<Radio />} label={questionToDisplay.option_D} />
                        </RadioGroup>
                        </FormControl>
                     </div>
                     <div style={{display:(textbox)?'block':'none' ,padding : '20px'}}>
                     <TextField  onCopy={handleCopyPaste}  onPaste={handleCopyPaste} 
                        id="filled-multiline-static" label="Write Your Code Here..." multiline rows={8} sx={{width:'100%'}} onChange={handleTextbox} />
                     </div>
                     <div style={{ padding : '30px 0px'}}>
                        <Button  variant="contained" color="success" sx={{p : 2}} onClick={handleSubmit}>{(buttonId === allQuestions.length)?'Submit Exam':'Submit '}</Button>
                     </div>
                  </div>
              </div>

              <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                <DialogTitle id="alert-dialog-title">
                  {"Thank You....Your Response has been submitted."}

                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <Typography>Thanks for appearing for the exam.</Typography>
                    <Typography>You will get your results within few working days.</Typography>
                     
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                    Close Exam Window
                  </Button>
                </DialogActions>
              </Dialog>
        </>
    );
  }

export default DisplayQuestions;