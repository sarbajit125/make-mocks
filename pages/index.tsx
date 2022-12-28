
import { useEffect, useState } from 'react';
import { APIManager } from '../api/apiManager';
import ResponsiveAppBar, { NavItemsList } from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import ShowToast from '../components/showToast';
import { APIResponseErr, RouteDetails } from '../DTO/components'

export default function Home(props: { mocks: RouteDetails[]; }) {
  const [toastMsg, setToastMsg] = useState<string>("")
  const [openToast, setOpenToast] = useState<boolean>(false)
  const [mocks, setMocks] = useState<RouteDetails[]>([])
  const [isSearching, setSearching] = useState<boolean>(false)
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
     <ResponsiveAppBar items={navItems} showSearch={true} searchCallback={function (inputTxt: string): void {
        console.log(inputTxt)
          if (inputTxt.length > 0) {
            const filterList = mocks.filter((data) => {
              data.title.toLowerCase().includes(inputTxt.toLowerCase())
            })
            console.log(filterList)
            setSearching(true)
            setFilterList(filterList)
          } else {
            setSearching(false)
            setFilterList(mocks)
          }
      } } />
     <EnhancedPosts mocks={isSearching ? filterList : mocks}/>
     <ShowToast message={toastMsg} color={'error'} open={openToast} />
    </div>
  )
}