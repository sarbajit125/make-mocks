
import {useContext, useEffect, useState} from 'react';
import { APIManager } from '../api/apiManager';
import ResponsiveAppBar, { NavItemsList } from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import ShowToast from '../components/showToast';
import { AuthContext, PageContext, ToastContext } from '../contexts/pageContext';
import { APIResponseErr, defaultResponse,  RoutesResponse } from '../DTO/components'
import { AlertColor } from "@mui/material";
import Router from 'next/router'
import { dehydrate, QueryClient } from 'react-query';
import { getAllDomains } from '../DTO/queryHooks';
import DomainGrid from '../components/DomainGrid';
export default function Home() {
  const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false)
    console.log("coming here")
    setRefresh(true)
  };
  const [page_size, setPageSize] = useState<number>(5)
  const [page_number, setNewPage] = useState<number>(1)
  const contextValue = {page_number, setNewPage, page_size, setPageSize}
  const [toastMessage, setToastMsg] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [ toRefresh, setRefresh] = useState<boolean> (false)
  const [mocks, setMocks] = useState<RoutesResponse>(defaultResponse)
  const [toastColor, setToastColor] = useState<AlertColor>("success")
  const toastContextVal = {toastMessage, setToastMsg, toastColor, setToastColor, showToast, setShowToast }
  const {isloggedIn, setlogin} = useContext(AuthContext)
  useEffect( () => {
      APIManager.sharedInstance().getAllRoutes(page_number, page_size).then ((res) => {
        setMocks(res)
        setRefresh(false)
      }).catch((err) => {
        if (err instanceof APIResponseErr) {
          setShowToast(true)
          setToastMsg(err.message)
          setToastColor("error")
          setRefresh(false)
          setlogin(false)
        } else {
          console.log(err)
        }
      })    
  },[page_number, page_size, toRefresh, isloggedIn])
  const navItems: NavItemsList[] = [{name:"About", navlink:"/about", isExternal: false}]
  return (
    <PageContext.Provider value={contextValue} >
    <ToastContext.Provider value={toastContextVal} >
   <div>
     <ResponsiveAppBar items={navItems}/>
     <DomainGrid />
    <ShowToast message={toastMessage} open={showToast} onClose={handleToastClose} color={toastColor} onCrossClick={handleToastClose}  />
    </div>
    </ToastContext.Provider>
    </PageContext.Provider>
  )
}

export async function  getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['domains'],
    queryFn: () => APIManager.sharedInstance().fetechAllDomains()
  })
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
  
} 

