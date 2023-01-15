import {
  AlertColor,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link as MaterialLink,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as yup from "yup";
import { useFormik } from "formik";
import { APIResponseErr, AuthReqSchema } from "../../DTO/components";
import { v4 as uuidv4 } from "uuid";
import { APIManager } from "../../api/apiManager";
import ShowToast from "../../components/showToast";
import { useState } from "react";
import Router from "next/router";
import Link from "next/link";
export default function Register() {
  const [showToast, setToast] = useState<boolean>(false);
  const [toastColor, setToastColor] = useState<AlertColor>("info");
  const [message, setMessage] = useState<string>("");
  const [isSucess, setSuccess] = useState<boolean>(false);
  const validationSchema = yup.object({
    username: yup
      .string()
      .email("please enter valid email id")
      .required("Email field cannot be empty"),
    password: yup
      .string()
      .required("please enter password")
      .min(4, "password length cannot be less than 4"),
    firstName: yup.string().required(),
    confirmPass: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match"),
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPass: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: AuthReqSchema = {
        userId: uuidv4(),
        username: values.username,
        password: values.password,
      };
      handleRegister(payload);
    },
  });
  function handleSnackbarClose(
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }
    setToast(false);
    setMessage("");
    if (isSucess) {
      Router.push("/login");
    }
  }
  async function handleRegister(userObj: AuthReqSchema) {
    try {
      const response = await APIManager.sharedInstance().register(userObj);
      setMessage(response.message);
      setToastColor("success");
      setToast(true);
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      if (error instanceof APIResponseErr) {
        setMessage(error.message);
        setToastColor("error");
        setToast(true);
      } else {
        console.log(error);
      }
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              value={formik.values.firstName}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              onChange={formik.handleChange}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              label="Email Address"
              name="username"
              autoComplete="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="confirmPass"
              label="Confirm password"
              type="password"
              id="confirmPass"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPass}
              error={
                formik.touched.confirmPass && Boolean(formik.errors.confirmPass)
              }
              helperText={
                formik.touched.confirmPass && formik.errors.confirmPass
              }
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
      </Box>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <MaterialLink component={Link} href="/login" variant="body2">
            Already have an account? Sign in
          </MaterialLink>
        </Grid>
      </Grid>
      <ShowToast
        open={showToast}
        message={message}
        color={toastColor}
        onClose={(event) => {
          handleSnackbarClose(event);
        }}
        onCrossClick={handleSnackbarClose}
      />
    </Container>
  );
}
