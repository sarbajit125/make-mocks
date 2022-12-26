import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"


export default function ConfirmModal({id,open,title, desc,actionBtnTitle,actionBtnCallback,cancelBtnTitle,cancelBtnAction}:ConfirmModalProps) {
    function handleActionBtn () {
        actionBtnCallback(id)
    }
    function handleCancelAction () {
        cancelBtnAction(id)
    }
    return (
        <Container>
        <Dialog open={open}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {desc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleActionBtn}>{actionBtnTitle}</Button>
                <Button onClick={handleCancelAction}>{cancelBtnTitle}</Button>
            </DialogActions>
        </Dialog>
        </Container>
    )
}

export interface ConfirmModalProps {
    id: string;
    open: boolean;
    title: string;
    desc: string;
    actionBtnTitle: string;
    actionBtnCallback: (id: string)=>void;
    cancelBtnTitle: string;
    cancelBtnAction:  (id: string)=>void;
}