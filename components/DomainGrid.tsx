import React from "react";
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
} from "@mui/material";
import Link from "next/link";
import { getAllDomains } from "../DTO/queryHooks";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { CreateDomainReq } from "../DTO/components";
import { APIManager } from "../api/apiManager";
function DomainGrid() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [openDelete, toggleDelete] = React.useState(false);
  const [deleteId, setId] = React.useState<string>("");
  const domainMutation = useMutation(
    (item: CreateDomainReq) => APIManager.sharedInstance().setAdomain(item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("domains");
      },
    }
  );
  const deleteMutation = useMutation(
    (id: string) => APIManager.sharedInstance().deleteDomain(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("domains");
      },
    }
  );
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
  const { data: list, isSuccess, isError, isLoading } = getAllDomains();
  const renderView = () => {
    if (isSuccess) {
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
                        query: { id: item.id },
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
                    Press add button open form
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="contained" onClick={handleClickOpen}>
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
        </div>
      );
    } else if (isLoading) {
      return <div>isLoading</div>;
    } else if (isError) {
      return <div>isError</div>;
    } else {
      return <div>something went wrong</div>;
    }
  };
  return <>{renderView()}</>;
}
export default DomainGrid;
