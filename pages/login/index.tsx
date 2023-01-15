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
  Link,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoginReqSchema, LoginSuccessResponse } from "../../DTO/components";
import { APIManager } from "../../api/apiManager";
import { AuthContext } from "../../contexts/pageContext";
import  Router  from "next/router";
const validationSchema = yup.object({
  username: yup.string().email("please enter valid email id"),
  password: yup
    .string()
    .required("please enter password")
    .min(4, "password length cannot be less than 4"),
});
export default function SignIn() {
  const {isloggedIn, setlogin} = React.useContext(AuthContext)
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: LoginReqSchema = {
        username: values.username,
        password: values.password
      }
      handleLogin(payload)
    },
  });
  async function handleLogin(loginObj: LoginReqSchema ) {
    try {
      const response:LoginSuccessResponse = await APIManager.sharedInstance().login(loginObj)
        setlogin(true)
        Router.push('/')
    } catch (error) {
      console.log(error)
      setlogin(false)
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
            label="email"
            value={formik.values.username}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            onChange={formik.handleChange}
          />
        </Box>
        <Box sx={{ pt: 3, px: 1 }}>
          <TextField
            fullWidth
            required
            id="password"
            label="password"
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
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link href="#" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
