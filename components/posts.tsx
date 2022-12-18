import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableMock } from "../DTO/components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from "next/link";


export function EnhancedPosts() {
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
                    {TableMock.map((row) => (
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
                                <Link href= {`/posts/${row.id}`} passHref>
                                <IconButton >
                                    <EditIcon />
                                </IconButton>
                                </Link>   
                                </Tooltip> 
                                <Tooltip title="Delete the Mock">
                                    <IconButton>
                                         <DeleteIcon />
                                    </IconButton>   
                                </Tooltip>                        
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
     </TableContainer>
     </Paper>)
}
   