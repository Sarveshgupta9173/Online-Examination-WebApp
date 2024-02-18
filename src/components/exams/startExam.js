import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayQuestions from "./displayQuestion";
import Countdown from "react-countdown";
import dayjs from "dayjs";
import { HOST_URL } from "../../utils/constants";

const StartExam = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const exam_id = location.state.exam.exam_id;
  const exam_data = location.state.exam;

  const student_data = location.state.student;
  const [answerArray,setAnswerArray] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const allQuestions = JSON.parse(localStorage.getItem("allQuestions"));
  const [currentIndex, setCurrentIndex] = React.useState(1);
  const [question_id, setQuestionId] = React.useState("");
  const objToPost = {
    exam: location.state.exam,
    student: student_data,
  };

  let i = 1;

  useEffect(() => {
    if (sessionStorage.getItem("role") !== "STUDENT") {
      navigate("/authorization-alert");
    }
  }, []);


  // handling the tab closure and page refresh issue.

  const handleUnload = (event) => {
    event.preventDefault();
    event.returnValue = "You cannot leave the page";
  }
  window.addEventListener('beforeunload', handleUnload);

  const handleClick = (event) => {
    setQuestionId(event.target.id);
    setCurrentIndex(event.target.value);

  }

  const handleClose = () => {
    setOpen(false);
    updateAfterTestcomplete();
    navigate("/student-personal-dashboard", { state: student_data });
  };

  const testAutoComplete = () => {
    setOpen(true);
  }

  

  function updateAfterTestcomplete() {
    const time = parseInt(sessionStorage.getItem("started_time"));
    const curr_date = Date.now();
    const started_date = new Date(time);
    const diff = Math.abs(curr_date - started_date) / 1000;
    const hours = Math.floor(diff / 3600) % 24;
    const minutes = Math.floor(diff / 60) % 60;
    const remaining_time = hours * 60 + minutes;

    objToPost.end_time = dayjs().format("YYYY-MM-DD HH:mm");
    objToPost.remaining_time = remaining_time;

    console.log(objToPost);
    sessionStorage.removeItem("started_time");

    const postUrl = `${HOST_URL}/user-exam-login/insert-or-update-user-exam-login-details`;
    axios.post(postUrl, objToPost)
      .then((response) => {
        console.log("submitted successfully");
        console.log(response.data);

      })
      .catch((error) => {
        console.log(error);
      });

    // updating the status after exam completion
    const updateStatusObj = {
      student: student_data,
      exam: exam_data,
      status: 'COMPLETED'
    };

    console.log(updateStatusObj);
    const updateExamStatusUrl = `${HOST_URL}/student-exam/update-student-exam-details`;
    axios.put(updateExamStatusUrl, updateStatusObj)
      .then((response) => {
        console.log(response.data);
        console.log("status updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>

      <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: '#90caf9', height: "100%", width: "100%", float: 'right', marginTop: 6, borderRadius: 8 , paddingTop : 10 , paddingBottom : 10}}>
          {/*  countdown timer duration logic = location.state.exam.duration (in mins) * 60* 1000; */}
          <Countdown date={parseInt(sessionStorage.getItem("started_time")) + 200000} onComplete={testAutoComplete}
          />
        </div>

        <div style={{ display : 'flex' , flexDirection : 'row' , justifyContent : 'space-between' , gap : 10}}>
          <div style={{ width: '25%', float: 'right', height: '100%', backgroundColor: '#f2f7f3', marginTop: 15, paddingLeft: 10, borderRadius: 10 }}>
            {
              allQuestions.map((element, index) => {
                // console.log(currentIndex);
                return <Button 
                variant={( answerArray[index+1] !== undefined  ?'contained':'outlined')}
                 value={i}
                 onClick={handleClick} id={element.question.question_id} color="success" sx={{ m: 2, width: 2 }}>{i++}</Button>
              })
            }
          </div>
          <DisplayQuestions questionId={question_id} buttonId={currentIndex} examId={exam_id} studentData={student_data} examData={exam_data} totalQuestions={allQuestions} setSelectedAnswers={setAnswerArray} selectedAnswerArray={answerArray} />
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
      </div>

    </>
  );
}

export default StartExam;