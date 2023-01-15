import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Container,
  TextField,
  Box,
  Avatar,
  Button,
  Grid,
  Link as MaterialLink,
  Typography,
  AlertColor,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  APIResponseErr,
  LoginReqSchema,
  LoginSuccessResponse,
} from "../../DTO/components";
import { APIManager } from "../../api/apiManager";
import { AuthContext } from "../../contexts/pageContext";
import Router from "next/router";
import Link from "next/link";
import ShowToast from "../../components/showToast";
const validationSchema = yup.object({
  username: yup.string().email("please enter valid email id"),
  password: yup
    .string()
    .required("please enter password")
    .min(4, "password length cannot be less than 4"),
});
export default function SignIn() {
  const { isloggedIn, setlogin } = React.useContext(AuthContext);
  const [showToast, setToast] = React.useState<boolean>(false);
  const [toastColor, setToastColor] = React.useState<AlertColor>("info");
  const [message, setMessage] = React.useState<string>("");
  const [isSucess, setSuccess] = React.useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: LoginReqSchema = {
        username: values.username,
        password: values.password,
      };
      handleLogin(payload);
    },
  });
  function hanldeSnackbar(
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }
    setToast(false);
    setMessage("");
    if (isSucess) {
      setlogin(true);
      Router.push("/");
    }
  }
  async function handleLogin(loginObj: LoginReqSchema) {
    try {
      const response: LoginSuccessResponse =
        await APIManager.sharedInstance().login(loginObj);
      setMessage("Login successfull, redirecting to dashboard");
      setToast(true);
      setToastColor("success");
      setSuccess(true);
    } catch (error) {
      setlogin(false);
      setSuccess(false);
      if (error instanceof APIResponseErr) {
        setMessage(error.message);
        setToast(true);
        setToastColor("error");
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
          Sign in
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ pt: 3, px: 1 }}>
          <TextField
            fullWidth
            required
            id="username"
            label="Email"
            value={formik.values.username}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            onChange={formik.handleChange}
            autoFocus
          />
        </Box>
        <Box sx={{ pt: 3, px: 1 }}>
          <TextField
            fullWidth
            required
            id="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            onChange={formik.handleChange}
          />
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </form>
      <Grid container>
        <Grid item xs>
          <MaterialLink href="#" variant="body2">
            Forgot password?
          </MaterialLink>
        </Grid>
        <Grid item>
          <MaterialLink component={Link} href="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </MaterialLink>
        </Grid>
      </Grid>
      <ShowToast
        open={showToast}
        message={message}
        color={toastColor}
        onClose={(event) => {
          hanldeSnackbar(event);
        }}
        onCrossClick={(event) => {
          hanldeSnackbar(event);
        }}
      />
    </Container>
  );
}
