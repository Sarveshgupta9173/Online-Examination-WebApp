import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import NavBar from "../navbar";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { HOST_URL } from "../../utils/constants";



const QuestionExams = (props)=>{

    const location = useLocation();
    const theme = useTheme();
    const navigate = useNavigate();
    const exam_id = location.state.exam_id;

    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");

    const [mcq, setMcq] = React.useState([]);
    const [programs, setPrograms] = React.useState([]);

    const [allQuestionstoDisplay,setAllQuestionsToDisplay] = React.useState([]);
    const [allReadyExistingQuestions,setAllreadyExistsQuestions] = React.useState([]);

    const [questionsDisplay,setMcqQuestionToDisplay] = React.useState([]);
    const [programsDisplay,setProgramsToDisplay] = React.useState([]);

    const [mcqToPost,SetMcqPost] = React.useState([]);
    const [programToPost,SetProgramPost] = React.useState([]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    // getting all the questions list 

    useEffect(()=>{

      if(sessionStorage.getItem("role") !== "ADMIN"){
        navigate("/authorization-alert");
      }

    // getting all the questions from databse

    const getUrl = `${HOST_URL}/question/get`;
                          axios.get(getUrl)
                              .then((response)=>{
                                
                                setAllQuestionsToDisplay(response.data);
                              })
                              .catch((error)=>{
                                console.log(error);
                              });     //  promise resolved
        
                                                                    
    // Getting the liste of questions which are already associated with the given exam in databse
    const getAllreadyExistQuestions_url = `${HOST_URL}/question-exam/get-all-questions-by-exam-id/`.concat(exam_id);

        axios.get(getAllreadyExistQuestions_url)
        .then((response1)=>{
          setAllreadyExistsQuestions(response1.data);

            })
         .catch((error)=>
         {console.log(error)});    // second promise resolved
         
         const tempVar = [];
        
        if(allReadyExistingQuestions.length > 0){

                for(let i=0;i<allQuestionstoDisplay.length;i++){
                    const obj1 = allQuestionstoDisplay[i];
                      let flag = 0;
                      for(let j=0;j<allReadyExistingQuestions.length;j++){
                        const obj2 = allReadyExistingQuestions[j].question;
                        if(obj1.question_id === obj2.question_id){
                          console.log("....");
                          flag++;
                        }
                      }
                      if(flag === 0){
                        tempVar.push(obj1);
                      }

                  }
        }

        // dividing the questions on the basis of their mcq and programming type
        
        const McqQuestionsToDisplay = [];
        const ProgamsToDisplay = []; 

        tempVar.forEach(element => {
          // console.log(element.question);
          if(element.question_type === "MCQ"){
            McqQuestionsToDisplay.push("Id :"+element.question_id + " Category :"
            +element.categories+" Level: "+element.difficulty_level);
          }
          if(element.question_type === "PROGRAMMING"){
            ProgamsToDisplay.push("Id : "+element.question_id+" Level : "+element.difficulty_level);
          }
        });

        setMcqQuestionToDisplay(McqQuestionsToDisplay);
        setProgramsToDisplay(ProgamsToDisplay);
        
    },[]);
  
   

    function getStyles(name, personName, theme) {
    return {
        fontWeight:
        personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
    }

  
    const handleChangeMcq = (event) => {
      const {
        target: { value },
      } = event;
      setMcq(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );

      
      const arr = event.target.value;
      if(arr.length > 0){
        SetMcqPost(arr);
      }
    };

    const handleChangeProgram = (event) => {
      const {
        target: { value },
      } = event;
      
      setPrograms(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );

      const arr = event.target.value;
      if(arr.length > 0){
        SetProgramPost(arr);
      }
      // console.log(arr);
      
   

    };

    const handleSubmit = (event)=>{
        // console.log(programToPost);
        // console.log(mcqToPost);

        let objToPost = {
          exam:{
            exam_id: location.state.exam_id,
          },
          question:{
            question_id: "" ,
          }
          
        };

        if(programToPost.length === 0 && mcqToPost.length === 0){
          setDanger("block");
          setTimeout(() => {
            setDanger("none");
        }, 3000); 
        }else{


        const postUrl = `${HOST_URL}/question-exam/insert-question-exam`;

        for(let i=0;i<mcqToPost.length;i++){
            objToPost.question.question_id = parseInt(mcqToPost[i].substring(4,6));
            // console.log(objToPost);
            axios.post(postUrl,objToPost)
            .then((response)=>{console.log("Data Submitted")})
            .catch((error)=>{console.log(error)});
        }

        for(let i=0;i<programToPost.length;i++){
          objToPost.question.question_id  = parseInt(programToPost[i].substring(4,6));
          // console.log(objToPost);
          axios.post(postUrl,objToPost)
          .then((response)=>console.log("Data Submitted"))
          .catch((error)=>console.log(error));
        }
        navigate("/question-exams");
      }
        

    }

    return (
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
        <h2>Assign Questions to Exams</h2>

        <Container maxWidth="lg">
            <Box sx={{ bgcolor: '#E0E0E0', height: '218px',padding:5,borderRadius:5 }} >
            
            <div className="inputs"  >
                <ArrowForwardIosIcon fontSize="large" sx={{pt:1}}></ArrowForwardIosIcon>
                <TextField id="standard-basic" disabled label="Number of Mcq Questions" 
                name="no_of_mcq_questions"variant="outlined" type="text"  ></TextField>
                    <FormControl sx={{ ml:5, width: 400 }}>
                      <InputLabel id="demo-multiple-chip-label">Select MCQ Questions</InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                       
                        value={mcq}
                        onChange={handleChangeMcq}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                      <MenuItem disabled value="">
                          <em>Select {location.state.no_of_mcq_questions} Questions </em>
                        </MenuItem>
                        {questionsDisplay.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, mcq, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
            </div>

            <div className="inputs"  >
                <ArrowForwardIosIcon fontSize="large" sx={{pt:1}}></ArrowForwardIosIcon>
                <TextField id="standard-basic" disabled label="Number of Programming Questions" 
                name="no_of_mcq_questions"variant="outlined" type="text"  ></TextField>
                    <FormControl sx={{ ml:5, width: 400 }}>
                      <InputLabel id="demo-multiple-chip-label">Select Programming Questions</InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          
                          value={programs}
                          onChange={handleChangeProgram}
                          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                          renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                      <MenuItem disabled value="">
                          <em>Select {location.state.no_of_programming_questions} Questions</em>
                        </MenuItem>
                        {programsDisplay.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, programs, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
          </div>




        <div className="btn">
            <div>
            <Button variant="contained"  sx={{mt:3,width:150}} onClick={handleSubmit}>submit </Button>
            </div>
        </div>
            </Box>
        </Container>
    
  
        </>
    );
}

export default QuestionExams;