import React, { useEffect } from "react";
import EmailIcon from '@mui/icons-material/Email';
import { Grid, TextField } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar"
import { HOST_URL } from "../../utils/constants";


const CreateStudent = ()=>{

    const paperStyle = {height:'85vh',margin:"30px auto", padding:30,width:300};
    const initialFormData = Object.freeze({
        first_name:"",
        last_name:"",
        email: "",
        password: "",
        role:""
      });

    const [formData, updateFormData] = React.useState(initialFormData);
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [role, setRole] = React.useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        if(sessionStorage.getItem("role") != "ADMIN"){
            navigate("/authorization-alert");
        }
    },[]);


    const handleChange = (event) => {
        setRole(event.target.value);
        updateFormData({ ...formData,  [event.target.name]: event.target.value });
      };
   
    const handleSubmit = (e) => {
        
             e.preventDefault();

            if(formData.first_name){
                if(formData.email){
                    if(formData.password){
                        const mydata = {
                            first_name: formData.first_name,
                            last_name: formData.last_name,
                            email: formData.email,
                            password:formData.password,
                            role :formData.role
                        };

                        const url = `${HOST_URL}/user/create-user`;
            
                        const response =  axios
                                            .post(url, mydata)
                                            .then(()=>{console.log("ceated successfully",response);})
                                            .catch((error)=>{console.log(error)});

                        setAlertVal("block");
                        setTimeout((event)=>{
                            navigate('/student');
                        },2000)
                                                
                        
                    }else{
                        setDanger("block"); 
                        setTimeout(() => {
                            setDanger("none");
                        },3000);
                    }
                }else{
                    console.log("Enter email");
                    setDanger("block"); 
                    setTimeout(() => {
                        setDanger("none");
                    },3000);
                }
            }else{
                console.log("enter username");
                setDanger("block");
                setTimeout(() => {
                    setDanger("none");
                },3000); 

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
        <h2>Create New Student</h2>
        <Grid>
        <Paper elevation={6} style={paperStyle}>
        <div className="container">
            <div className="inputs"  >
                <PersonIcon fontSize="large" margin="normal"></PersonIcon>
                <TextField id="standard-basic" required label="First Name" name="first_name" variant="outlined" type="text"
                onChange={handleChange}  ></TextField>
            </div>
            <div className="inputs"  >
                <PersonIcon fontSize="large" margin="normal"></PersonIcon>
                <TextField id="standard-basic" label="Last Name" name="last_name" variant="outlined" type="text" 
                onChange={handleChange} required ></TextField>
            </div>
            <div className="inputs"  >
                <EmailIcon fontSize="large"></EmailIcon>
                <TextField id="standard-basic"   name="email" variant="outlined" type="email"
                onChange={handleChange} required ></TextField>
            </div>
            <div className="inputs" >
                <KeyIcon fontSize="large" ></KeyIcon>
                <TextField id="standard-basic" name="password" variant="outlined" type="password"
                onChange={handleChange} required></TextField>
            </div>
            <div className="inputs">
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Role"
                    value={role}
                    onChange={handleChange}
                    name="role"
                    placeholder="Select Role"
                    required
                    >
                    <MenuItem value={"ADMIN"} disabled={true}>Admin</MenuItem>
                    <MenuItem value={"STUDENT"}>Student</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div> 
        <div className="btn">
            <div>
            <Button variant="contained"  onClick={handleSubmit}>Create</Button>
            </div>
        </div>
        
        </Paper>
        </Grid>

        </>
    )
}

export default  CreateStudent;