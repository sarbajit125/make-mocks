
import { SetStateAction, useEffect, useState } from 'react';
import { APIManager } from '../api/apiManager';
import ResponsiveAppBar, { NavItemsList } from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import ShowToast from '../components/showToast';
import { APIResponseErr, RouteDetails } from '../DTO/components'

export default function Home(props: { mocks: RouteDetails[]; }) {
  const [toastMsg, setToastMsg] = useState<string>("")
  const [openToast, setOpenToast] = useState<boolean>(false)
  const [mocks, setMocks] = useState<RouteDetails[]>([])
  const [filterList, setFilterList] = useState<RouteDetails[]>([])
  useEffect( () => {
    APIManager.sharedInstance().getAllRoutes().then ((res) => {
      setMocks(res)
    }).catch((err) => {
      if (err.instanceof(APIResponseErr)) {
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
     <EnhancedPosts mocks={mocks}/>
     <ShowToast message={toastMsg} color={'error'} open={openToast} />
    </div>
  )
}

