import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { APIResponseErr, ListProps, Posts, ResponseStatus, ResponseStruct, RouteDetails, SuccessResponse, TableMock } from "../DTO/components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { AlertColor, Button, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import ShowToast from "./showToast";
import ConfirmModal from "./confirmModal";
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { APIManager } from "../api/apiManager";

export function EnhancedPosts(props: ListProps) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [toastMessage, setToastMsg] = useState("")
    const [toastColor, setToastColor] = useState<AlertColor>("success")
    function handleDelete(id:string) {
            APIManager.sharedInstance().deleteRoute(id).then((response) => {
                setToastMsg(response?.message)
                setToastColor("success")
                setAlert(true)
            }).catch((err) => {
                if( err instanceof APIResponseErr) {
                    setToastMsg(err.message)
                    setToastColor("error")
                    setAlert(true)
                } else {
                    console.log(err)
                }
            })
    }
    function callModal(id: String) {
        setShowModal(true)
    }
    let [showAlert, setAlert] = useState(false)
    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlert(false)
        router.replace(router.asPath)
      };
    return ( 
        <Paper sx={{ width: '100%', overflow: 'hidden', pt:4 }}>
            <Toolbar  sx={{pl: { sm: 2 },pr: { xs: 1, sm: 5 }}}>
                <Typography variant="h6"  sx={{ flex: '1 1 100%' }} component="div">
                   {props.mocks.length} Routes available 
                </Typography>
                <Tooltip title="Create new Mock">
                <Link href={`/posts/${uuidv4()}?isCreate=true`} style={{ textDecoration: 'none' }} passHref >
                <Button variant="contained" startIcon={<AddIcon />} sx={{whiteSpace: "nowrap"}}>
                    Add Route
                </Button>
                </Link>
                </Tooltip>
        </Toolbar>
            <TableContainer>
            <Table stickyHeader>
                <TableHead>
                 <TableRow>
                    <TableCell>
                        Title
                    </TableCell>
                    <TableCell>
                        Endpoint
                    </TableCell>
                    <TableCell>
                        Request type
                    </TableCell>
                    <TableCell>
                        Description
                    </TableCell>
                    <TableCell>
                        Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {props.mocks.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.title}
                            </TableCell>
                            <TableCell>
                                {row.endpoint}
                            </TableCell>
                            <TableCell>
                                {row.type}
                            </TableCell>
                            <TableCell>
                                {row.description}
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Edit the mock">
                                <Link href= {{pathname:`/posts/${row.id}`, query:{isCreate:false}}} passHref>
                                <IconButton >
                                    <EditIcon />
                                </IconButton>
                                </Link>   
                                </Tooltip> 
                                <Tooltip title="Delete the Mock">
                                    <IconButton onClick={() => callModal(row.id)}>
                                         <DeleteIcon />
                                    </IconButton>   
                                </Tooltip>                        
                            </TableCell>
                            <ConfirmModal id={row.id}
                                        open={showModal}
                                        title={"Delete the route"}
                                        desc={"Are you sure you want to delete the route ?"}
                                        actionBtnTitle={"Delete"}
                                        actionBtnCallback={function (id: string): void {
                                            setShowModal(false)
                                            handleDelete(id)} }
                                        cancelBtnTitle={"Cancel"}
                                        cancelBtnAction={function (id: string): void {setShowModal(false)} } />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
     </TableContainer>
     <ShowToast message={toastMessage} open={showAlert} onClose={handleToastClose} color={toastColor}  />
     </Paper>)
}