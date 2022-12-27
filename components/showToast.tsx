import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";


export default function ShowToast(props: showToastProps) {
    return(
        <Box>
            <Snackbar open={props.open} autoHideDuration={2000} onClose={props.onClose}>
                    <Alert onClose={() => props.onClose} severity={props.color} sx={{width:'100%'}}> {props.message}</Alert>
            </Snackbar>
        </Box>
    )
}


export interface showToastProps {
    message:string;
    open?: boolean;
    onClose?: (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => void;
    color: AlertColor;
}