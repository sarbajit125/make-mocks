import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MoreIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { Link as MaterialLink, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ExternalNavItems } from "../DTO/components";
function ResponsiveAppBar(props: NavbarProps) {
  const [openMenuLeft, setMenuLeft] = useState<null | HTMLElement>(null);
  const [openMenuRight, setMenuRight] = useState<null | HTMLElement>(null);
  function handleRighteMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMenuRight(event.currentTarget);
  }
  const handleLeftMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuLeft(event.currentTarget);
  };
  function handleCloseRightmenu() {
    setMenuRight(null);
  }
  const handleCloseLeftmenu = () => {
    setMenuLeft(null);
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{ justifyContent: "space-between", justifyItems: "center" }}
        disableGutters
      >
        <>
          <Box>
            <IconButton
              sx={{ display: { xs: "inline", sm: "none" } }}
              color="inherit"
              onClick={handleLeftMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              noWrap
              sx={{ display: { xs: "none", sm: "inline" }, ml: 3 }}
            >
              MAKE-MOCKS
            </Typography>
            {props.items.map((page) => (
              <Link
                key={page.name}
                href={page.navlink}
                style={{ textDecoration: "none" }}
              >
                <Button
                  key={page.name}
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    color: "white",
                    pb: 1,
                  }}
                >
                  <Typography noWrap>{page.name}</Typography>
                </Button>
              </Link>
            ))}
            <Box>
              <Menu
                id="left-menu"
                sx={{ mt: "45px" }}
                anchorEl={openMenuLeft}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(openMenuLeft)}
                onClose={handleCloseLeftmenu}
              >
                {props.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.navlink}
                    style={{ textDecoration: "none" }}
                  >
                    <MenuItem key={item.name}>
                      <Typography textAlign="center">{item.name}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
          </Box>
          <Box>
            {ExternalNavItems.map((menu) => (
              <MaterialLink
                href={menu.navlink}
                underline="none"
                color="inherit"
                target="_blank"
                rel="noreferrer"
                key={menu.name}
              >
                <Typography
                  noWrap
                  sx={{ display: { xs: "none", sm: "inline" }, px: 1, mr: 1 }}
                >
                  {menu.name}
                </Typography>
              </MaterialLink>
            ))}
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleRighteMenuOpen}
              color="inherit"
              sx={{ display: { xs: "inline", sm: "none" } }}
            >
              <MoreIcon />
            </IconButton>
            <Box>
              <Menu
                id="left-menu"
                sx={{ mt: "45px" }}
                anchorEl={openMenuRight}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(openMenuRight)}
                onClose={handleCloseRightmenu}
              >
                {ExternalNavItems.map((item) => (
                  <MenuItem key={item.name}>
                    <MaterialLink
                      href={item.navlink}
                      underline="none"
                      color="inherit"
                      target="_blank"
                      rel="noreferrer"
                      key={item.name}
                    >
                      <Typography textAlign="center">{item.name}</Typography>
                    </MaterialLink>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </>
      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;

export interface NavbarProps {
  items: NavItemsList[];
}

export interface NavItemsList {
  name: string;
  navlink: string;
  isExternal: boolean;
}
