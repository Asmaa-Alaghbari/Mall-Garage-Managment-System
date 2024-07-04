import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCurrentUser, confirmLogout } from "../Utils/Utils";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  DirectionsCar as ParkingIcon,
  CalendarToday as CalendarIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Feedback as FeedbackIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const useStyles = {
  appBar: {
    backgroundColor: "#2D4354",
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 240,
      backgroundColor: "#1B2A36",
      color: "#ecf0f1",
    },
  },
  menuItem: {
    color: "#ecf0f1",
    "&:hover": {
      backgroundColor: "#534145",
    },
  },
  logo: {
    flexGrow: 1,
    cursor: "pointer",
    color: "#FE5D7A5",
    fontWeight: "bold",
  },
  icon: {
    color: "#ecf0f1",
  },
};

const AppBarStyled = styled(AppBar)(useStyles.appBar);
const DrawerStyled = styled(Drawer)(useStyles.drawer);
const MenuItemStyled = styled(ListItem)(useStyles.menuItem);
const IconStyled = styled(IconButton)(useStyles.icon);

export default function Navbar({ setIsLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    confirmLogout({ setIsLoggedIn, navigate });
  };

  useEffect(() => {
    fetchCurrentUser(
      setUserRole,
      () => {},
      () => {},
      setUserRole
    );
  }, []);

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/home" },
    { label: "Parking Spots", icon: <ParkingIcon />, path: "/parking-spots" },
    { label: "Services", icon: <BuildIcon />, path: "/services" },
    { label: "Reservations", icon: <CalendarIcon />, path: "/reservations" },
    { label: "Payments", icon: <MoneyIcon />, path: "/payments" },
    {
      label: "Notifications",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
    { label: "Profile", icon: <PersonIcon />, path: "/profile" },
    { label: "Feedback", icon: <FeedbackIcon />, path: "/feedbacks" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { label: "Info", icon: <InfoIcon />, path: "/info" },
  ];

  if (userRole === "ADMIN") {
    navItems.push({ label: "Users", icon: <PeopleIcon />, path: "/users" });
  }

  return (
    <AppBarStyled position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          style={useStyles.logo}
          onClick={() => navigate("/home")}
        >
          MGMS
        </Typography>
        <IconStyled
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconStyled>
        <DrawerStyled anchor="left" open={isOpen} onClose={handleDrawerToggle}>
          <List>
            {navItems.map((item, index) => (
              <MenuItemStyled
                button
                key={index}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
              >
                <ListItemIcon style={useStyles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MenuItemStyled>
            ))}
            <MenuItemStyled button onClick={handleLogout}>
              <ListItemIcon style={useStyles.icon}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItemStyled>
          </List>
        </DrawerStyled>
      </Toolbar>
    </AppBarStyled>
  );
}
