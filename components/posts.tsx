import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { APIResponseErr, ListProps, RouteDetails } from "../DTO/components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { AlertColor, Button, IconButton, Toolbar, Tooltip, Typography, Box, TextField } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import ShowToast from "./showToast";
import ConfirmModal from "./confirmModal";
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { APIManager } from "../api/apiManager";

export function EnhancedPosts({page_number, page_size, response}: ListProps) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [toastMessage, setToastMsg] = useState("")
    const [toastColor, setToastColor] = useState<AlertColor>("success")
    const [createId, setCreateId] = useState<string>("")
    const [rows, setRows] = useState<RouteDetails[]>(response.routes)
    const [searchTxt, setSearch] = useState<string>("")
    const  originalList = response.routes

    useEffect(() => {
        setRows(response.routes)
    }, [response])  
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
    function handleFilter(inputTxt: string) {
        setSearch(inputTxt)
         if (inputTxt.length > 0) {
             let filterData: RouteDetails[] = originalList.filter((data) => data.title.toLowerCase().includes(inputTxt.toLowerCase()))
             setRows(filterData)

         } else {
            setRows(originalList)
         }
       
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
            <Toolbar  sx={{pl: { sm: 2 },pr: { xs: 1, sm: 5 }, justifyContent:'space-between'}}>
                <Box>
                <Typography variant="h6"  component="div">
                   {rows.length} Routes available 
                </Typography>
                </Box>
                <Box>
                <TextField placeholder="Search.." size="small" sx={{pr:2}} value={searchTxt} onChange={(event) => {handleFilter(event.target.value)}}  />
                <Tooltip title="Create new Mock">
                <Link href={`/posts/${createId}?isCreate=true`} style={{ textDecoration: 'none' }} prefetch={false} passHref >
                <Button variant="contained" startIcon={<AddIcon />} sx={{whiteSpace: "nowrap"}} onClick={() => {setCreateId(uuidv4())}}>
                    Add Route
                </Button>
                </Link>
                </Tooltip>
                </Box>   
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
                    {rows.map((row) => (
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
                                <IconButton>
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