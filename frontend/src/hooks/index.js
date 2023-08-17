import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeProvider";
import { NotificationContext } from "../Context/NotificationProvider";
import { AuthContext } from "../Context/AuthProvider";

export const useTheme = ()=> useContext(ThemeContext)

export const useNotification = ()=>useContext(NotificationContext)

export const useAuth = ()=> useContext(AuthContext)