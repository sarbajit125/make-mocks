
import { Inter } from '@next/font/google'
import ResponsiveAppBar from '../components/navbar'
import { EnhancedPosts } from '../components/posts'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
   <div>
     <ResponsiveAppBar />
     <EnhancedPosts />
   </div>
  )
}
