import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import NavBar from "../navbar";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { HOST_URL } from "../../utils/constants";


const EditQuestion = (props) =>{


    const location = useLocation();
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        question_id:location.state.question_id,
        question_type:location.state.question_type,
        categories:location.state.categories,
        difficulty_level: location.state.difficulty_level,
        question: location.state.question,
        option_A:location.state.option_A,
        option_B:location.state.option_B,
        option_C:location.state.option_C,
        option_D:location.state.option_D,
        answer:location.state.answer,
      });

    const [formData, updateFormData] = React.useState(initialFormData);
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [question_type,setQuestionType] = React.useState('');
    // const [categories,setCategory] = React.useState('');
    // const [difficulty_level,setDifficultyLevel] = React.useState('');
    const [answer,setAnswer] = React.useState('');
    const [disable,setDisable] = React.useState(false);

        const handleChange = (event) => {
            // setDifficultyLevel(event.target.value);
            setAnswer(event.target.value);
        

            updateFormData({
            ...formData,
            [event.target.name]: event.target.value
            });
        };

        const handleCategory = (event)=>{
            // setCategory(event.target.value);

            updateFormData({
                ...formData,
                [event.target.name]: event.target.value
                });
        }

        const handleQuestionType = (event)=>{
            setQuestionType(event.target.value);
            if(event.target.value === "PROGRAMMING"){
                setDisable(true);
            }

            updateFormData({
                ...formData,
                [event.target.name]: event.target.value
            });
        }

   
        const handleSubmit = (e) => {
        
             e.preventDefault();

            if(formData.question_type){
                if(formData.categories){
                    if(formData.difficulty_level){
                        if(formData.question){
                            const id = location.state.question_id;
                            const url = `${HOST_URL}/question/update/`.concat(id);

                             axios.put(url,formData,{headers:{
                                                'Content-Type': 'application/json',
                                                'Access-Control-Allow-Origin': '*'
                                            }})
                                    .then((response)=>{
                                        console.log("Form Submitted Successfully.."+ response.data);

                                        if(response.status === 200){
                                            setAlertVal("block");
                                            setTimeout(() => {
                                              navigate("/questions");
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
                                        console.log("Error Submitting Form"+ error);
                                    });
                                   

                        }else{
                            setDanger("block");
                            console.log("Error....Please enter Question");
                            setTimeout(() => {
                                setDanger("none");
                            }, 3000); 
                        }
                    }else{
                        setDanger("block");
                        console.log("Error....Please enter Difficulty Level");
                        setTimeout(() => {
                            setDanger("none");
                        }, 3000); 
                    }
                }else{
                    setDanger("block");
                    console.log("Error....Enter Category");
                    setTimeout(() => {
                        setDanger("none");
                    }, 3000); 

                }
            }else{
                setDanger("block");
                console.log("Error....Enter Question Type");
                setTimeout(() => {
                    setDanger("none");
                }, 3000); 
            }
        }

    return(
        <>
        <NavBar ></NavBar>
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
        <h2>Edit Question</h2>

        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#E0E0E0', height: '658px',padding:5,borderRadius:5 }} >
            <div className="container">
                <div className="inputs">
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Select Question Type</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Role"
                    value={initialFormData.question_type}
                    onChange={handleQuestionType}
                    name="question_type"
                    required
                    >
                    <MenuItem value={"MCQ"}>Mcq</MenuItem>
                    <MenuItem value={"PROGRAMMING"}>Programming</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="inputs">
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label"> Select Category</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Category"
                    value={initialFormData.categories}
                    onChange={handleCategory}
                    name="categories"
                    required
                    >
                    <MenuItem value={"LOGICAL"}>Logical</MenuItem>
                    <MenuItem value={"TECHNICAL"}>Technical</MenuItem>
                    <MenuItem value={"PROGRAMMING"}>Porgramming</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="inputs">
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Select Difficulty Level</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Difficulty Level"
                    value={initialFormData.difficulty_level}
                    onChange={handleChange}
                    name="difficulty_level"
                    required
                    >
                    <MenuItem value={"EASY"}>Easy</MenuItem>
                    <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                    <MenuItem value={"HARD"}>Hard</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" className="disabled" required label="Enter Question" name="question" variant="outlined" type="text"
                onChange={handleChange} defaultValue={location.state.question} ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" label="Enter Option A" name="option_A" variant="outlined" type="text" 
                onChange={handleChange} required disabled={disable} defaultValue={location.state.option_A} ></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" label="Enter Option B" name="option_B" variant="outlined" type="text" 
                onChange={handleChange} required disabled={disable} defaultValue={location.state.option_B}></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" label="Enter Option C" name="option_C" variant="outlined" type="text" 
                onChange={handleChange} required disabled={disable} defaultValue={location.state.option_C}></TextField>
            </div>
            <div className="inputs"  >
                <QuestionAnswerIcon fontSize="large"></QuestionAnswerIcon>
                <TextField id="standard-basic" label="Enter Option D" name="option_D" variant="outlined" type="text" 
                onChange={handleChange} required disabled={disable} defaultValue={location.state.option_D}></TextField>
            </div>
            <div className="inputs">
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Select Correct Answer</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Answer"
                    value={initialFormData.answer}
                    onChange={handleChange}
                    name="answer"
                    disabled={disable} 
                    required
                    >
                    <MenuItem value={"OPTION_A"}>Option A</MenuItem>
                    <MenuItem value={"OPTION_B"}>Option B</MenuItem>
                    <MenuItem value={"OPTION_C"}>Option C</MenuItem>
                    <MenuItem value={"OPTION_D"}>Option D</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div> 
        <div className="btn">
            <div>
            <Button variant="contained" fullWidth sx={{mt:2}} onClick={handleSubmit}>Update Question</Button>
            </div>
        </div>
            </Box>
        </Container>
    
        </>
    );
}

export default EditQuestion;