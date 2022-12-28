
import { Inter } from '@next/font/google'
import { APIManager } from '../api/apiManager';
import ResponsiveAppBar, { NavItemsList } from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import { RouteDetails } from '../DTO/components'

export default function Home(props: { mocks: RouteDetails[]; }) {
  const navItems: [NavItemsList] = [{name:"About", navlink:"/about"}]
  return (
   <div>
     <ResponsiveAppBar items={navItems} showSearch={true} searchCallback={function (inputTxt: string): void {
       console.log(inputTxt);
      } } />
     <EnhancedPosts mocks={props.mocks} />
   </div>
  )
}

export async function getStaticProps() {
  try {
    const res = await APIManager.sharedInstance().getAllRoutes()
    console.log(res)
    return {props:{mocks: res}}
  } catch (error) {
      console.log(error)
  }
 
}