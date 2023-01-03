import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { APIResponseErr, RequestType, RouteDetails} from "../../DTO/components";
import Editor from "@monaco-editor/react";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import {useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router'
import ShowToast from "../../components/showToast";
import { AlertColor } from "@mui/material";
import { APIManager } from "../../api/apiManager";

const validationSchema = yup.object({
    endpoint: yup.string()
            .matches(/^\/.*/, "path must start with forward slash"),
    endpointTitle: yup.string().required('Please add title of mock')
})
const navLinks: NavItemsList[] = [{name:"Dashboard", navlink:"/", isExternal: false}]
export default function Blog(props: { isCreate: boolean; post: RouteDetails;}) {
    const [open, setOpen] = useState(false);
    const [toastMsg, setToastmsg] = useState("");
    const [toastColor, setToastColor] = useState<AlertColor>("success")
    const router = useRouter()
    function submitRoute(isCreate: boolean, mock:RouteDetails) {
        if (isCreate) {
            APIManager.sharedInstance().createRoute(mock).then((response) => {
                setToastmsg(response.message)
                setOpen(true)
            }).catch((err) => {
                if( err instanceof APIResponseErr) {
                    setToastmsg(err.message)
                    setOpen(true)
                } else {
                    console.log(err)
                }
            })
        } else {
            APIManager.sharedInstance().updateRoute(mock).then((response) => {
                setToastmsg(response.message)
                setToastColor("success")
                setOpen(true)
            }).catch ((err) => {    
                if( err instanceof APIResponseErr) {
                    setToastmsg(err.message)
                    setToastColor("error")
                    setOpen(true)
                } else {
                    console.log(err)
                }
            })
        }
    }
    
    const formik = useFormik({
        initialValues: {
            endpoint:  props.post.endpoint,
            endpointHTTP:  props.post.type,
            endpointTitle: props.post.title,
            endpointDesc: props.post.description,
            endpointResp:  props.post.response

        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
                let payload: RouteDetails = {
                    id: props.post.id,
                    title: values.endpointTitle,
                    description: values.endpointDesc,
                    endpoint: values.endpoint,
                    type: values.endpointHTTP,
                    response: values.endpointResp
                }
                submitRoute(props.isCreate, payload)
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
            <ResponsiveAppBar items={navLinks} />
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', pt: 3, px: 1}}>
            <TextField fullWidth
             id="endpoint"
             label="Route path"
             variant="outlined"
             InputProps={{startAdornment: <InputAdornment position="start">{process.env.clientName}</InputAdornment>}}
             value={formik.values.endpoint}
             onBlur={ formik.handleBlur}
             error={formik.touched.endpoint && Boolean(formik.errors.endpoint)}
             helperText={formik.touched.endpoint && formik.errors.endpoint}
             onChange = {formik.handleChange} />
            </Box>
            <Box sx={{pt:3, px: 1}}>
                <TextField id="endpointHTTP"
                 select
                 label="select"
                 name="endpointHTTP"
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
             onBlur={ formik.handleBlur}
             error={formik.touched.endpointTitle && Boolean(formik.errors.endpointTitle)}
             helperText={formik.touched.endpointTitle && formik.errors.endpointTitle}
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
           <Box sx={{pt:3, px: 1 }} justifyContent="center" display="flex">
           <Editor height="80vh"
             width="80%"
             defaultLanguage="json"
             defaultValue={props.isCreate ? "//some comments" : props.post.response}
             theme="vs-dark"
             onChange={(value) => {formik.setFieldValue("endpointResp",value,true)}} />
           </Box>
            <Box sx={{pt:3, px: 1, pb:3}} alignItems="center" justifyContent="center" display="flex">  
            <Button sx={{mr: 2, width: '20%'}}  variant="outlined" color="success" type="submit"> Submit</Button>
            <Button sx={{ width: '20%'}} variant="outlined" color="secondary" type="reset"> Reset</Button>
            </Box> 
            <Box>
                <ShowToast message={toastMsg} open={open} onClose={handleClose} color={toastColor} onCrossClick={handleClose} />
            </Box>
            </form>        
        </Paper>
    )
}
export async function getServerSideProps(context: { query: { id: string; isCreate: string; }; }) {
    let pageId = context.query.id 
    const queryBool: boolean = context.query.isCreate === "true" ? true : false
    if (queryBool) {
        const data: RouteDetails = {
            id: pageId,
            title: "",
            description: "",
            endpoint: "/",
            type: "POST",
            response: "// some response here"
        }
        return {props:{post: data, isCreate: queryBool}}
    } else {
        try {
            const data = await APIManager.sharedInstance().fetchTheRoute(pageId)
            return {props: {post:data, isCreate: queryBool }}
        } catch (error) {
            console.log(error)
            return {redirect:{
                destination: '/posts/errors',
                permanent: false,
              },}
        }
    }
}