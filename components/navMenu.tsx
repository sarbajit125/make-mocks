import { Typography } from "@mui/material";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { NavItemsList } from "./navbar";


export default function NavMenu(props: NavMenuProps) {
    return (
   <div>
     <Menu id={props.id}
    sx={{ mt: "45px" }}
    anchorEl={props.openMenu}
    anchorOrigin={
        props.isLeft ? {
                        vertical: "top",
                        horizontal: "left",
                    } : { 
                        vertical:"top",
                         horizontal:"right"
                    }}
      keepMounted
      transformOrigin={
        props.isLeft ? {
                        vertical: "top",
                        horizontal: "left",
                    } : { 
                        vertical:"top",
                         horizontal:"right"
                    }}
      open={Boolean(props.openMenu)}
      onClose={props.onClose}
    >
        {props.navItems.map((item) => (
            item.isExternal ? <MenuItem key={item.name}href={item.navlink}>
                                <Typography textAlign="center">{item.name}</Typography>
                              </MenuItem> : 
                            <Link key={item.name} href={item.navlink}>
                                <MenuItem key={item.name}>
                                    <Typography textAlign="center">{item.name}</Typography>
                                </MenuItem>
                            </Link>
        ))}
    </Menu>
   </div>
    )
}


export interface NavMenuProps {
    navItems: NavItemsList[]
    onClose: () => void;
    openMenu: null | HTMLElement;
    id: string;
    isLeft: boolean;
} 
