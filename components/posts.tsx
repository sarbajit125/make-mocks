import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ListProps, Posts, ResponseStatus, ResponseStruct, RouteDetails, SuccessResponse, TableMock } from "../DTO/components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from "next/link";
import { useState } from "react";
import ShowToast from "./showToast";


export function EnhancedPosts(props: ListProps) {
    let toastMessage = ""
    function handleDelete(id:string) {
        try {
            deleteMock(id).then((response) => {
                if(response.status === ResponseStatus.Success) {
                    setAlert(true)
                    toastMessage = response.message
                }   
            }) 
        } catch(err) {
            console.log(err)
        }
    }
    let [showAlert, setAlert] = useState(false)
    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlert(false)
      };
    return ( 
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Toolbar>
                <Typography variant="h6"  sx={{ flex: '1 1 100%' }} component="div">
                    Mock routes
                </Typography>
                <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
            </Toolbar>
    <TableContainer>
            <Table stickyHeader>
                <TableHead>
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
                                <Link href= {`/posts/${row.id}?isCreate=false`} passHref>
                                <IconButton >
                                    <EditIcon />
                                </IconButton>
                                </Link>   
                                </Tooltip> 
                                <Tooltip title="Delete the Mock">
                                    <IconButton onClick={handleDelete(row.id)}>
                                         <DeleteIcon />
                                    </IconButton>   
                                </Tooltip>                        
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
     </TableContainer>
     <ShowToast message={toastMessage} open={showAlert} onClose={handleToastClose}  />
     </Paper>)
}

export async function deleteMock(id:string): Promise<ResponseStruct> {
    const res = await fetch(`http://localhost:3000/mocks?` + new URLSearchParams({
        id:id,
    }),{
        method:"DELETE"
    })
    const data = await res.json() as SuccessResponse
    return {
        status: ResponseStatus.Success,
        timeStamp: data.timeStamp,
        serviceCode: data.serviceCode,
        message: data.message
    }

}
