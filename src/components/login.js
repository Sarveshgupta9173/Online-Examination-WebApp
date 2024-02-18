import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Avatar } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import NavBar from "./navbar";
import { HOST_URL } from "../utils/constants";




const SignIn = (props)=>  {
  
  const avtarStyle = {backgroundColor:"##1D5892",margin:"5px auto"}
  const navigate = useNavigate();
  const [danger,setDanger] = React.useState("none");



  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    const url = `${HOST_URL}/user/is-admin/`.concat(email);

    axios.get(url)
    .then(function (response) {
        // console.log(response.data);
        if(response.data.role === "ADMIN" && response.data.password === password){

          window.sessionStorage.setItem("name",response.data.first_name);
          window.sessionStorage.setItem("role",response.data.role);

          navigate('/admin');
        }else if(response.data.role === "STUDENT" && response.data.password === password){
          window.sessionStorage.setItem("name",response.data.first_name);
          window.sessionStorage.setItem("role",response.data.role);
          navigate('/student-personal-dashboard',{state:{email:response.data.email,password:response.data.password}})
        }else{
          console.log("Invalid Id or Password");
          setDanger("block");
          setTimeout(() => {
            setDanger("none");
        }, 3000);
        }
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });


  };



  return (
    <>
    <NavBar></NavBar>
     <div className="alert" style={{display:danger}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
             Please Enter Valid Email Id or Password
        </Alert>
        </div> 
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Login <Avatar style={avtarStyle}><LoginIcon></LoginIcon></Avatar> </h2>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            
            <Grid item>
              <Link href="/registration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
   
  </>
  );
}

export default SignIn;