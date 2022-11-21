import {Alert, Snackbar} from "@mui/material";

export default function CustomAlert({open, onClose, type, message}) {
    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
            <Alert
                variant="filled"
                severity={type}
                onClose={onClose}
                sx={{width: '100%'}}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}