import Paper from "@mui/material/Paper";
import { APIResponseErr, RouteDetails } from "../../DTO/components";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AlertColor, Backdrop, CircularProgress } from "@mui/material";
import { APIManager } from "../../api/apiManager";
import { useMutation, useQuery, useQueryClient } from "react-query";
import EnhancedForm from "../../components/EnhancedForm";
import ShowToast from "../../components/showToast";
import { RoutePageContext } from "../../contexts/pageContext";

export default function Blog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {mockDetails, isCreate} = useContext(RoutePageContext)
  // const {data: details, isLoading, isSuccess} = useQuery({
  //   queryKey: ['headerList', mockDetails.id],
  //   queryFn: () => APIManager.sharedInstance().fetchRouteheaders(mockDetails.id),
  //   select(data) {
  //     const detailData: RouteDetails = {...mockDetails, headers: data.rows}
  //     return detailData
  //   },
  // })
  const navLinks: NavItemsList[] = [
    {
      name: "Dashboard",
      navlink: `/mocks?id=${mockDetails.domain}`,
      isExternal: false,
    },
  ];
  const createMutation = useMutation({
    mutationKey:['createMock', mockDetails.id],
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
    mutationKey:['updateMock', mockDetails.id],
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
  return(
    <Paper>
      <ResponsiveAppBar items={navLinks} />
      <EnhancedForm
            post={mockDetails}
            isCreate={isCreate}
            handleSubmit={submitRoute}
          /> 
       {createMutation.isLoading || updateMutation.isLoading  ? <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop> : null}
       <ShowToast
        message={toastMsg}
        open={open}
        onClose={handleClose}
        color={toastColor}
        onCrossClick={handleClose}
      />
    </Paper>
  ) 
}