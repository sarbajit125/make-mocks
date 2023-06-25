import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  AlertColor,
  Fab,
} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Link from "next/link";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { APIResponseErr, CreateDomainReq, DomainDTO } from "../DTO/components";
import { APIManager } from "../api/apiManager";
import { useRouter } from "next/router";
import ShowToast from "./showToast";
function DomainGrid({ list }: DomainGridProps) {
  const [open, setOpen] = useState(false);
  const [openDelete, toggleDelete] = useState(false);
  const [toastMessage, setToastMsg] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastColor, setToastColor] = useState<AlertColor>("success");
  const [deleteId, setId] = React.useState<string>("");
  const router = useRouter();
  const domainMutation = useMutation(
    (item: CreateDomainReq) => APIManager.sharedInstance().setAdomain(item),
    {
      onSuccess: (data) => {
        setToastMsg(data.message);
        setToastColor("success");
        setShowToast(true);
      },
      onError(error, variables, context) {
        setToastMsg(
          error instanceof APIResponseErr
            ? error.message
            : "Something went wrong"
        );
        setToastColor("error");
        setShowToast(true);
      },
    }
  );
  const deleteMutation = useMutation(
    (id: string) => APIManager.sharedInstance().deleteDomain(id),
    {
      onSuccess: (data) => {
        setToastMsg(data.message);
        setToastColor("success");
        setShowToast(true);
      },
      onError(error, variables, context) {
        setToastMsg(
          error instanceof APIResponseErr
            ? error.message
            : "Something went wrong"
        );
        setToastColor("error");
        setShowToast(true);
      },
    }
  );
  const backUPData = useQuery({
    queryKey:["backupDomain"],
    queryFn: () => APIManager.sharedInstance().backupDomains(),
    onSuccess: (data) => {
      // this works and prompts for download
      var link = document.createElement('a')  // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
      link.href = window.URL.createObjectURL(data)
      link.download = "Domains.json"
      link.click()
      link.remove();  //afterwards we remove the element 
    },
    onError: (err) => {
      setToastMsg(
        err instanceof APIResponseErr
          ? err.message
          : "Something went wrong"
      );
      setToastColor("error");
      setShowToast(true);
    },
    enabled: false
  })
  const validationSchema = yup.object({
    id: yup
      .string()
      .required("Id cannot be empty")
      .max(10, "id cannot exceed 10 characters"),
    desc: yup
      .string()
      .optional()
      .max(30, "description cannot exceed more than 30 characters"),
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleToastClose = () => {
    setShowToast(false);
    router.replace(router.asPath);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const showDeleteConfirm = (id: string) => {
    setId(id);
    toggleDelete(true);
  };
  const closeDeleteConfirm = () => {
    toggleDelete(false);
  };
  const confirmDelete = () => {
    closeDeleteConfirm();
    deleteMutation.mutate(deleteId);
  };
  const formInitalValue = {
    id: "",
    desc: "",
  };
  const handleFormSubmit = (values: { id: string; desc: string }) => {
    handleClose();
    const reqObj: CreateDomainReq = {
      id: values.id,
      name: values.id,
      desc: values.desc,
    };
    domainMutation.mutate(reqObj);
  };
  return (
    <div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        style={{
          marginTop: 20,
          padding: 5,
        }}
      >
        {list.map((item) => (
          <Grid item xs={2} sm={4} md={4} key={item.id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2">{item.desc}</Typography>
              </CardContent>
              <CardActions>
                <Link
                  passHref
                  href={{
                    pathname: "/mocks",
                    query: { id: item.name },
                  }}
                >
                  <Button size="small" onClick={() => console.log("hello")}>
                    Open
                  </Button>
                </Link>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => showDeleteConfirm(item.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item xs={2} sm={4} md={4} key={"Add"}>
          <Card sx={{ Width: 200 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Subscribe Another domain
              </Typography>
              <Typography variant="body2">
                Press add button to open form
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
              >
                Add
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill the following field to subscribe a new domain
          </DialogContentText>
          <Formik
            initialValues={formInitalValue}
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Box sx={{ pt: 3, px: 1 }}>
                  <TextField
                    autoFocus
                    error={Boolean(props.errors.id) && props.touched.id}
                    label="Name of domain"
                    name="id"
                    value={props.values.id}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={props.errors.id && props.touched.id}
                  />
                </Box>
                <Box sx={{ pt: 3, px: 1 }}>
                  <TextField
                    fullWidth
                    error={Boolean(props.errors.desc) && props.touched.desc}
                    label="description of domain"
                    name="desc"
                    value={props.values.desc}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={props.errors.desc && props.touched.desc}
                  />
                </Box>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Subscribe</Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete}>
        <DialogTitle>Please confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm you want to delete this domain
          </DialogContentText>
          <DialogActions>
            <Button onClick={closeDeleteConfirm}>Cancel</Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {domainMutation.isLoading || deleteMutation.isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={domainMutation.isLoading || deleteMutation.isLoading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      {showToast ? (
        <ShowToast
          message={toastMessage}
          open={showToast}
          onClose={handleToastClose}
          color={toastColor}
          onCrossClick={handleToastClose}
        />
      ) : null}
      <Fab variant="extended" style={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
      }} color='primary' onClick={() => (backUPData.refetch())}>
        <FileDownloadIcon sx={{ mr: 1 }} />
        Backup
      </Fab>
    </div>
  );
}
export default DomainGrid;

export interface DomainGridProps {
  list: DomainDTO[];
}
