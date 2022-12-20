import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Posts, RequestType, TableMock } from "../../DTO/components";
import Editor from "@monaco-editor/react";
import ResponsiveAppBar from "../../components/navbar";
import { ChangeEvent } from "react";

export default function Blog(props) {
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
             defaultValue = {props.isCreate? "":props.post.endpoint}
             onChange = {event => {console.log(event.target.value)}} />
            </Box>
            <Box sx={{pt:3, px: 1}}>
                <TextField id="endpointHTTP" select label="select" defaultValue={props.isCreate? "POST": props.post.type} helperText="Please select request type"  onChange={event=>{console.log(event.target.value)}}>
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
             defaultValue={props.isCreate?"":props.post.title}
             onChange={event => {console.log(event.target.value)}}   />
            </Box>
            <Box sx={{pt:3, px: 1}}>   
            <TextField
             fullWidth
             id="endpointDesc"
             label = "Description of Mock"
             defaultValue={props.isCreate ? "" : props.post.description}
             onChange={event => {console.log(event.target.value)}} />
            </Box>  
           <Box sx={{pt:3, px: 1 }} display="flex">
           <Editor height="80vh"
             defaultLanguage="json"
             defaultValue={props.isCreate ? "//some comments" : props.post.response}
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

export async function getServerSideProps(context: { query: { id: any; }; }) {
    let pageId = context.query.id 
    console.log(pageId)
    const data = TableMock[pageId]
    return {props: {post:JSON.parse(JSON.stringify(data)), isCreate: false}}

}