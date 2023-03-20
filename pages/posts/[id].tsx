import Paper from "@mui/material/Paper";
import { APIResponseErr, RouteDetails } from "../../DTO/components";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import { useState } from "react";

import { useRouter } from "next/router";
import { AlertColor, Backdrop, CircularProgress } from "@mui/material";
import { APIManager } from "../../api/apiManager";
import { useMutation, useQuery, useQueryClient } from "react-query";
import EnhancedForm from "../../components/EnhancedForm";
import ShowToast from "../../components/showToast";
import CustomErrPage from "./errors";

export default function Blog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isCreate: boolean =
    typeof router.query.isCreate === "string"
      ? router.query.isCreate === "true"
        ? true
        : false
      : false;
  const pageId = typeof router.query.id === "string" ? router.query.id : "";
  const defaultData: RouteDetails = {
    id: pageId,
    title: "",
    endpoint: "/",
    type: "POST",
    response: "// some response here",
    statusCode: 200,
    domain:
      typeof router.query.groupName === "string" ? router.query.groupName : "",
  };
  const {
    data: post,
    isSuccess,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["post", pageId, isCreate],
    queryFn: () => {
      if (isCreate) {
        return defaultData;
      } else {
        return APIManager.sharedInstance().fetchTheRoute(pageId);
      }
    },
  });
  const createMutation = useMutation({
    mutationKey:['createMock', pageId],
    mutationFn: (mock: RouteDetails) => APIManager.sharedInstance().createRoute(mock),
    onSuccess(data, _variables, _context) {
      setOpen(true)
      setToastmsg(data.message)
      setToastColor("success")
      queryClient.invalidateQueries({ queryKey: ['post', 'mocks']});
      
    },
    onError(error, _variables, _context) {
      if (error instanceof APIResponseErr) {
        setToastmsg(error.message)
      } else {
        setToastmsg("Something went wrong")
      }
      setToastColor("error")
      setOpen(true)
    },
  })
  const updateMutation = useMutation({
    mutationKey:['updateMock', pageId],
    mutationFn: (mock: RouteDetails) => APIManager.sharedInstance().updateRoute(mock),
    onSuccess(data, _variables, _context) {
      setOpen(true)
      setToastmsg(data.message)
      setToastColor("success")
      queryClient.invalidateQueries("mocks");
      queryClient.invalidateQueries("post");
    },
    onError(error, _variables, _context) {
      if (error instanceof APIResponseErr) {
        setToastmsg(error.message)
      } else {
        setToastmsg("Something went wrong")
      }
      setToastColor("error")
      setOpen(true)
    },
  })
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastmsg] = useState("");
  const [toastColor, setToastColor] = useState<AlertColor>("success");

  function submitRoute(isCreate: boolean, mock: RouteDetails) {
    if (isCreate) {
      createMutation.mutate(mock)
    } else {
      updateMutation.mutate(mock)
    }
  }

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    router.back()
  };
  const prepareResponse = () => {
    if (isLoading) {
      return (
        <Paper>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Paper>
      );
    }
    if (isSuccess) {
      const navLinks: NavItemsList[] = [
        {
          name: "Dashboard",
          navlink: `/mocks?id=${post.domain}`,
          isExternal: false,
        },
      ];
      return (
        <Paper>
          <ResponsiveAppBar items={navLinks} />
          <EnhancedForm
            post={post}
            isCreate={isCreate}
            handleSubmit={submitRoute}
          />
        </Paper>
      );
    }
    if (isError) {
      return (
        <CustomErrPage />
      )
    }
  };
  return(
    <div>
      {prepareResponse()}
      <ShowToast
        message={toastMsg}
        open={open}
        onClose={handleClose}
        color={toastColor}
        onCrossClick={handleClose}
      />
    </div>
  ) 
}