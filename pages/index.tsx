import { useState } from "react";
import { APIManager } from "../api/apiManager";
import ResponsiveAppBar, { NavItemsList } from "../components/navbar";
import ShowToast from "../components/showToast";
import { AlertColor } from "@mui/material";
import { dehydrate, QueryClient } from "react-query";
import DomainGrid from "../components/DomainGrid";
export default function Home() {
  const handleToastClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowToast(false);
    console.log("coming here");
  };
  const [toastMessage, setToastMsg] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastColor, setToastColor] = useState<AlertColor>("success");
  const toastContextVal = {
    toastMessage,
    setToastMsg,
    toastColor,
    setToastColor,
    showToast,
    setShowToast,
  };
  const navItems: NavItemsList[] = [
    { name: "About", navlink: "/about", isExternal: false },
  ];
  return (
    <div>
      <ResponsiveAppBar items={navItems} />
      <DomainGrid />
      <ShowToast
        message={toastMessage}
        open={showToast}
        onClose={handleToastClose}
        color={toastColor}
        onCrossClick={handleToastClose}
      />
    </div>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["domains"],
    queryFn: () => APIManager.sharedInstance().fetechAllDomains(),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
