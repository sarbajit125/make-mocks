import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContext } from '../contexts/pageContext'
import {useState} from 'react';
export default function App({ Component, pageProps }: AppProps) {
  const [isloggedIn, setlogin] = useState<boolean>(false)
  const contextValue = {isloggedIn, setlogin}
    return (
  <AuthContext.Provider value={contextValue}>
    <Component {...pageProps} />
    </AuthContext.Provider> 
  ) 
  
}
