import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import {
  APIResponseErr,
  HeaderTableModel,
  HTTPStatusList,
  RequestType,
  RouteDetails,
} from "../../DTO/components";
import Editor from "@monaco-editor/react";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import { ChangeEvent, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import ShowToast from "../../components/showToast";
import {
  AlertColor,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { APIManager } from "../../api/apiManager";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import {styled } from '@mui/material/styles';
import { useQueryClient } from "react-query";
const validationSchema = yup.object({
  endpoint: yup.string().matches(/^\/.*/, "path must start with forward slash"),
  endpointTitle: yup.string().required("Please add title of mock"),
});

export default function Blog(props: { isCreate: boolean; post: RouteDetails }) {
  const navLinks: NavItemsList[] = [
    { name: "Dashboard", navlink: `/mocks?id=${props.post.domain}`, isExternal: false },
  ];
  const [headerArr, setheaderArr] = useState<HeaderTableModel[]>(props.post?.headers ?? []);
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastmsg] = useState("");
  const [toastColor, setToastColor] = useState<AlertColor>("success");
  const router = useRouter();
  const queryClient = useQueryClient()
  function submitRoute(isCreate: boolean, mock: RouteDetails) {
    if (isCreate) {
      APIManager.sharedInstance()
        .createRoute(mock)
        .then((response) => {
          queryClient.invalidateQueries('mocks')
          router.back()
          setToastmsg(response.message);
          setOpen(true);
        })
        .catch((err) => {
          if (err instanceof APIResponseErr) {
            setToastmsg(err.message);
            setOpen(true);
          } else {
            console.log(err);
          }
        });
    } else {
      APIManager.sharedInstance()
        .updateRoute(mock)
        .then((response) => {
          queryClient.invalidateQueries('mocks')
          router.back()
          setToastmsg(response.message);
          setToastColor("success");
          setOpen(true);
        })
        .catch((err) => {
          if (err instanceof APIResponseErr) {
            setToastmsg(err.message);
            setToastColor("error");
            setOpen(true);
          } else {
            console.log(err);
          }
        });
    }
  }

  const formik = useFormik({
    initialValues: {
      endpoint: props.post.endpoint,
      endpointHTTP: props.post.type,
      endpointCode: props.post.statusCode,
      endpointTitle: props.post.title,
      endpointResp: props.post.response,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let payload: RouteDetails = {
        id: props.post.id,
        title: values.endpointTitle,
        endpoint: values.endpoint,
        type: values.endpointHTTP,
        response: values.endpointResp,
        statusCode: values.endpointCode,
        domain: props.post.domain,
        headers: headerArr,
      };
      submitRoute(props.isCreate, payload);
    },
  });
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleCellTextChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    id: string
  ) => {
    const { value, name } = event.target;
    const newRows = headerArr.map((item) =>
      item.id === id && name ? { ...item, [name]: value } : item
    );
    setheaderArr(newRows);
  };
  const deleteheaderRow = (id: string) => {
    const newArr = headerArr.filter((item) => item.id != id);
    setheaderArr(newArr);
  };
  const addAnotherCell = () => {
    setheaderArr([
      ...headerArr,
      {
        id: uuidv4(),
        key: "key",
        value: "",
      },
    ]);
  };
  return (
    <Paper>
      <ResponsiveAppBar items={navLinks} />
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <Box sx={{ display: "flex", flexWrap: "wrap", pt: 3, px: 1 }}>
          <TextField
            fullWidth
            id="endpoint"
            label="Route path"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.post.domain}
                </InputAdornment>
              ),
            }}
            value={formik.values.endpoint}
            onBlur={formik.handleBlur}
            error={formik.touched.endpoint && Boolean(formik.errors.endpoint)}
            helperText={formik.touched.endpoint && formik.errors.endpoint}
            onChange={formik.handleChange}
          />
        </Box>
        <Box sx={{ pt: 3, px: 5, display: "inline-flex" }}>
          <TextField
            id="endpointHTTP"
            select
            label="select"
            name="endpointHTTP"
            value={formik.values.endpointHTTP}
            helperText="Please select request type"
            onChange={formik.handleChange}
          >
            {RequestType.map((request) => (
              <MenuItem key={request} value={request}>
                {request}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="endpointCode"
            select
            label="select"
            name="endpointCode"
            value={formik.values.endpointCode}
            helperText="Please select response status"
            onChange={formik.handleChange}
            sx={{ml: 5, px: 2}}
          >
            {HTTPStatusList.map((request) => (
              <MenuItem key={request.code} value={request.code}>
                {request.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ pt: 3, px: 1 }}>
          <TextField
            fullWidth
            id="endpointTitle"
            label="Title of Mock"
            value={formik.values.endpointTitle}
            onBlur={formik.handleBlur}
            error={
              formik.touched.endpointTitle &&
              Boolean(formik.errors.endpointTitle)
            }
            helperText={
              formik.touched.endpointTitle && formik.errors.endpointTitle
            }
            onChange={formik.handleChange}
          />
        </Box>
        <TableContainer
          sx={{
            width: "50%",
            display: "flex",
            mt: 5,
            px: 3,
          }}
        >
          <Table size="small">
            <caption>Enter headers for response</caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Tooltip title="add another header">
                    <IconButton onClick={addAnotherCell}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>Header Key</TableCell>
                <TableCell>Header value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {headerArr.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Tooltip title={"delete this row"}>
                      <IconButton onClick={() => deleteheaderRow(row.id)}>
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="filled"
                      value={row.key}
                      name="key"
                      onChange={(event) => handleCellTextChange(event, row.id)}
                    />
                  </TableCell>
                  <HeaderCell>
                    <TextField
                      variant="filled"
                      value={row.value}
                      name="value"
                      onChange={(event) => handleCellTextChange(event, row.id)}
                    />
                  </HeaderCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ pt: 3, px: 1 }} justifyContent="center" display="flex">
          <Editor
            height="80vh"
            width="80%"
            defaultLanguage="json"
            defaultValue={
              props.isCreate ? "//some comments" : props.post.response
            }
            theme="vs-dark"
            onChange={(value) => {
              formik.setFieldValue("endpointResp", value, true);
            }}
          />
        </Box>
        <Box
          sx={{ pt: 3, px: 1, pb: 3 }}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Button
            sx={{ mr: 2, width: "20%" }}
            variant="outlined"
            color="success"
            type="submit"
          >
            {" "}
            Submit
          </Button>
          <Button
            sx={{ width: "20%" }}
            variant="outlined"
            color="secondary"
            type="reset"
          >
            {" "}
            Reset
          </Button>
        </Box>
        <Box>
          <ShowToast
            message={toastMsg}
            open={open}
            onClose={handleClose}
            color={toastColor}
            onCrossClick={handleClose}
          />
        </Box>
      </form>
    </Paper>
  );
}
export async function getServerSideProps(context: {
  req: any;
  query: { id: string; isCreate: string; groupName: string };
}) {
  let pageId = context.query.id;
  const queryBool: boolean = context.query.isCreate === "true" ? true : false;
  if (queryBool) {
    const data: RouteDetails = {
      id: pageId,
      title: "",
      endpoint: "/",
      type: "POST",
      response: "// some response here",
      statusCode: 0,
      domain: context.query.groupName,
    };
    return { props: { post: data, isCreate: queryBool } };
  } else {
    try {
      console.log();
      const data = await APIManager.sharedInstance().fetchTheRoute(pageId);
      return { props: { post: data, isCreate: queryBool } };
    } catch (error) {
      console.log(error);
      return {
        redirect: {
          destination: "/posts/errors",
          permanent: false,
        },
      };
    }
  }
}

const HeaderCell = styled(TableCell)(({theme}) => ({
  width: 130,
}))