import { createContext } from "react";
import { AlertColor } from "@mui/material";

export const PageContext = createContext<PageTypeContext>({
  page_number: 1,
  setNewPage: () => {},
  page_size: 5,
  setPageSize: () => {},
});

export type PageTypeContext = {
  page_number: number;
  setNewPage: (pageNo: number) => void;
  page_size: number;
  setPageSize: (pageSize: number) => void;
};

export const ToastContext = createContext<ToastTypeContext>({
  toastMessage: "",
  setToastMsg: () => {},
  toastColor: "success",
  setToastColor: () => {},
  showToast: false,
  setShowToast: () => {},
});

export type ToastTypeContext = {
  toastMessage: string;
  setToastMsg: (msg: string) => void;
  toastColor: AlertColor;
  setToastColor: (color: AlertColor) => void;
  showToast: boolean;
  setShowToast: (open: boolean) => void;
};

export const AuthContext = createContext<AuthTypeContext>({
  isloggedIn: false,
  setlogin: () => {},
})
export type AuthTypeContext = {
  isloggedIn: boolean;
  setlogin: (login: boolean) => void;
}