import React from "react";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import { Grid, TextField} from "@mui/material";
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
import { HOST_URL } from "../../utils/constants";

const EditStudent = (props) => {
    const location = useLocation();

    const paperStyle = {height:'85vh',margin:"30px auto", padding:30,width:300};
    const initialFormData = Object.freeze({
        user_id:location.state.user_id,
        first_name:location.state.first_name,
        last_name:location.state.last_name,
        email: location.state.email,
        password: location.state.password,
        role:location.state.role
      });
    const [formData, updateFormData] = React.useState(initialFormData);
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [role, setRole] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setRole(event.target.value);
        updateFormData({
          ...formData,
          [event.target.name]: event.target.value
        });

      };
   
    const handleSubmit = (e) => {
        
             e.preventDefault();
             
            if(formData.first_name){
                if(formData.email){
                    if(formData.password){
                        const mydata = {
                            user_id:location.state.user_id,
                            first_name: formData.first_name,
                            last_name: formData.last_name,
                            email: formData.email,
                            password:formData.password,
                            role :formData.role
                        };

                        const user_id = location.state.user_id;
                        const url = `${HOST_URL}/user/update/`.concat(user_id);
            
                         axios.put(url, mydata,{headers:{
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                                }})
                            .then((response)=>{

                                if(response.status === 200){
                                    setAlertVal("block");
                                    setTimeout(() => {
                                        navigate("/student");
                                    },2000);
                                    }else{
                                    setDanger("block");
                                    console.log("Error status code");
                                    setTimeout(() => {
                                        setDanger("none");
                                    }, 3000); 
                                    }
                                    
                            })
                            .catch((error)=>{console.log(error)});
                        
                    
                                                
                        
                    }else{
                        console.log("This Data Alredy Exists")
                        setDanger("block"); 
                        setTimeout(() => {
                            setDanger("none");
                        }, 3000); 
                    }
                }else{
                    console.log("Enter email");
                    setDanger("block"); 
                    setTimeout(() => {
                        setDanger("none");
                    }, 3000); 
                }
            }else{
                console.log("enter username");
                setDanger("block");
                setTimeout(() => {
                    setDanger("none");
                }, 3000); 

            }
        }

    return (
        <>
        <NavBar></NavBar>
        <h2>Edit Student</h2>
          
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
        <Grid>
        <Paper elevation={6} style={paperStyle}>
        <div className="container">
            <div className="inputs"  >
                <PersonIcon fontSize="large" margin="normal"></PersonIcon>
                <TextField id="standard-basic" required label="First Name" name="first_name" variant="outlined" type="text"
                onChange={handleChange} defaultValue={location.state.first_name} ></TextField>
            </div>
            <div className="inputs"  >
                <PersonIcon fontSize="large" margin="normal"></PersonIcon>
                <TextField id="standard-basic" label="Last Name" name="last_name" variant="outlined" type="text" 
                onChange={handleChange} required defaultValue={location.state.last_name} ></TextField>
            </div>
            <div className="inputs"  >
                <EmailIcon fontSize="large"></EmailIcon>
                <TextField id="standard-basic"   name="email" variant="outlined" type="email"
                onChange={handleChange} required defaultValue={location.state.email} ></TextField>
            </div>
            <div className="inputs" >
                <KeyIcon fontSize="large" ></KeyIcon>
                <TextField id="standard-basic" name="password" variant="outlined" type="password"
                onChange={handleChange} required defaultValue={location.state.password}></TextField>
            </div>
            <div className="inputs">
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Role"
                    value={location.state.role}
                    onChange={handleChange}
                    name="role"
                    placeholder="Select Role"
                    required
                    >
                    <MenuItem value={"ADMIN"}>Admin</MenuItem>
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
    );
}
export default EditStudent;