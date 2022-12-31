
import {useEffect, useState} from 'react';
import { APIManager } from '../api/apiManager';
import ResponsiveAppBar, { NavItemsList } from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import ShowToast from '../components/showToast';
import { PageContext, ToastContext } from '../contexts/pageContext';
import { APIResponseErr, defaultResponse,  RoutesResponse } from '../DTO/components'
import { AlertColor } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false)
    router.replace("/")
  };
  const router = useRouter()
  const [page_size, setPageSize] = useState<number>(5)
  const [page_number, setNewPage] = useState<number>(1)
  const contextValue = {page_number, setNewPage, page_size, setPageSize}
  const [toastMessage, setToastMsg] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [mocks, setMocks] = useState<RoutesResponse>(defaultResponse)
  const [toastColor, setToastColor] = useState<AlertColor>("success")
  const toastContextVal = {toastMessage, setToastMsg, toastColor, setToastColor, showToast, setShowToast }
  useEffect( () => {
    APIManager.sharedInstance().getAllRoutes(page_number, page_size).then ((res) => {
      setMocks(res)
    }).catch((err) => {
      if (err instanceof APIResponseErr) {
        setShowToast(true)
        setToastMsg(err.message)
        setToastColor("error")
      } else {
        console.log(err)
      }
    })
  },[page_number, page_size])
  const navItems: NavItemsList[] = [{name:"About", navlink:"/about", isExternal: false}]
  return (
    <PageContext.Provider value={contextValue} >
    <ToastContext.Provider value={toastContextVal} >
   <div>
     <ResponsiveAppBar items={navItems}/>
     <EnhancedPosts response={mocks}/>
    <ShowToast message={toastMessage} open={showToast} onClose={handleToastClose} color={toastColor}  />
    </div>
    </ToastContext.Provider>
    </PageContext.Provider>
  )
}

