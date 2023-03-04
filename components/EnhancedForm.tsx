import Editor from "@monaco-editor/react";
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  TableBody,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  HTTPStatusList,
  RequestType,
  RouteDetails,
  HeaderTableModel,
} from "../DTO/components";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
function EnhancedForm({ post, isCreate, handleSubmit }: PostFormProps) {
  const validationSchema = yup.object({
    endpoint: yup
      .string()
      .matches(/^\/.*/, "path must start with forward slash"),
    endpointTitle: yup.string().required("Please add title of mock"),
  });
  const [headerArr, setheaderArr] = useState<HeaderTableModel[]>(
    post?.headers ?? []
  );
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
  const formik = useFormik({
    initialValues: {
      endpoint: post.endpoint,
      endpointHTTP: post.type,
      endpointCode: post.statusCode,
      endpointTitle: post.title,
      endpointResp: post.response,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let payload: RouteDetails = {
        id: post.id,
        title: values.endpointTitle,
        endpoint: values.endpoint,
        type: values.endpointHTTP,
        response: values.endpointResp,
        statusCode: values.endpointCode,
        domain: post.domain,
        headers: headerArr,
      };
      handleSubmit(isCreate, payload);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
      <Box sx={{ display: "flex", flexWrap: "wrap", pt: 3, px: 1 }}>
        <TextField
          fullWidth
          id="endpoint"
          label="Route path"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{post.domain}</InputAdornment>
            ),
          }}
          value={formik.values.endpoint}
          onBlur={formik.handleBlur}
          error={formik.touched.endpoint && Boolean(formik.errors.endpoint)}
          helperText={formik.touched.endpoint && formik.errors.endpoint}
          onChange={formik.handleChange}
        />
      </Box>
      <Box sx={{ pt: 3, px: 2, display: "inline-flex" }}>
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
          sx={{ ml: 5, px: 2 }}
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
            formik.touched.endpointTitle && Boolean(formik.errors.endpointTitle)
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
          defaultValue={isCreate ? "//some comments" : post.response}
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
      </Box>
    </form>
  );
}

export default EnhancedForm;
export interface PostFormProps {
  post: RouteDetails;
  isCreate: boolean;
  handleSubmit: (isCreate: boolean, route: RouteDetails) => void;
}
const HeaderCell = styled(TableCell)(({ theme }) => ({
    width: 130,
  }));
  