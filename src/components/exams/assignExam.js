import React, { useEffect } from "react";
import NavBar from "../navbar";
import {  useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, ButtonGroup, ClickAwayListener, Container, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import axios from "axios";
import { HOST_URL } from "../../utils/constants";


const AssignExam = (props)=>{

    const location = useLocation();
    const navigate = useNavigate();
    const [alert,setAlertVal] = React.useState("none");
    const [danger,setDanger] = React.useState("none");
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [options,setOptions] = React.useState([]);

        const getUrl = `${HOST_URL}/exam/get`;

        useEffect(()=>{
            if(sessionStorage.getItem("role") != "ADMIN"){
              navigate("/authorization-alert");
            }
        axios.get(getUrl)
            .then((response)=>{
                // console.log(response.data);
                const data = response.data;

                let temp = [];
                for(let i = 0;i<data.length;i++){
                    temp.push(data[i].exam_id);
                }
                setOptions(temp);
            })
            .catch((error)=>{
                console.log(error);
            })
        },[]);
      



    const handleSubmit = (event)=>{
        const current_exam_id = options[selectedIndex];
        const student_id = location.state.user_id;
        const objToPost = {
            exam:{
                exam_id : current_exam_id
            },
            student:{
                user_id:student_id
            },
            status:"REMAINING",
        }

        const postUrl = `${HOST_URL}/student-exam/insert-student-exam`;
        axios.post(postUrl,objToPost)
            .then((response)=>{
                console.log("Data submitted successfully"+ response.data);
                console.log(response.status);
                if(response.status === 200){
                  setAlertVal("block");
                  setTimeout(() => {
                     navigate("/student");
                  }, 2000);
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


          
    }

  
    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
    };
  
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };
  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };

    return(
        <>
        <NavBar></NavBar>
        <div className="alert" style={{display:alert}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
             Exam assigned successfully.
        </Alert>
        </div> 
        <div className="alert" style={{display:danger}}>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
             Error....Please Try Again. 
        </Alert>
        </div> 
        
        <h2>Assign Exam to {location.state.first_name +"( ID:"+location.state.user_id+")"}</h2>

        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#E0E0E0', height: '218px',padding:5,borderRadius:5 }} >
            
        <div className="inputs"  >
        <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button onClick={handleClick}>{"Exam Id "+options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                    //   disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>  
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

export default AssignExam;