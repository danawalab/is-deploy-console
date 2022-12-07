import {Alert, Snackbar} from "@mui/material";

export default function CustomAlert({open, onClose, type, message}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert
                variant="filled"
                severity={type}
                onClose={onClose}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}