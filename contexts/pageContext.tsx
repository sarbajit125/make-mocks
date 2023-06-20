import { createContext } from "react";
import { AlertColor } from "@mui/material";
import { RouteDetails } from "../DTO/components";

export type RoutePageType = {
  isCreate: boolean,
  mockId: string,
  mockDetails: RouteDetails,
  toggleIsCreate: (isCreate: boolean) => void
  setMockCuid: (id: string) => void
  setMockPage: (pageDetails: RouteDetails) => void
}
export const dummyMockDetails: RouteDetails = {
  id: "",
    title: "",
    endpoint: "/",
    type: "POST",
    response: "// some response here",
    statusCode: 200,
    domain: ""
} 

export const RoutePageContext = createContext<RoutePageType>({
  isCreate: true,
  mockId: '',
  mockDetails: dummyMockDetails,
  setMockCuid(id) {
    
  },
  setMockPage(pageDetails) {
    
  },
  toggleIsCreate(isCreate) {
    
  },
})

export const AuthContext = createContext<AuthTypeContext>({
  isloggedIn: false,
  setlogin: () => {},
})
export type AuthTypeContext = {
  isloggedIn: boolean;
  setlogin: (login: boolean) => void;
}