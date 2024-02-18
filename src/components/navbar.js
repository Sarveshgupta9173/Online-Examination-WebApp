import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText, SwipeableDrawer } from '@mui/material';

const NavBar = ()=> {
  
  const [logButton,SetLoggedIn] = React.useState("LOGIN");
  const [state, setState] = React.useState({left: false,});
  const [taskButton,setTaskButton] = React.useState(true);
  const navigate = useNavigate();

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
      <ListItem>
              <AccountCircleIcon></AccountCircleIcon>
              <ListItemText>Hi, Admin</ListItemText>
            </ListItem>
          <Link to="/student" style={{textDecorationLine: 'none',color:'black'}}>
            <ListItem>
            <ListItemButton >
              <AssignmentOutlinedIcon></AssignmentOutlinedIcon>
              <ListItemText>Students</ListItemText>
            </ListItemButton>
            </ListItem>
          </Link>

          <Link to="/questions" style={{textDecorationLine: 'none',color:'black'}}>
           <ListItem >
            <ListItemButton >
              <AssignmentOutlinedIcon></AssignmentOutlinedIcon>
              <ListItemText>Questions</ListItemText>
            </ListItemButton>
          </ListItem>
          </Link>
          
          <Link to="/exams" style={{textDecorationLine: 'none',color:'black'}}>
         <ListItem >
            <ListItemButton >
              <AssignmentOutlinedIcon></AssignmentOutlinedIcon>
              <ListItemText>Exams</ListItemText>
            </ListItemButton>
          </ListItem>
          </Link>
          <Link to="/student-exam-details" style={{textDecorationLine: 'none',color:'black'}}>
          <ListItem >
            <ListItemButton >
              <AssignmentOutlinedIcon></AssignmentOutlinedIcon>
              <ListItemText>Student Exam Details</ListItemText>
            </ListItemButton>
          </ListItem>
          </Link>
      </List>
    </Box>
  );

  React.useEffect(()=>{
    if(window.sessionStorage.getItem("role") === "ADMIN" || 
    window.sessionStorage.getItem("role") === "STUDENT"){
      SetLoggedIn("LOG OUT");
  
    }else{
      SetLoggedIn("LOGIN");
    }

    if(window.sessionStorage.getItem("role") !== "ADMIN"){
      setTaskButton(false);
    }

  },[]);
  


  const handleClick = ()=>{

    if(logButton === "LOGIN"){
      navigate("/login");
    }else if(logButton === "LOG OUT"){
      window.sessionStorage.clear();
      // SetLoggedIn("LOGIN");
      navigate("/login");
    }else{
      SetLoggedIn("EXIT")
    }
    
  }



  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };



  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          
          {(!taskButton)?'':['Task'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Box onClick={toggleDrawer(anchor, true)} type="submit" color="primary" variant="contained"
                sx={{ mt: 3, mb: 2 }}><ViewHeadlineIcon></ViewHeadlineIcon></Box>
              <SwipeableDrawer
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
           ))}
            
            
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Online Examination
          </Typography>
          <Button color="inherit" onClick={handleClick}>{logButton}</Button>
        </Toolbar>
      </AppBar>
    </Box>

    </>
  );
}

export default NavBar;