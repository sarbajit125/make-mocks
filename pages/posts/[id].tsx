import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Posts, RequestType, ResponseStatus, ResponseStruct, RouteDetails, SuccessResponse, TableMock } from "../../DTO/components";
import Editor from "@monaco-editor/react";
import ResponsiveAppBar from "../../components/navbar";
import { ChangeEvent, useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Alert, Snackbar } from "@mui/material";
import { useRouter } from 'next/router'
import { timeStamp } from "console";

const validationSchema = yup.object({
    endpoint: yup.string(),
    endpointTitle: yup.string().required('please add title of mock')
})
export default function Blog(props: { isCreate: boolean; post: RouteDetails; }) {
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const formik = useFormik({
        initialValues: {
            endpoint: props.isCreate ? "/" : props.post.endpoint,
            endpointHTTP: props.isCreate? "POST": props.post.type,
            endpointTitle: props.isCreate?"":props.post.title,
            endpointDesc: props.isCreate ? "" : props.post.description,
            endpointResp: props.isCreate ? "// some comments here" : props.post.response

        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (props.isCreate) {
                let payload: RouteDetails = {
                    id: uuidv4(),
                    title: values.endpointTitle,
                    description: values.endpointDesc,
                    endpoint: values.endpoint,
                    type: values.endpointHTTP,
                    response: values.endpointResp
                }
                submitPost(props.isCreate, payload).then((response) => {
                    if (response.status == ResponseStatus.Success) {
                        setOpen(true)
                    }
                })
            } else {
                let payload: RouteDetails = {
                    id: props.post.id,
                    title: values.endpointTitle,
                    description: values.endpointDesc,
                    endpoint: values.endpoint,
                    type: values.endpointHTTP,
                    response: values.endpointResp
                }
                 submitPost(props.isCreate, payload).then((response) => {
                    if (response.status == ResponseStatus.Success) {
                        setOpen(true)
                    }
                 })
            }
        }
    })
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false)
        router.push("/")
      };
    return(
        <Paper>
            <ResponsiveAppBar />
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', pt: 3, px: 1}}>
            <TextField fullWidth
             id="endpoint"
             label="Route path"
             variant="outlined"
             InputProps={{startAdornment: <InputAdornment position="start">/</InputAdornment>}}
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
             onChange={(value) => {formik.setFieldValue("endpointResp",JSON.stringify(value),true)}} />
           </Box>
            <Box sx={{pt:3, px: 1, pb:3}} alignItems="center" justifyContent="center" display="flex">  
            <Button sx={{mr: 2, width: '20%'}}  variant="outlined" color="success" type="submit"> Submit</Button>
            <Button sx={{ width: '20%'}} variant="outlined" color="secondary" type="reset"> Reset</Button>
            </Box> 
            <Box>
                {open && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{width:'100%'}}> Mock updated successfully</Alert>
                </Snackbar> }
               
            </Box>
            </form>        
        </Paper>
    )
}

async function submitPost(isCreate: boolean, mock:RouteDetails) : Promise<ResponseStruct> {
    try {
         if (isCreate) {
         const res = await fetch(`http://localhost:3000/mocks`,{
         method:'POST',
         body: JSON.parse(JSON.stringify(mock))
    })
    const data = await res.json() as SuccessResponse
    if (res.ok) {     
        return {
            status: ResponseStatus.Success,
            timeStamp: data.timeStamp,
            message: data.message,
            serviceCode: data.serviceCode
        }
     } else {
        return {
            status: ResponseStatus.Failure,
            timeStamp: "",
            message: "Something went wrong",
            serviceCode: 400
        }
     }
    } else {
        let body = (JSON.stringify(mock))
        console.log(body)
       const res = await fetch(`http://localhost:3000/mocks`, {
        method:'PUT',
        body: body
       })
       const data = await res.json() as SuccessResponse
       if (res.ok) {
        return {
            status: ResponseStatus.Failure,
            timeStamp: data.timeStamp,
            message: data.message,
            serviceCode: data.serviceCode
        }
       } else {
        return {
            status: ResponseStatus.Failure,
            timeStamp: "",
            message: "Something went wrong",
            serviceCode: 400
        }
       }
    }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong")
    }
}

export async function getServerSideProps(context: { query: { id: string; isCreate: string; }; }) {
    let pageId = context.query.id 
   const res = await fetch(`http://localhost:3000/mocks/${pageId}`)
   const data = await res.json() as RouteDetails
    const queryBool: boolean = context.query.isCreate === "true" ? true : false
    return {props: {post:data, isCreate: queryBool }}

}