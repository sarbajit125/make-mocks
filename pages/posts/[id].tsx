import Paper from "@mui/material/Paper";
import { APIResponseErr, RouteDetails } from "../../DTO/components";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import { useState } from "react";

import { useRouter } from "next/router";
import { AlertColor, Backdrop, CircularProgress } from "@mui/material";
import { APIManager } from "../../api/apiManager";
import { useMutation, useQuery, useQueryClient } from "react-query";
import EnhancedForm from "../../components/EnhancedForm";

export default function Blog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isCreate: boolean =
    typeof router.query.isCreate === "string"
      ? router.query.id === "true"
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
    queryKey: ["post", pageId],
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
    mutationFn: (mock: RouteDetails) => APIManager.sharedInstance().createRoute(mock)
  })
  const [open, setOpen] = useState(false);
  const [showOverlay, setOverlay] = useState(true);
  const [toastMsg, setToastmsg] = useState("");
  const [toastColor, setToastColor] = useState<AlertColor>("success");

  function submitRoute(isCreate: boolean, mock: RouteDetails) {
    if (isCreate) {
      APIManager.sharedInstance()
        .createRoute(mock)
        .then((response) => {
          queryClient.invalidateQueries("mocks");
          router.back();
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
          queryClient.invalidateQueries("mocks");
          router.back();
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const prepareResponse = () => {
    if (isLoading) {
      return (
        <Paper>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showOverlay}
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
  };
  return <div>{prepareResponse()}</div>;
}
// export async function getServerSideProps(context: {
//   req: any;
//   query: { id: string; isCreate: string; groupName: string };
// }) {
//   let pageId = context.query.id;
//   const queryBool: boolean = context.query.isCreate === "true" ? true : false;

// }
