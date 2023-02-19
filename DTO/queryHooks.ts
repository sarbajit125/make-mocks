import { useQuery } from "react-query"
import { APIManager } from "../api/apiManager"

export const getAllDomains = () => {
   return  useQuery({
        queryKey: ['domains'],
        queryFn: () => APIManager.sharedInstance().fetechAllDomains()
    })
}