
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

export async function getStaticProps() {
  const res = await fetch(`http://localhost:3000/mocks`,{method:'GET'})
  const mocks = await res.json() as RouteDetails
  console.log(mocks)
  return {props: JSON.parse(JSON.stringify(mocks))}
}
 
