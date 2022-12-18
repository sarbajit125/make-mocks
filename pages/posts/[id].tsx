import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Posts, RequestType } from "../../DTO/components";
import Editor from "@monaco-editor/react";
import ResponsiveAppBar from "../../components/navbar";

export default function Blog(post:Posts, isCreate: boolean) {
    function handleTextfieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        
    }
    return(
        <Paper>
            <ResponsiveAppBar />
            <Box sx={{display: 'flex', flexWrap: 'wrap', pt: 3, px: 1}}>
            <TextField fullWidth
             id="endpoint"
             label="Route path"
             variant="outlined"
             inputProps={{startAdornment: <InputAdornment position="start">/</InputAdornment>,}}
             onChange = {event => {console.log(event.target.value)}} />
            </Box>
            <Box sx={{pt:3, px: 1}}>
                <TextField id="endpointHTTP" select label="select" defaultValue="POST" helperText="Please select request type" onChange={event=>{console.log(event.target.value)}}>
                    {
                        RequestType.map((request)=>(
                        <MenuItem key={request} value={request}>{request}</MenuItem>
                        ))
                    }    
                </TextField>
            </Box>
            <Box  sx={{pt:3, px: 1}}>
            <TextField
             fullWidth
             id="endpointTitle"
             label="Title of Mock"
             onChange={event => {console.log(event.target.value)}}   />
            </Box>
            <Box sx={{pt:3, px: 1}}>   
            <TextField
             fullWidth
             id="endpointDesc"
             label = "Description of Mock"
             onChange={event => {console.log(event.target.value)}} />
            </Box>  
           <Box sx={{pt:3, px: 1 }} display="flex">
           <Editor height="80vh"
             defaultLanguage="json"
             defaultValue="// some comment"
             theme="vs-dark"
             onChange={event => {console.log(event)}} />
           </Box>
            <Box sx={{pt:3, px: 1, pb:3}} alignItems="center" justifyContent="center" display="flex">  
            <Button sx={{mr: 2, width: '20%'}}  variant="outlined" color="success"> Submit</Button>
            <Button sx={{ width: '20%'}} variant="outlined" color="secondary"> Reset</Button>
            </Box>         
        </Paper>
    )
}