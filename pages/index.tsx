
import { Inter } from '@next/font/google'
import ResponsiveAppBar from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
import { RouteDetails } from '../DTO/components'

export default function Home(props: { mocks: RouteDetails[]; }) {
  return (
   <div>
     <ResponsiveAppBar />
     <EnhancedPosts mocks={props.mocks} />
   </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/mocks`,{
    method:'GET',
    headers:{
      Accept: 'application/json, text/plain, */*',
      'User-Agent': '*',
  }
  })
  let mocks = await res.json()
  return {props: {mocks: mocks,}}
}
 
