import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";

const AuthorizationAlert = ()=>{
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/login");
      setOpen(false);
    };

    return (
        <>
     
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Warning : Unauthorized Action -  You are  not authorized to do so."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The authentication and authorization state should always be maintained and verified on the server side. Web application developers sometimes manage authorization states on the client-side, which malicious users can easily tamper with to gain unauthorized access. The client-side authorization state management variation includes maintaining state in HTTP cookies, URL paths or parameters, JSON web tokens (JWT), request referrer header, or request origin header.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </>
    );
}
export default AuthorizationAlert;