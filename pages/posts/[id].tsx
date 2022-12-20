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
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    endpoint: yup.string(),
    endpointTitle: yup.string().required('please add title of mock')
})
export default function Blog(props) {
    function handleTextfieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        
    }
    const formik = useFormik({
        initialValues: {
            endpoint: props.isCreate ? "/" : props.post.endpoint,
            endpointHTTP: props.isCreate? "POST": props.post.type,
            endpointTitle: props.isCreate?"":props.post.title,
            endpointDesc: props.isCreate ? "" : props.post.description,
            endpointResp: props.isCreate ? "// some comments here" : props.post.response

        },
        validationSchema: validationSchema,
        onSubmit: (values) => {console.log(JSON.stringify(values, null, 2))}
    })
    return(
        <Paper>
            <ResponsiveAppBar />
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', pt: 3, px: 1}}>
            <TextField fullWidth
             id="endpoint"
             label="Route path"
             variant="outlined"
             inputProps={{startAdornment: <InputAdornment position="start">/</InputAdornment>,}}
             value={formik.values.endpoint}
             onChange = {formik.handleChange} />
            </Box>
            <Box sx={{pt:3, px: 1}}>
                <TextField id="endpointHTTP"
                 select label="select"
                  value={formik.values.endpointHTTP}
                   helperText="Please select request type"
                     onChange={formik.handleChange}>
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
             value={formik.values.endpointTitle}
             onChange={formik.handleChange}   />
            </Box>
            <Box sx={{pt:3, px: 1}}>   
            <TextField
             fullWidth
             id="endpointDesc"
             label = "Description of Mock"
             value={formik.values.endpointDesc}
             onChange={formik.handleChange} />
            </Box>  
           <Box sx={{pt:3, px: 1 }} display="flex">
           <Editor height="80vh"
             defaultLanguage="json"
             defaultValue={props.isCreate ? "//some comments" : props.post.response}
             theme="vs-dark"
             onChange={formik.handleChange} />
           </Box>
            <Box sx={{pt:3, px: 1, pb:3}} alignItems="center" justifyContent="center" display="flex">  
            <Button sx={{mr: 2, width: '20%'}}  variant="outlined" color="success" type="submit"> Submit</Button>
            <Button sx={{ width: '20%'}} variant="outlined" color="secondary" type="reset"> Reset</Button>
            </Box> 
            </form>        
        </Paper>
    )
}

export async function getServerSideProps(context: { query: { id: any; }; }) {
    let pageId = context.query.id 
    const data = TableMock[pageId]
    return {props: {post:JSON.parse(JSON.stringify(data)), isCreate: false}}

}