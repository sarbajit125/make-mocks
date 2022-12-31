
import {createContext} from 'react';

export const PageContext = createContext<PageTypeContext>({
    page_number:1,
    setNewPage: () => {}
  })
  
export type PageTypeContext = {
    page_number: number
    setNewPage:(pageNo: number) => void
  }
  