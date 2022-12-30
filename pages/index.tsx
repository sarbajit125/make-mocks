
import { SetStateAction, useEffect, useState } from 'react';
import { APIManager } from '../api/apiManager';
import ResponsiveAppBar, { NavItemsList } from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import ShowToast from '../components/showToast';
import { APIResponseErr, defaultResponse,  RoutesResponse } from '../DTO/components'

export default function Home() {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false)
  };
  const page_size = 5
  const [page_number, setNewPage] = useState<number>(1)
  const [toastMsg, setToastMsg] = useState<string>("")
  const [openToast, setOpenToast] = useState<boolean>(false)
  const [mocks, setMocks] = useState<RoutesResponse>(defaultResponse)
  useEffect( () => {
    APIManager.sharedInstance().getAllRoutes(page_number, page_size).then ((res) => {
      setMocks(res)
    }).catch((err) => {
      if (err instanceof APIResponseErr) {
        setOpenToast(true)
        setToastMsg(err.message)
      } else {
        console.log(err)
      }
    })
  },[])
  const navItems: [NavItemsList] = [{name:"About", navlink:"/about"}]
  return (
   <div>
     <ResponsiveAppBar items={navItems}/>
     <EnhancedPosts page_number={0} page_size={0} response={mocks} />
     <ShowToast message={toastMsg} color={'error'} open={openToast} onClose={(event) => handleClose(event)} />
    </div>
  )
}

