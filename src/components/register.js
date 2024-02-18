import React, { useEffect } from "react";
import './assets/register.css';
import EmailIcon from '@mui/icons-material/Email';
import { Grid, TextField, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import { HOST_URL } from "../utils/constants";


const Register = ()=>{

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
    const [password, setPassword] = React.useState('');
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [cPasswordClass, setCPasswordClass] = React.useState('form-control');
    const [cPassword, setCPassword] = React.useState('');
    const [isCPasswordDirty, setIsCPasswordDirty] = React.useState(false);
    const navigate = useNavigate();


    const handleChange = (event) => {
        // setRole(event.target.value);
        updateFormData({
          ...formData,
          [event.target.name]: event.target.value
        });

      };

      const handleCPassword = (e) => {
        setCPassword(e.target.value);
        setIsCPasswordDirty(true);
    }

    useEffect(()=>{
        if (isCPasswordDirty) {
            if (password === cPassword) {
                setShowErrorMessage(false);
                setCPasswordClass('form-control is-valid')
            } else {
                setShowErrorMessage(true)
                setCPasswordClass('form-control is-invalid')
            }
        }
    },[cPassword]);
   
    const handleSubmit = (e) => {
                // e.preventDefault();
                const mydata = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password:password,
                    role :formData.role
                };
                console.log( mydata);


                if(mydata.first_name !== "" && mydata.email !== "" && mydata.password !== ""){

                   
        
                    console.log( mydata);
                    const url = `${HOST_URL}/user/create-user`;
                      axios.post(url, mydata)
                            .then((response)=>{
                                console.log("form submitted successfully",response.status);
                                if(response.status === 200){
                                    setAlertVal("block");
                                    setTimeout((event)=>{
                                        navigate('/login');
                                    },2000)
                                }else{
                                    setDanger("block");
                                    console.log("Error occured in login");
                                    setTimeout(() => {
                                        setDanger("none");
                                    }, 3000);
                                }
                            }).catch((error)=>{
                                console.log(error);
                            });
                    
                }else{
                    console.log("Enter Email and Password")
                    setDanger("block");
                    setTimeout(() => {
                        setDanger("none");
                    }, 3000);
                    
                }
           
    }   
    

  

    return (
        <>
        <div className="alert" style={{display:alert}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" onClose={()=>setAlertVal("none")}>
             Here is a gentle confirmation that your action was successful.
        </Alert>
        </div> 
        <div className="alert" style={{display:danger}} >
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error" onClose={()=>setDanger("none")}>
             Please Fill out all the Fields 
        </Alert>
        </div> 
        
        <NavBar></NavBar>
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
                <TextField id="standard-basic"  label="Email" name="email" variant="outlined" type="email"
                onChange={handleChange} required ></TextField>
            </div>
            <div className="inputs" >
                <KeyIcon fontSize="large" ></KeyIcon>
                <TextField id="standard-basic" label="Password " name="password" variant="outlined" type="password"
                onChange={(e)=>setPassword(e.target.value)} required value={password}></TextField>
            </div>
            <div className="inputs" >
                <KeyIcon fontSize="large" ></KeyIcon>
                <TextField id="standard-basic"  label=" Confirm Password" name="confirm_password" variant="outlined" type="password"
                onChange={handleCPassword} required  value={cPassword}></TextField>
            </div>
            {showErrorMessage && isCPasswordDirty ? <div style={{color:'#d50000'}}> Passwords did not match </div> : ''}
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
                    <MenuItem value={"ADMIN"}>Admin</MenuItem>
                    <MenuItem value={"STUDENT"} disabled={true}>Student</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
        <div className="btn">
            <div>
            <Button variant="contained" className="registerBtn" onClick={handleSubmit}>Register</Button>
            </div>
        </div>
        <Typography>
            Already Registered ? <Link href="/login" > Login Here</Link>
        </Typography>
        </Paper>
        </Grid>
        </>
    )
}

export default  Register;